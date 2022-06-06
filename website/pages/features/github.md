# Github Action

## To Use

Select the `github` option during project creation

```sh
pixel create examples/pixi -t pixi -f lint,test,github
```

---

## What does it do?

The goal of this feature is to make the integration with Github smoother.

For this, we preconfigure two common Github action workflow:

### Code Quality

- File: `.github/workflows/main.yml`

On merge & pull request, Automatically run `yarn lint` and `yarn test`

### Github Pages

- File: `.github/workflows/deploy.yml`

On merge, automatically build & deploy your project on github pages.
This way you can share it with the rest of the world without dealing with any hosting services, it's free.

---

## If I want a different behavior?

Feel free to customize those files, they are straight [github actions](https://docs.github.com/en/actions).

This is really a bootstrap configuration to get on speed quickly, but you may probably need more when the project get bigger.
