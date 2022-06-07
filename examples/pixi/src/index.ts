import { mountApp } from "@pixel-builder/engine"
import App from "./app.vue"
import IntroScene from "@src/scenes/intro.vue"
import MenuScene from "@src/scenes/menu.vue"

// create Application
mountApp("#app", App, {
  routes: [
    { path: "/", component: IntroScene },
    { path: "/menu", component: MenuScene },
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
