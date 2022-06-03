## Pixel Builder - Pixi

Welcome to your Pixel Builder Project

---

## Commands
* `yarn dev` : Run the dev server, with auto reload
* `yarn build` : Compile the project into `./build` folder
* `yarn preview` : Expose the compiled code on a local server

---

## Features

<% if(useGit){ %>
### Git Integration
The repository was configured, you can initialize it and push it where you want (Github, Gitlab, ...)
```sh
git init
git add .
git commit -m "first commit"
```
<% } %>

<% if(useVSCode){ %>
### VSCode Integration
We added few settings and scripts, to help you debugging your project.

To debug, open the `Run & Debug` tab
- Run the task `Run Dev Server`
- Then Run `Launch Chrome`

That's it, you are ready to develop, VSCode & Chrome are working together to provide you live debugging, breakpoints, console, variable inspection, ...
<% } %>

<% if(useLint){ %>
### Lint (Enforce Code Style)

We configured this project with editorconfig and prettier

- `yarn format` : Format the code
- `yarn lint` : Check if the code is linted
<% } %>

<% if(useTest){ %>
### Test (Unit Testing)

We configured this project with [Vitest](https://vitest.dev/), and you can find an example [here](./src/game/index.test.ts)

To use, run the following:
- `yarn test`
- `yarn coverage` : Generate a code coverage report in the `./coverage/` folder
<% } %>

---

## Pixel Builder Support
If you have bugs, questions, please check [our repository](https://github.com/kefniark/pixel-builder)

MIT License
