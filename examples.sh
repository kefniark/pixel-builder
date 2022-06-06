#!/bin/sh

# Cleanup
echo "Cleanup"
rm -rf ./examples
rm -rf ./website/pages/.vuepress/dist/examples
mkdir -p ./examples
mkdir -p ./website/pages/.vuepress/dist/examples

# Pixi Example
echo "Create PixiJS Example"
yarn pixel create examples/pixi -t pixi -f lint,test
cd examples/pixi
yarn build
cd ../..
mv ./examples/pixi/build/web ./website/pages/.vuepress/dist/examples/pixi
    
# BabylonJS Example
echo "Create BabylonJS Example"
yarn pixel create examples/babylon -t babylon -f lint,test
cd examples/babylon
yarn build
cd ../..
mv ./examples/babylon/build/web ./website/pages/.vuepress/dist/examples/babylon

# Minimalist Example
echo "Create JS13K Example"
yarn pixel create examples/js13k -t mini -f lint,test
cd examples/js13k
yarn build
cd ../..
mv ./examples/js13k/build/web ./website/pages/.vuepress/dist/examples/js13k