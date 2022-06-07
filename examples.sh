#!/bin/sh

# Cleanup
echo "Cleanup"
rm -rf ../pixel-builder-examples/projects
mkdir ../pixel-builder-examples/projects

# Enforce tools install (like pixel)
yarn
yarn build

# Pixi Example
echo "Create PixiJS Example"
node libs/cli/dist/index.js create ../pixel-builder-examples/projects/pixi -t pixi -f lint,test
cd ../pixel-builder-examples/projects/pixi
yarn build

# BabylonJS Example
# echo "Create BabylonJS Example"
# node libs/cli/dist/index.js create ../pixel-builder-examples/projects/babylon -t babylon -f lint,test
# cd examples/babylon
# yarn build -- --base=/pixel-builder/examples/babylon/
# cd ../..
# mv ./examples/babylon/build/web ./website/pages/.vuepress/dist/examples/babylon

# Minimalist Example
# echo "Create JS13K Example"
# node libs/cli/dist/index.js create ../pixel-builder-examples/projects/js13k -t mini -f lint,test
# cd examples/js13k
# yarn build -- --base=/pixel-builder/examples/js13k/
# cd ../..
# mv ./examples/js13k/build/web ./website/pages/.vuepress/dist/examples/js13k