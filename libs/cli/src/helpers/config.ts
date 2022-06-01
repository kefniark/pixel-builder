import path from 'path'
import { parse } from 'yaml'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import merge from 'deepmerge'

export interface PixelConfigEntity {
    sprite: string
    width: number
    height: number
}

export interface PixelConfigAsset {
    files: string
    output: string
    trim: boolean
    padding: number
    tile: number
    extrude: boolean
    skipExtension: boolean
}

export interface PixelConfig {
    project: {
        assets_folder: string
        entities_folder: string
    }
    entities: Record<string, PixelConfigEntity>
    assets: {
        spritesheets: PixelConfigAsset[]
    }
}

export const pixelDefaultEntity: PixelConfigEntity = {
    sprite: '',
    width: 16,
    height: 16
}

export const pixelDefaultAsset: PixelConfigAsset = {
    files: '*.{png,jpg}',
    output: 'spritesheet.png',
    trim: true,
    padding: 2,
    tile: 0,
    extrude: true,
    skipExtension: true
}

export const pixelDefaultConfig: PixelConfig = {
    project: {
        assets_folder: 'src/assets',
        entities_folder: 'src/entities'
    },
    entities: {},
    assets: {
        spritesheets: []
    }
}

export function getPixelConfig() {
    const p = path.resolve('pixel.yml')
    if (!existsSync(p)) throw new Error('pixel.yml not found !')

    const config = parse(readFileSync(p, 'utf-8'))
    return merge(pixelDefaultConfig, config) as PixelConfig
}

export function toNumber(val: number | string, def: number) {
    if (val === undefined) return def
    try {
        return parseInt(val.toString(), 10)
    } catch {}
    return def
}

export function toBool(val: number | string, def: boolean) {
    if (val === undefined) return def
    return !!val
}

export function assetPath(config: PixelConfig, filepath: string) {
    return path.join(config.project.assets_folder, filepath).replace(/\\/g, "/")
}