# Asset Handling

## Description

One of the key feature of Pixel Builder is the asset build pipeline. It can detect which assets are used or not, and optimize them on the fly if needed.

This is a guarantee that the build stay small and not polluted with unused assets from early development stages.

## Import Asset

### Importing Asset as URL

```ts
import imgUrl from "@assets/img.png"

document.getElementById("hero-img").src = imgUrl
```

### Importing Asset in CSS

```sass
.background
    background: url('/assets/img.png')
```

### Importing Asset in Vue

```vue
<img src="/assets/img.png" />
```

### Importing Asset as String

Assets can be imported as strings using the `?raw` suffix.

```ts
import shaderString from "@assets/shader.glsl?raw"
```

## Asset Processing

By default, Pixel Builder will try to optimize assets for you. But you can explicitely ask for some settings if you already know what you want.

```vue
<img src="/assets/logo.png?width=512" />
```

This will automatically resize the assets to fit in 512 pixel
