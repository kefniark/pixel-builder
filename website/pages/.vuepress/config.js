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
                    { text: 'Folder Structure', link: '/usage/structure' },
                    { text: 'Assets Handling', link: '/usage/assets' },
                    { text: 'Styling', link: '/usage/styling' },
                    { text: 'Building', link: '/usage/building' }
                ],
            },
            {
                text: 'Tooling',
                children: [
                    { text: 'VSCode', link: '/template/pixijs' },
                    { text: 'Linting', link: '/template/pixijs' },
                    { text: 'Testing', link: '/template/pixijs' }
                ],
            },
            {
                text: 'Features',
                children: [
                    { text: 'Audio', link: '/features/audio' }
                ]
            }
        ]
    })
}