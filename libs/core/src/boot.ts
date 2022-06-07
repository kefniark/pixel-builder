import { createApp, Component } from "vue"
import { createI18n, Locale, LocaleMessages, VueMessageType } from "vue-i18n"
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { createPinia } from "pinia"

export interface AppConfig {
  routes?: RouteRecordRaw[]
  locales?: Locale[]
  messages?: LocaleMessages<VueMessageType>
}

export const mountApp = (elementId: string, app: Component, config: AppConfig) => {
  const application = createApp(app)

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: config.routes || [],
    history: createWebHashHistory(),
  })

  const locales = config.locales ?? ["en"]

  const i18n = createI18n({
    locale: locales[0],
    fallbackLocale: locales,
    messages: config.messages ?? {},
  })

  application.use(router)
  application.use(i18n)
  application.use(createPinia())
  application.mount(elementId)
  return application
}
