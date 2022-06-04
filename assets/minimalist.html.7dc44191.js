import{_ as e,o as i,c as a,a as t}from"./app.16665c88.js";const o={},n=t('<h1 id="minimalist" tabindex="-1"><a class="header-anchor" href="#minimalist" aria-hidden="true">#</a> Minimalist</h1><p>Template Dedicated to small experimentations, the goal of this template is to make the output as small as possible. Well designed to fit in Game Jam or Coding Competition.</p><p>We basically kept the tooling and developer niceties, but removed everything which may take space in the build code. No Vue, no engine, no renderer.</p><p>Back to the basic with straight canvas or SVG operations \u{1F604}</p><h2 id="build-process" tabindex="-1"><a class="header-anchor" href="#build-process" aria-hidden="true">#</a> Build Process</h2><p>We customized a bit our build pipeline for this template to make it even smaller.</p><ul><li>No Polyfill</li><li>More agressive Terser configuration (code minification)</li><li>Use Roadroller to Flatten your code</li><li>Merging JS/CSS into a single index.html</li><li>Agressive Zip compession</li></ul><h2 id="focus-on-building-your-game" tabindex="-1"><a class="header-anchor" href="#focus-on-building-your-game" aria-hidden="true">#</a> Focus on building your game</h2><p>Like other templates, we make everything as transparent and smooth as possible. Just run <code>yarn build</code> and you will get your project build, zip and optimized.</p>',9),s=[n];function l(r,d){return i(),a("div",null,s)}var m=e(o,[["render",l],["__file","minimalist.html.vue"]]);export{m as default};