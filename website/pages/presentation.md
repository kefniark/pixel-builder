# Pixel Builder

## Description

Pixel Builder can be seen as a **Toolbox to Build HTML5 Games**.

It's a simple CLI tool that tries to solve 3 common problems:

- Starting Project Faster
- Better Development Tooling
- Build Pipeline

**Pixel Builder** is about tooling, and has almost no impact on the game code itself. If you are already used to build **Games** or **Applications** with libraries like PixiJS, BabylonJS, no new API to learn ... you will feel at home.

Let's see each point individually

## 🚀 Project Boostrap

Starting a new project is usually really time consuming when working on web projects.

- Lot of possible Libraries
- Lot of configurations and incompatibilities
- Lot of knowledge required

**Pixel Builder** comes with a set of questions and pre-configure the project for your needs.

You can start working on your game in minutes without having to worry about the setup or configuration files. We figure things out, so you don't have to.

Every choice is transparent and easy to change, from there feel free to add libraries or features.

## ⚙️ Development Tooling

### 1. Developer Experience

Out of the box, **Pixel Builder** comes with expected modern development features

- Development server
- HMR (Auto Reload)
- Pre-compilers (Typescript, Sass, ...)

One command `yarn dev` and you can work on your game

Under the hood it use [Vite](https://vitejs.dev/) known for his speed

### 2. Dealing with Assets

Dealing with assets is always a challenge for games, but more specifically with web games.

Games often require quick iterations, and a ton of assets. Which lead to unused or duplicated assets, that are slowing down the project and making the build grow.

**Pixel Builder** will help you with most common tasks

- cleaning asset folder
- generating spritesheet
- image optimization, resize
- audio optimization

Our goal is to provide you tools to simplify your life.

No crazy dependencies or GUI app to manually install, just use our asset manifest to explicit your needs and we get you covered.

## 📦 Build

Finally and maybe the most important one, the build pipeline.

Anyone who already spend hours fighting with webpack, gulp or babel will be please to know they have nothing to do. One command `yarn build` and you are ready to publish your game

### 1. Optimized by default

Web Games have to be performant and load fast, which require both code and assets to be small.

- We export only used assets (asset stripping)
- Code is minified and use modern techniques to keep it small (code splitting, tree shaking, ...)
- The build process is fast

### 2. Easy to Share

Web games can be annoying to share sometime, to help with that we provide you few options:

- We build as **Single Page App** by default : Static files that can be host anywhere (ftp, github, ...)
- We can build desktop app with [NeutralinoJS](https://github.com/neutralinojs/neutralinojs) (Windows, Linux, Mac): Easy to share for Game Jams or [itch.io](https://itch.io/)
