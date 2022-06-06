import{_ as n,o as a,c as s,a as e}from"./app.3fc22951.js";const i={},l=e(`<h1 id="pixel-cli" tabindex="-1"><a class="header-anchor" href="#pixel-cli" aria-hidden="true">#</a> Pixel CLI</h1><h2 id="description" tabindex="-1"><a class="header-anchor" href="#description" aria-hidden="true">#</a> Description</h2><p>The Pixel CLI is the core of pixel builder, it&#39;s what allow to create, develop and build projects.</p><h2 id="to-install-or-update" tabindex="-1"><a class="header-anchor" href="#to-install-or-update" aria-hidden="true">#</a> To install or update</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">yarn</span> global <span class="token function">add</span> @pixel-builder/cli

<span class="token comment"># or npn users</span>
$ <span class="token function">npm</span> i -g @pixel-builder/cli
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># &gt;&gt; pixel help</span>
Usage: Pixel Builder <span class="token punctuation">[</span>options<span class="token punctuation">]</span> <span class="token punctuation">[</span>command<span class="token punctuation">]</span>

CLI to create and build HTML5 Games

Options:
  -h, --help                 display <span class="token builtin class-name">help</span> <span class="token keyword">for</span> <span class="token builtin class-name">command</span>

Commands:
  create <span class="token punctuation">[</span>options<span class="token punctuation">]</span> <span class="token punctuation">[</span>string<span class="token punctuation">]</span>  Create a new pixel project
  pack <span class="token punctuation">[</span>options<span class="token punctuation">]</span> <span class="token punctuation">[</span>string<span class="token punctuation">]</span>    Auto-Generate assets <span class="token keyword">for</span> a Pixel Project <span class="token punctuation">(</span>spritesheet<span class="token punctuation">)</span>
  dev                        Run a Pixel Project
  build                      Build a Project Project
  preview                    Preview a Build of a Pixel Project
  <span class="token builtin class-name">help</span> <span class="token punctuation">[</span>command<span class="token punctuation">]</span>             display <span class="token builtin class-name">help</span> <span class="token keyword">for</span> <span class="token builtin class-name">command</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),t=[l];function c(o,p){return a(),s("div",null,t)}var r=n(i,[["render",c],["__file","cli.html.vue"]]);export{r as default};
