import { mountApp } from "@pixel-builder/core"
import App from "@src/app.vue"

// create Application
mountApp("#app", App, {
  routes: [
    { path: "/", component: () => import("@src/scenes/menu.vue") },
    { path: "/main", component: () => import("@src/scenes/main.vue") },
  ],
  locales: ["en", "ja"],
  messages: {
    en: {
      message: "Hello",
    },
    ja: {
      message: "こんにちわ",
    },
  },
})
