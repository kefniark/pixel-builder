# Building

## Description

By default, a project is build for the web and you just have to run

```sh
yarn build
```

And your build files should be exported under `./build`

## Base

For some deployment, you may need to host the game in a subfolder and not the root of your domain. Something which may cause some URL issues.

For that, you can specify a subfolder at build time to rewrite the URLs

```sh
yarn build --base=/myfolder/
```

## Define

Soon

## Desktop App

Soon
