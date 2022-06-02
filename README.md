# Pixel Builder
**Modern Framework to build HTML5 games**

> Still under development

## Description
Nowadays we can find lot of good HTML5 Engines for both 2D and 3D (pixi.js, babylon, ...)
But building a solid stack around can be quite time consuming. There are lot of things to take care of (assets, UI, tooling, config files, webpack, ...)

The idea of Pixel Builder is to let you use your Renderer of choice, but provide you all the tools you need around to speedup your development workflow.

Focus on your game, we take care of your tech stack!

## Stack
* [Vue3](https://vuejs.org/) (vue-router, vue-i18n, pinia)
* [Typescript](https://www.typescriptlang.org/): *TypeScript is JavaScript with syntax for types*
* [Vite](https://vitejs.dev/): *Lightning fast build*
* **Code splitting** and **Tree shaking** to keep the compiled code small
* Tools to optimize assets on the fly (resize, optimize)
* Build for Web, Windows, Mac and Linux

## Features

During the project creation, you will be able to pick between the following features

| Category | Libraries  |   |   |   |
|---|---|---|---|---|
| Code Structure | [*Entity Component System*](./libs/ecs/README.md) |
| Renderer | **Minimalist**: Canvas | **2D**: [Pixi.js](https://pixijs.com/) | **3D**: [BabylonJS](https://www.babylonjs.com/) | 
| Interface | [Vue3](https://vuejs.org/)
| Physics/Collision | [P2.js](https://github.com/schteppe/p2.js/) |
| Audio | [Howler.js](https://howlerjs.com/) |
| Localization | [Vue-i18n](https://kazupon.github.io/vue-i18n/)
| Data Store | [Pinia](https://pinia.vuejs.org/)

---

## Getting Started

```sh
# Create a new project
pixel create pixel-project

# Go inside and get it ready
cd pixel-project
yarn install

# And usual commands
yarn dev # start a dev server with auto-reload
yarn build # make a production build
yarn lint # check if the test is linted
yarn test # run test
```

---

### Sub Projects
- [@pixel-builder/ecs](./libs/ecs/README.md): ECS for Pixel Builder
- [@pixel-builder/cli](./libs/cli/): CLI tool to create, build your Pixel Project
- [@pixel-builder/core](./libs/core/): Helpers to make project configuration easier