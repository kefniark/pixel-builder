# Pixel Builder
**Modern Framework to build HTML5 games**

> Still under development

## Description
Nowadays we can find lot of good HTML5 Engines for both 2D and 3D (pixi.js, babylon, ...)

But building a solid stack around can be quite time consuming. There are lot of things to take care of (assets, tooling, config files, webpack, ...)
The idea of Pixel Builder is to let you use your favorite WebGL Renderer, but provide you all the tools you need to speedup your development and workflow.

Focus on your game, we take care of the tech stack!

## Stack
* [Vue3](https://vuejs.org/) (vue-router, vue-i18n, pinia)
* [Typescript](https://www.typescriptlang.org/): *TypeScript is JavaScript with syntax for types*
* [Vite](https://vitejs.dev/): *Lightning fast build*
* [ECS](./libs/ecs/README.md) (Entity, Component, System): *Modular Code Stucture*
* Tools to generate spritesheet and optimize assets
* Build you games for the Web, or as a standalone application (Windows, Mac or Linux)

## Templates
This project will come with a set of predefined templates (flavor) for different type of usages
* minimalist: js13k
* 2d: pixi.js
* 3d: babylonJS

---

## Getting Started

```
SOON!
```

---

### Sub Projects
- [@pixel-builder/ecs](./libs/ecs/README.md): ECS for Pixel Builder
- [@pixel-builder/cli](./libs/cli/): CLI tool to create, build your Pixel Project
- [@pixel-builder/engine](./libs/engine/): Helpers to make project configuration easier
