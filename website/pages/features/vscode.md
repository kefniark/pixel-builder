# VSCode

## To Use

Select the `vscode` option during project creation

```sh
pixel create examples/pixi -t pixi -f lint,test,vscode
```

---

## What does it do?

The goal of this feature is to make the integration with VSCode smoother.

For this, we preconfigure common vscode configurations files in `.vscode` folder

Define tasks you can run in development

- Run dev server : Start a local webserver `yarn dev`
- Launch chrome : Open chrome attached to this local web server

This is helpful to quickly get live debugging and breakpoints in your game

---

## If I want a different behavior?

Feel free to customize those files, they are straight vscode configuration.

This is really a bootstrap configuration to get on speed quickly, but you may probably need more when the project get bigger.
