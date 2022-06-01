import { createApp, Component } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export interface AppConfig {
    routes?: RouteRecordRaw[]
}

export const mountApp = (elementId: string, app: Component, config: AppConfig) => {
    const application = createApp(app)

    const router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes: config.routes || [],
        history: createWebHistory()
    })

    application.use(router)
    application.mount(elementId)
}
