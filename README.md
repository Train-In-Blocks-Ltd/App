# Train In Blocks App

Repo for the Train In Blocks App.

[![Netlify Status](https://api.netlify.com/api/v1/badges/15bb0c86-8028-4fac-88a2-87c773801c9a/deploy-status)](https://app.netlify.com/sites/train-in-blocks/deploys)

## Getting Started

We use NPM as we've run into some problems before using Yarn. Please make sure you have the latest version of NPM installed globally. Vue CLI and Vue UI can help with development when installed globally.

### Install packages

```
npm install
```

### Start developing

```
npm run start
```

### Build for production

```
npm run build
```

## Browser support

We support the latest 2 versions of all major browsers.

We do not support IE.

## Coding Style Guide

### CSS

Stylelint is used to lint CSS. Please follow it's guidance when developing.

Stylelint doesn't work with WebPack and Vue so you need to install the [VSCode plugin](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint). No set-up is necessary, install and go.

You can autofix problems by running:

```
npx stylelint "**/*.vue" --fix
```

### JavaScript

ESLint is used to lint JavaScript and HTML. Please follow it's guidance when developing.
