import { mountApp } from "@pixel-builder/core"
import App from "./app.vue"

// create Application
mountApp("#app", App, {
  routes: [
    { path: "/", component: () => import("./scenes/menu.vue") },
    { path: "/main", component: () => import("./scenes/main.vue") },
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
