import { createApp } from "vue"
import { createI18n } from "vue-i18n"
import { createRouter, createWebHashHistory } from "vue-router"
import App from "@src/app.vue"
import IntroScene from "@src/scenes/intro.vue"
import MenuScene from "@src/scenes/menu.vue"

// create Application
const application = createApp(App)

// vue-routers
const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    { path: "/", component: IntroScene },
    { path: "/menu", component: MenuScene },
    { path: "/main", component: () => import("@src/scenes/main.vue") },
    { path: "/:catchAll(.*)*", component: MenuScene }, // you can customize 404 error here
  ],
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
