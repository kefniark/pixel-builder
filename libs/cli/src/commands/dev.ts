import { assetTransform } from "./assets"
import path from 'path'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'

export default async () => {
    console.log('[Pixel Builder] Dev Command')
    const server = await createServer({
        configFile: false,
        root: path.resolve('src'),
        plugins: [vue(), assetTransform()],
        server: {
            port: 1337
        }
    })
    await server.listen()

    server.printUrls()
}