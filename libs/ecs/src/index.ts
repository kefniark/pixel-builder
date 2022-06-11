import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import { createRouter, createWebHashHistory } from "vue-router"
import App from "./app.vue"

// create Application
const application = createApp(App)

// vue-routers
const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [],
  history: createWebHashHistory(""),
})
application.use(router)

// i18n (translations)
application.use(
  createI18n({
    locale: "en",
    fallbackLocale: ["en", "ja"],
    messages: {
      en: {
        message: "Hello",
      },
      ja: {
        message: "こんにちわ",
      },
    },
  })
)

// mount in HTML Dom
router.isReady().then(() => application.mount("#app"))
