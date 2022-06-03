import { existsSync, mkdirSync } from "fs"
import { assetTransform } from "./assets"
import path from "path"
import { build as builder, createServer, preview as previewer, BuildOptions } from "vite"
import vue from "@vitejs/plugin-vue"

const plugins = [vue(), assetTransform()]

const buildOpt: BuildOptions = {
  polyfillModulePreload: false,
  minify: "terser",
  // outDir: path.resolve(".pixel/resources"),
  outDir: path.resolve("build"),
  emptyOutDir: true,
  terserOptions: {
    ecma: 2020,
    // mangle: { properties: true },
    module: true,
    sourceMap: false,
    toplevel: true,
  },
}

export const build = async () => {
  console.log("[Pixel Builder] Build Command")
  if (!existsSync(".pixel")) mkdirSync(".pixel")
  if (!existsSync("build")) mkdirSync("build")
  await builder({
    root: path.resolve("src"),
    plugins,
    publicDir: "../public",
    mode: "production",
    build: buildOpt,
  })
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
  })

  previewServer.printUrls()
}

export const dev = async () => {
  console.log("[Pixel Builder] Dev Command")
  const server = await createServer({
    configFile: false,
    root: path.resolve("src"),
    plugins,
    publicDir: "../public",
    build: buildOpt,
    server: {
      port: 1337,
    },
  })
  await server.listen()

  server.printUrls()
}
