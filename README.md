# Typeify

## Introduction

Typeify is a JS-to-TS (JavaScript to TypeScript) converter that converts your messy and bland JavaScript file into a nice, clean and type safety TypeScript file.

## Documentation

Documentations on how to use Typeify!

### Install

First let's install it from npm:

```bash
npm install -g @starlo/typeify
```

### Create a .js file

First let's create a .js file as an example:

```js
// example.js

var = "ok"

if(!var) {
    console.log("not ok")
} else {
    console.log(var)
}

```

Now based on your opinion this might be messy or not clean so let's use Typeify!

**Note(Seriously):** You need to make the `node_modules` set to global in the system environment variables in order
to make this work.

Type this command:

```bash
typeify example.js
```

or if you want to refer to a directory you can run:

```bash
typeify test/example.js
```

And the result should look like this:

```ts
// example.ts

let myVar: string = "ok";

if (!myVar) {
    console.log("not ok");
} else {
    console.log(myVar);
}
```

## What Typeify does?

1. Converts `.js` files to `.ts` files
2. Adds basic type annotations
3. Fixes some common JavaScript issues (like using var)
4. Keeps your original `.js` file as a backup

## Limitations

Typeify is a learning project and may not handle all JavaScript constructs perfectly. It's best used on simple JavaScript files and as a learning tool for TypeScript conversion.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
