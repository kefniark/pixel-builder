# Building

## Description

By default, a project is build for the web and you just have to run

```sh
yarn build
```

- Your build files will be available under `./build/web`
- Your game is exported as a **SPA** (**S**ingle **P**age **A**pp)
- A single `index.html` file, and only static asset files (no server or config required)

## Base

By default, we use relative path, but for some deployment, you may need to expose the game in a subfolder and not the root of your domain. Something which may cause some URL issues.

For that, you can specify a subfolder at build time to rewrite URLs and assets

```sh
yarn build --base=/myfolder/
```

## Define

Soon

## Desktop App

Soon
