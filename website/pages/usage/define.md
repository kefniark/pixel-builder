# Define Constant

## Description

For development it can be really convenient to have different behaviors, not present in production.
This can be really useful for things like version, debug tools, inject variable name, turn on or off some UI.

So for that, we provide you a way to inject constant at build time.

## Usage

in `package.json`

```json
  "pixel": {
    "define": {
      "develop": { // this is for yarn dev
        "APP_VERSION": "dev",
        "APP_DEBUG": true
      },
      "production": { // this is for yarn build or yarn preview
        "APP_VERSION": "prod",
        "APP_DEBUG": true
      }
    }
  }
```

For typescript, create a file like `src/env.d.ts` and type those variables

```ts
// define env variable types
declare const APP_VERSION: boolean
declare const APP_DEBUG: boolean
```

Then you are ready to go, now those constant are available everywhere in your app.

## Example

### Conditional Import

To keep the code clean, the debug logic can be managed in separated file then only loaded if needed

```js
if (APP_DEBUG) {
  await import("../game/debug")
}
```

This also allow to have conditional libraries import, only in development and strip from the build

### String Constants (and quotes)

**Warning**: those constants are not true variables, they are replaced at build time with a string replacement.

For boolean and numbers this is not a problem, but for string you have to be careful with the lack of quotes.

```js
// this work work
const debug = APP_DEBUG // -> `const debug = true`

// those will not work
console.log(`Current App is ${APP_VERSION}`) // -> `Current App is ${dev}`
const name = APP_VERSION // -> `const name = dev`

// but those will
console.log("Current App is APP_VERSION") // -> "Current App is dev"
const name = "APP_VERSION" // -> `const name = "dev"`
```

Another way to avoid this problem is to put quotes directly in the define value

```json
  "pixel": {
    "define": {
        // ...
        "APP_VERSION": "\"dev\""
        // ...
    }
  }
```

And now you can use it as a normal string

```ts
console.log(`This is my version : ${APP_VERSION}`)
```
