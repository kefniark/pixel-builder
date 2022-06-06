#!/bin/sh

# Cleanup
echo "Cleanup"
rm -rf ./examples
rm -rf ./website/pages/.vuepress/dist/examples
mkdir -p ./examples
mkdir -p ./website/pages/.vuepress/dist/examples

# Enforce tools install (like pixel)
yarn
yarn build

# Pixi Example
echo "Create PixiJS Example"
node libs/cli/dist/index.js create examples/pixi -t pixi -f lint,test
cd examples/pixi
yarn build -- --base=/pixel-builder/examples/pixi/
cd ../..
mv ./examples/pixi/build/web ./website/pages/.vuepress/dist/examples/pixi

# BabylonJS Example
echo "Create BabylonJS Example"
node libs/cli/dist/index.js create examples/babylon -t babylon -f lint,test
cd examples/babylon
yarn build -- --base=/pixel-builder/examples/babylon/
cd ../..
mv ./examples/babylon/build/web ./website/pages/.vuepress/dist/examples/babylon

# Minimalist Example
echo "Create JS13K Example"
node libs/cli/dist/index.js create examples/js13k -t mini -f lint,test
cd examples/js13k
yarn build -- --base=/pixel-builder/examples/js13k/
cd ../..
mv ./examples/js13k/build/web ./website/pages/.vuepress/dist/examples/js13k