const { defaultTheme } = require('vuepress')

module.exports = {
    lang: 'en-US',
    title: 'Pixel Builder',
    description: 'Modern Framework to build HTML5 games',
    base: '/pixel-builder/',
    theme: defaultTheme({
        darkMode: false,
        repo: 'https://github.com/kefniark/pixel-builder',
        sidebar: [
            {
                text: 'Getting Started',
                link: '/getting-started',
            },
            {
                text: 'Templates',
                children: [
                    { text: '2D Pixi.js', link: '/template/pixijs' },
                    { text: '3D BabylonJS', link: '/template/babylonjs' },
                    { text: 'Minimalist (js13k)', link: '/template/minimalist' }
                ],
            },
            {
                text: 'Usage',
                children: [
                    { text: 'Pixel CLI', link: '/usage/cli' },
                    { text: 'Project Structure', link: '/usage/structure' },
                    { text: 'Build', link: '/usage/building' },
                    { text: 'Define Constant', link: '/usage/define' },
                    { text: 'Assets Handling', link: '/usage/assets' },
                    // { text: 'Styling', link: '/usage/styling' }
                ],
            },
            // {
            //     text: 'Tooling',
            //     children: [
            //         { text: 'VSCode', link: '/template/pixijs' },
            //         { text: 'Linting', link: '/template/pixijs' },
            //         { text: 'Testing', link: '/template/pixijs' }
            //     ],
            // },
            {
                text: 'Features',
                children: [
                    // { text: 'Audio', link: '/features/audio' },
                    { text: 'Github Action', link: '/features/github' },
                    { text: 'VSCode', link: '/features/vscode' },
                ]
            }
        ]
    })
}