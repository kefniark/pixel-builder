import{_ as s,o as a,c as e,a as n}from"./app.47b6d3de.js";const t={},i=n(`<h1 id="asset-handling" tabindex="-1"><a class="header-anchor" href="#asset-handling" aria-hidden="true">#</a> Asset Handling</h1><h2 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> Description</h2><p>One of the key feature of Pixel Builder is the asset build pipeline. It can detect which assets are used or not, and optimize them on the fly if needed.</p><p>This is a guarantee that the build stay small and not polluted with unused assets from early development stages.</p><h2 id="importing-asset-as-url" tabindex="-1"><a class="header-anchor" href="#importing-asset-as-url" aria-hidden="true">#</a> Importing Asset as URL</h2><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> imgUrl <span class="token keyword">from</span> <span class="token string">&quot;@assets/img.png&quot;</span>

document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;hero-img&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>src <span class="token operator">=</span> imgUrl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="importing-asset-in-css" tabindex="-1"><a class="header-anchor" href="#importing-asset-in-css" aria-hidden="true">#</a> Importing Asset in CSS</h2><div class="language-sass ext-sass line-numbers-mode"><pre class="language-sass"><code><span class="token selector">.background</span>
<span class="token property-line">    <span class="token property">background</span><span class="token punctuation">:</span> url(&#39;<span class="token operator">/</span>assets<span class="token operator">/</span>img.png&#39;)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="importing-asset-in-vue" tabindex="-1"><a class="header-anchor" href="#importing-asset-in-vue" aria-hidden="true">#</a> Importing Asset in Vue</h2><div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>/assets/img.png<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="importing-asset-as-string" tabindex="-1"><a class="header-anchor" href="#importing-asset-as-string" aria-hidden="true">#</a> Importing Asset as String</h2><p>Assets can be imported as strings using the <code>?raw</code> suffix.</p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> shaderString <span class="token keyword">from</span> <span class="token string">&quot;@assets/shader.glsl?raw&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,13),r=[i];function o(p,d){return a(),e("div",null,r)}var l=s(t,[["render",o],["__file","assets.html.vue"]]);export{l as default};
