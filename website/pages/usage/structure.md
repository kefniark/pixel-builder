# Folder Structure

## Description

The folder structure is quite standard for a vue project and quite minimal:

- `public/`: Everything in this folder will be copied over to the build (favicon, robot.txt, ...)
- `src/`:
  - `assets/`: For game assets (strip and optimized)
  - `scenes/`: Vue files for pages
  - `app.vue`: The main layout of the application
  - `index.html`: The base HTML of the app
  - `index.ts`: Bootstrap of the app
- `package.json`: The manifest of the project

## Path Alias

To make import of files across the projects easier, and avoid crazy relative path like `../../../../index.ts`

Few alias are available:

- `@src` : Root of the source code `./src`
- `@assets` : Root of the asset folder `./src/assets`

Examples:

```ts
import { Board } from "@src/game/board"
import BoardSprite from "@assets/game/board.png"
```
