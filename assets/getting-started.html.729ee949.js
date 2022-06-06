import{_ as e,o as n,c as a,a as s}from"./app.47b6d3de.js";const i={},t=s(`<h1 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting Started</h1><h2 id="install-our-cli" tabindex="-1"><a class="header-anchor" href="#install-our-cli" aria-hidden="true">#</a> Install our CLI</h2><p>To get started, run the following to get our CLI tools:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">yarn</span> global <span class="token function">add</span> @pixel-builder/cli

<span class="token comment"># or npn users</span>
$ <span class="token function">npm</span> i -g @pixel-builder/cli
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-a-new-pixel-project" tabindex="-1"><a class="header-anchor" href="#create-a-new-pixel-project" aria-hidden="true">#</a> Create a New Pixel Project</h2><p>From there, you can create a new project</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>pixel create ProjectName
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>You will be asked few questions about what kind of project and options you would like.</p><p>Then when it&#39;s done</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># open your project</span>
<span class="token builtin class-name">cd</span> ProjectName

<span class="token comment"># run in develop</span>
<span class="token function">yarn</span> dev

<span class="token comment"># or build it</span>
<span class="token function">yarn</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>For more informations, check the <strong>./README.md</strong> at the root of your new project</p>`,11),r=[t];function l(d,o){return n(),a("div",null,r)}var u=e(i,[["render",l],["__file","getting-started.html.vue"]]);export{u as default};
