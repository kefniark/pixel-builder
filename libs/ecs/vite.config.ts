import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        port: 6700
    },
    build: {
        outDir: './dist',
        minify: true,
        lib: {
            entry: path.resolve(__dirname, 'src/ecs/index.ts'),
            name: 'engine',
            formats: ['es'],
            fileName: () => `index.js`
        },
        rollupOptions: {
            external: ['vue', 'vue-router']
        }
    }
})
