import { PluginOption } from "vite"
import crc32 from "crc/crc32"

const path = require("path")
const { copyFileSync, existsSync, mkdirSync, createReadStream, readFileSync } = require("fs")
const { normalizePath } = require("vite")
const { createFilter } = require("@rollup/pluginutils")
const { createHash } = require("crypto")
const sharp = require("sharp")

interface AssetTransformOption {
  resize: number
  quality: number
}

export function assetTransform() {
  const include = "**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}"
  const exclude = "public/**/*"
  const options: AssetTransformOption = {
    resize: 1280,
    quality: 90,
  }
  const resourceFolder = `assets`

  const filter = createFilter(include, exclude)
  const parseURL = (rawURL: string) => new URL(rawURL.replace(/#/g, "%23"), "file://")
  const generateAssetId = (imgPath: string, url: URL, config: AssetTransformOption) => {
    const baseURL = url.host ? new URL(url.origin + url.pathname) : new URL(url.protocol + url.pathname)
    const fileHash = crc32(readFileSync(imgPath)).toString(16)
    const hash = createHash("sha1")
      .update(baseURL.href)
      .update(JSON.stringify({ ...config, crc: fileHash }))
      .digest("hex")

    const ext = path.extname(url.pathname)
    const base = path.basename(url.pathname).replace(ext, "")
    return `${base}.${hash.slice(0, 8)}`
  }
  const buildExportCode = (modulePath: string, prefix = "") => `${prefix}\nexport default ${JSON.stringify(modulePath)}`
  const url = (url: string) => normalizePath(path.join(url))
  const processAsset = async (input: string, id: string) => {
    const tmpPathDir = path.join("./.pixel/cache")
    const tmpPath = path.join(tmpPathDir, `${id}.webp`).replace(/\\/g, "/")
    if (!existsSync(".pixel")) mkdirSync(".pixel")
    if (!existsSync(tmpPathDir)) mkdirSync(tmpPathDir)
    if (!existsSync(tmpPath)) {
      await sharp(input)
        .resize({
          width: options.resize,
          height: options.resize,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .webp({ quality: options.quality })
        .toFile(tmpPath)
    }
    return tmpPath
  }

  const assetsToCopy: Map<string, { src: string; cache: string; id: string }> = new Map()

  return {
    name: "resource-prepare",
    enforce: "pre",
    configResolved(cfg) {},
    async generateBundle({ file, dir }) {
      console.log("generateBundle", file, dir, assetsToCopy)
      const outputDir = path.join(dir, resourceFolder)
      if (!existsSync(outputDir)) mkdirSync(outputDir)
      for (const asset of assetsToCopy.values()) {
        const src = asset.cache
        const dest = path.join(outputDir, `${asset.id}.webp`)
        if (!existsSync(dest)) {
          copyFileSync(normalizePath(src), normalizePath(dest))
        }
      }
    },
    async resolveId(id, importer) {
      if (!filter(id)) return null
      if (id.startsWith(`/${resourceFolder}`)) return
      if (path.isAbsolute(id)) return

      const srcURL = parseURL(id)
      const newid = generateAssetId(path.join("./src", id), srcURL, options)
      console.log("resolve id", id, importer, `/${resourceFolder}/${newid}.webp`)
      return url(`/${resourceFolder}/${newid}.webp`)
    },
    async load(id) {
      if (!filter(id)) return null

      const srcURL = parseURL(id)
      console.log("load", id, srcURL)
      const newid = generateAssetId(id, srcURL, options)

      const tmpPath = await processAsset(srcURL.href, newid)
      assetsToCopy.set(`/${resourceFolder}/${newid}.webp`, {
        src: srcURL.href,
        cache: tmpPath,
        id: newid,
      })

      return buildExportCode(path.join(`/${resourceFolder}/${newid}.webp`))
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const meta = assetsToCopy.get(req.url || "")
        if (meta) {
          res.setHeader("Content-Type", `image/webp`)
          res.setHeader("Cache-Control", "max-age=360000")
          return createReadStream(meta.cache).pipe(res)
        }

        if (filter(req.url) && !req.url?.includes(".pixel")) {
          const imgPath = normalizePath(path.join(server.config.root, req.url))
          const srcURL = parseURL(imgPath)
          const newid = generateAssetId(imgPath, srcURL, options)
          processAsset(srcURL.href, newid).then((tmpPath) => {
            res.setHeader("Content-Type", `image/webp`)
            res.setHeader("Cache-Control", "max-age=360000")
            return createReadStream(tmpPath).pipe(res)
          })
          return
        }

        next()
      })
    },
  } as PluginOption
}
