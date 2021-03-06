# Minimalist Template

## Description

Template Dedicated to small experimentations, the goal of this template is to have an output as small as possible. Well designed to fit in Game Jam or Coding Competition.

We basically kept the tooling and developer niceties, but removed everything else which may take space in the build code. No Vue, no engine, no renderer.

Back to the basic with straight canvas or SVG operations :smile:

## Getting Started

```sh
pixel create mini-project -t mini
cd mini-project
yarn dev
```

## Demo

To see what a Minimalist Template looks like:

- [Code](https://github.com/kefniark/pixel-builder-examples/tree/develop/projects/js13k)
- [Preview](https://kefniark.github.io/pixel-builder-examples/js13k)

## Build Process

We customized a bit our build pipeline for this template to make it even smaller.

- No Polyfill
- More agressive Terser configuration (code minification)
- Use Roadroller to Flatten your code
- Merging JS/CSS into a single index.html
- Agressive Zip compession

## Focus on building your game

Like other templates, we make everything as transparent and smooth as possible.
Just run `yarn build` and you will get your project build, zip and optimized.
