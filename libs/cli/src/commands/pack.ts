import path from "path"
import { writeFileSync } from "fs"
import sharp from "sharp"
import { GrowingPacker } from "binpacking"
import { glob } from "glob"
import { assetPath, getPixelConfig, pixelDefaultAsset, toNumber } from "../helpers/config"
import merge from "deepmerge"

interface SpritesheetConfig {
  padding: number
  tile: number
  trim: boolean
  extrude: boolean
  skipExtension: boolean
}

interface SpritesheetBlock {
  path: string
  buffer: Buffer
  src: { w: number; h: number }
  trim: { x: number; y: number; w: number; h: number; used: boolean }
  w: number
  h: number
  fit?: { x: number; y: number }
}

interface PackOptions {
  format: string
  output: string
  padding: string
  tile: string
  trim: boolean
  skipExtension: boolean
  extrude: boolean
}

const toSpritesheet = async (input: string[], output: string, cfg: SpritesheetConfig) => {
  const blocks: SpritesheetBlock[] = []

  const animations = new Map<string, { filename: string; number: number; img: string; key: string }[]>()
  for (const img of input) {
    const filename = path.basename(img).replace(path.extname(img), "")
    const arr = filename.match(/[0-9]+$/)
    if (arr !== null) {
      const key = filename.substring(0, filename.length - arr[0].length)
      const values = animations.get(key) || []
      values.push({
        img,
        key,
        filename,
        number: parseInt(arr[0], 10),
      })
      animations.set(key, values)
    }
  }

  for (const img of input) {
    const src = sharp(img)
    const meta = await src.metadata()
    let buffer: Buffer

    const blockTrim = {
      x: 0,
      y: 0,
      w: meta.width || 0,
      h: meta.height || 0,
      used: false,
    }
    if (cfg.trim) {
      const flattened = await src
        .clone()
        .flatten({ background: { r: 255, g: 0, b: 255 } })
        .removeAlpha()
        .toBuffer()

      const { info } = await sharp(flattened).trim().toBuffer({ resolveWithObject: true })

      ;(blockTrim.x = -(info.trimOffsetLeft || 0)),
        (blockTrim.y = -(info.trimOffsetTop || 0)),
        (blockTrim.w = info.width),
        (blockTrim.h = info.height),
        (blockTrim.used = false)

      buffer = await src
        .extract({
          left: blockTrim.x,
          top: blockTrim.y,
          width: blockTrim.w,
          height: blockTrim.h,
        })
        .toBuffer()
    } else {
      buffer = await src.toBuffer()
    }

    const w = cfg.tile === 0 ? blockTrim.w + cfg.padding * 2 : Math.ceil(blockTrim.w / cfg.tile) * cfg.tile
    const h = cfg.tile === 0 ? blockTrim.h + cfg.padding * 2 : Math.ceil(blockTrim.h / cfg.tile) * cfg.tile
    const block = {
      path: img,
      buffer,
      trim: blockTrim,
      src: { w: meta.width || 0, h: meta.height || 0 },
      w,
      h,
    }
    if (block.trim.w !== block.src.w || block.trim.h !== block.src.h) block.trim.used = true
    blocks.push(block)
  }

  if (cfg.extrude) {
    for (const block of blocks) {
      const { data, info } = await sharp(block.buffer)
        .extend({
          top: cfg.padding,
          left: cfg.padding,
          right: cfg.padding,
          bottom: cfg.padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .raw()
        .toBuffer({ resolveWithObject: true })

      const img = new Uint8Array(data)

      const cpPixels = (src: number, dest: number) => {
        img[dest] = img[src]
        img[dest + 1] = img[src + 1]
        img[dest + 2] = img[src + 2]
        img[dest + 3] = img[src + 3]
      }
      const corners = {
        tl: [cfg.padding, cfg.padding],
        tr: [info.width - cfg.padding - 1, cfg.padding],
        bl: [cfg.padding, info.height - cfg.padding - 1],
        br: [info.width - cfg.padding - 1, info.height - cfg.padding - 1],
      }

      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          const idx = y * 4 * info.width + x * 4

          // corners
          if (x < corners.tl[0] && y < corners.tl[1]) cpPixels(corners.tl[1] * 4 * info.width + corners.tl[0] * 4, idx)
          if (x > corners.tr[0] && y < corners.tr[1]) cpPixels(corners.tr[1] * 4 * info.width + corners.tr[0] * 4, idx)
          if (x < corners.bl[0] && y > corners.bl[1]) cpPixels(corners.bl[1] * 4 * info.width + corners.bl[0] * 4, idx)
          if (x > corners.br[0] && y > corners.br[1]) cpPixels(corners.br[1] * 4 * info.width + corners.br[0] * 4, idx)

          // edge
          if (x >= corners.tl[0] && x <= corners.tr[0] && y < corners.tl[1])
            cpPixels(corners.tl[1] * 4 * info.width + x * 4, idx)
          if (x >= corners.tl[0] && x <= corners.tr[0] && y > corners.bl[1])
            cpPixels(corners.bl[1] * 4 * info.width + x * 4, idx)
          if (y >= corners.tl[1] && y <= corners.bl[1] && x < corners.tl[0])
            cpPixels(y * 4 * info.width + corners.tl[0] * 4, idx)
          if (y >= corners.tl[1] && y <= corners.bl[1] && x > corners.tr[0])
            cpPixels(y * 4 * info.width + corners.tr[0] * 4, idx)
        }
      }

      block.buffer = await sharp(img, { raw: info }).png().toBuffer()
    }
  }

  blocks.sort((a, b) => b.h - a.h)
  const packer = new GrowingPacker()
  packer.fit(blocks)

  await sharp({
    create: {
      width: packer.root.w,
      height: packer.root.h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(
      blocks.map((x) => ({
        input: x.buffer,
        top: (x.fit?.y || 0) + (cfg.extrude ? 0 : cfg.padding),
        left: (x.fit?.x || 0) + (cfg.extrude ? 0 : cfg.padding),
      }))
    )
    .toFile(output)

  const manifest = output.replace(path.extname(output), ".json")

  const manifestData = {
    meta: {
      image: path.basename(output),
      size: { w: packer.root.w, h: packer.root.h },
      scale: "1",
    },
    frames: {} as any,
    animations: {} as any,
  }

  for (const block of blocks) {
    let name = path.basename(block.path)
    if (cfg.skipExtension) name = name.replace(path.extname(name), "")
    manifestData.frames[name] = {
      frame: {
        x: (block.fit?.x || 0) + cfg.padding,
        y: (block.fit?.y || 0) + cfg.padding,
        w: block.trim.w,
        h: block.trim.h,
      },
      rotated: false,
      trimmed: block.trim.used,
      spriteSourceSize: {
        x: block.trim.x,
        y: block.trim.y,
        w: block.trim.w,
        h: block.trim.h,
      },
      sourceSize: { w: block.src.w, h: block.src.h },
    }
  }

  for (const anim of animations.entries()) {
    if (anim[1].length <= 1) continue
    anim[1].sort((a, b) => a.number - b.number)
    manifestData.animations[anim[0]] = anim[1].map((x) => x.filename)
  }

  writeFileSync(manifest, JSON.stringify(manifestData, null, 2))

  console.log(`Spritesheet : "${path.relative(".", output)}" Generated !`)
  console.log(`  - ${blocks.length} images`)
  console.log(`  - resolution ${packer.root.w}x${packer.root.h}`)
  console.log(cfg)
}

export default async (files: string, options: PackOptions) => {
  let output = options.output || "spritesheet.png"
  const padding = options.padding !== undefined ? parseInt(options.padding ?? "2") : 2
  const tile = options.tile !== undefined ? parseInt(options.tile ?? "0") : 0
  console.log(options)

  // get from commands
  if (files) {
    const images = glob.sync(files)
    await toSpritesheet(images, output, {
      padding,
      tile,
      trim: options["trim"],
      extrude: options["extrude"],
      skipExtension: options["skipExtension"],
    })
    return
  }

  // load from manifest
  const config = getPixelConfig()
  const assets = config?.assets?.spritesheets || []
  for (const asset of assets) {
    const assetEntry = merge(pixelDefaultAsset, asset)

    console.log(
      config.project.assets_folder,
      assetEntry.files,
      path.join(config.project.assets_folder, assetEntry.files)
    )

    const images = glob.sync(assetPath(config, assetEntry.files))
    if (images.length === 0) {
      console.warn("No src images found for ", path.join(config.project.assets_folder, assetEntry.files), config)
      continue
    }
    await toSpritesheet(images, assetPath(config, assetEntry.output), {
      padding: toNumber(assetEntry.padding, 2),
      tile: toNumber(assetEntry.tile, 0),
      trim: assetEntry.trim,
      extrude: assetEntry.extrude,
      skipExtension: assetEntry.skipExtension,
    })
  }
}
