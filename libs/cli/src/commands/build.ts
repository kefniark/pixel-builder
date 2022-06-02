import { existsSync, mkdirSync } from "fs"
import { assetTransform } from "./assets"
import path from "path"
import { build } from "vite"
import vue from "@vitejs/plugin-vue"

export default async () => {
  console.log("Building", path.resolve("src"))
  console.log("[Pixel Builder] Build Command")
  if (!existsSync(".pixel")) mkdirSync(".pixel")
  if (!existsSync(".pixel/resources")) mkdirSync(".pixel/resources")
  await build({
    root: path.resolve("src"),
    plugins: [vue(), assetTransform()],
    build: {
      minify: "terser",
      outDir: path.resolve(".pixel/resources"),
      emptyOutDir: true,
    },
  })
}
