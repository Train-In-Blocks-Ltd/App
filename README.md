# Train In Blocks App

Repo for the Train In Blocks App.

[![Linter](https://github.com/Train-In-Blocks-Ltd/App/actions/workflows/lint.yml/badge.svg)](https://github.com/Train-In-Blocks-Ltd/App/actions/workflows/lint.yml)

**Production**

[![Netlify Status](https://api.netlify.com/api/v1/badges/15bb0c86-8028-4fac-88a2-87c773801c9a/deploy-status)](https://app.netlify.com/sites/app-train-in-blocks/deploys)

**Staging**

[![Netlify Status](https://api.netlify.com/api/v1/badges/d991d6ef-a182-4486-abb5-4dbee2d8a62c/deploy-status)](https://app.netlify.com/sites/happy-swanson-edf0fd/deploys)

## Getting Started

We use Yarn. Please make sure you have the latest version of NPM and Yarn installed globally. Vue UI can help with development when installed globally.

### Install packages

```bash
# install netlify cli
$ npm i -g netlify-cli

# Set up netlify
$ netlify login
# OR
$ netlify switch

# Link local repo with netlify site
$ netlify link

# install dependencies
$ yarn install

# serve at localhost:8888
$ netlify dev
```

### Start developing

```bash
netlify dev
```

### Test

```bash
netlify build
```

### Build & Deploy

```bash
git add *

git commit -m ""

git push

netlify deploy
```

## Browser support

We support the latest 20 versions of all major browsers.

We do not support IE.

## Coding Style Guide

### CSS

Stylelint is used to lint CSS. Please follow it's guidance when developing.

Stylelint doesn't work with WebPack and Vue so you need to install the [VSCode plugin](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint). No set-up is necessary, install and go.

You can autofix problems by running:

```bash
npx stylelint "**/*.vue" --fix
```

### JavaScript

ESLint is used to lint JavaScript and HTML. Please follow it's guidance when developing.
