import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs"
import { assetTransform } from "./assets"
import path from "path"
import { build as builder, createServer, preview as previewer, BuildOptions } from "vite"
import vue from "@vitejs/plugin-vue"
import AdmZip from "adm-zip"
import { InputAction, InputType, Packer } from "roadroller"
import { getPixelConfig } from "../helpers/config"
const { execFile } = require("child_process")
const advzip = require("advzip-bin")

const plugins = [vue(), assetTransform()]

const buildOpt: BuildOptions = {
  polyfillModulePreload: false,
  minify: "terser",
  outDir: path.resolve("build/web"),
  emptyOutDir: true,
  terserOptions: {
    ecma: 2020,
    module: true,
    sourceMap: false,
    toplevel: true,
  },
}

const optimize = async (buildFolder: string, compressedFolder: string, files: string[]) => {
  const css = files.filter((x) => path.extname(x) === ".css")
  const html = files.filter((x) => path.extname(x) === ".html")
  const js = files.filter((x) => path.extname(x) === ".js")
  const jsInput = js.map((x) => ({
    data: readFileSync(path.join(buildFolder, x), "utf-8"),
    type: InputType.JS,
    action: InputAction.Eval,
  }))

  // minify JS
  const packer = new Packer(jsInput, {})
  await packer.optimize(1)

  const { firstLine, secondLine } = packer.makeDecoder()

  let htmlContent = readFileSync(path.join(buildFolder, html[0]), "utf-8")
  const searchJS = `<script type="module" crossorigin src="/${js[0]}"></script>`
  const matchScript = htmlContent.match(searchJS)
  if (matchScript) {
    const index = matchScript.index as number
    htmlContent = `${htmlContent.slice(0, index)}<script type="module">
${firstLine}
${secondLine}
  </script>${htmlContent.slice(index + searchJS.length)}`
  }

  const searchCSS = `<link rel="stylesheet" href="/${css[0]}">`
  const matchStyle = htmlContent.match(searchCSS)
  if (matchStyle) {
    const index = matchStyle.index as number
    htmlContent = `${htmlContent.slice(0, index)}<style>${readFileSync(
      path.join(buildFolder, css[0]),
      "utf-8"
    )}</style>${htmlContent.slice(index + searchCSS.length)}`
  }

  writeFileSync(path.join(compressedFolder, "_index.html"), htmlContent)

  // add file to zip
  const zip = new AdmZip()
  zip.addFile("index.html", readFileSync(path.join(compressedFolder, "_index.html")))
  await zip.writeZipPromise(path.join(compressedFolder, "build.zip"))

  // use ADVZip (https://linux.die.net/man/1/advzip)
  await new Promise((resolve) => {
    execFile(advzip, ["--recompress", "--shrink-extra", path.join(compressedFolder, "build.zip")], (err: unknown) => {
      if (err) console.warn(err)
      resolve(true)
    })
  })

  // measure size and log
  const res = statSync(path.join(compressedFolder, "build.zip"))
  console.log("------")
  console.log(`Exported: ${path.join(compressedFolder, "build.zip")}`)
  console.log(`Size: ${Math.round((res.size / 1024) * 100) / 100}KB`)
}

export const build = async () => {
  console.log("[Pixel Builder] Build Command")
  const config = getPixelConfig()
  const def = config.define["production"] ?? {}
  if (!existsSync(".pixel")) mkdirSync(".pixel")
  if (!existsSync("build")) mkdirSync("build")
  if (!existsSync("build/web")) mkdirSync("build/web")
  const output = (await builder({
    root: path.resolve("src"),
    plugins,
    define: def,
    publicDir: "../public",
    mode: "production",
    build: buildOpt,
    resolve: {
      alias: {
        "@assets": path.resolve(process.cwd(), "./src/assets/"),
        "@src": path.resolve(process.cwd(), "./src/"),
      },
    },
  })) as { output: { fileName: string }[] }

  if (config.build.mode === "zip") {
    if (!existsSync("build/compressed")) mkdirSync("build/compressed")
    const buildFolder = path.join("build", "web")
    const compressedFolder = path.join("build", "compressed")
    const files = output.output.map((x) => x.fileName).filter((x) => !!x)
    await optimize(buildFolder, compressedFolder, files)
  }
}

export const preview = async () => {
  console.log("[Pixel Builder] Preview Command")
  if (!existsSync(".pixel")) mkdirSync(".pixel")
  if (!existsSync("build")) mkdirSync("build")
  const previewServer = await previewer({
    root: path.resolve("src"),
    plugins,
    publicDir: "../public",
    build: buildOpt,
    preview: {
      port: 8080,
      open: true,
    },
    resolve: {
      alias: {
        "@assets": path.resolve(process.cwd(), "./src/assets/"),
        "@src": path.resolve(process.cwd(), "./src/"),
      },
    },
  })

  previewServer.printUrls()
}

export const dev = async () => {
  console.log("[Pixel Builder] Dev Command")
  const config = getPixelConfig()
  const def = config.define["develop"] ?? {}
  const server = await createServer({
    configFile: false,
    root: path.resolve("src"),
    plugins,
    define: def,
    publicDir: "../public",
    mode: "develop",
    build: buildOpt,
    server: {
      port: 1337,
    },
    resolve: {
      alias: {
        "@assets": path.resolve(process.cwd(), "./src/assets/"),
        "@src": path.resolve(process.cwd(), "./src/"),
      },
    },
  })
  await server.listen()

  server.printUrls()
}
