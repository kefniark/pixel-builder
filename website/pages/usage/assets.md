# Asset Handling

## Description

One of the key feature of Pixel Builder is the build pipeline. It can detect which assets are used or not, and optimize them on the fly if needed.

This guarantee that the build stay small and not poluted with lot of unused assets from early development stages.

## Importing Asset as URL

```ts
import imgUrl from "@assets/img.png"

document.getElementById("hero-img").src = imgUrl
```

## Importing Asset in CSS

```sass
.background
    background: url('/assets/img.png')
```

## Importing Asset in Vue

```vue
<img src="/assets/img.png">
```

## Importing Asset as String

Assets can be imported as strings using the ?raw suffix.

```ts
import shaderString from "@assets/shader.glsl?raw"
```
