# Nuxt Workers

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> SSR-safe, zero-config Web Workers integration for [Nuxt](https://nuxt.com)

- [✨ &nbsp;Changelog](https://github.com/danielroe/nuxt-workers/blob/main/CHANGELOG.md)
- [▶️ &nbsp;Online playground](https://stackblitz.com/github/danielroe/nuxt-workers/tree/main/playground)

## Features

- 🔥 SSR-safe usage of Web Workers
- ✨ auto-imported, zero-configuration
- 💪 fully typed

## Roadmap

- [ ] basic documentation
- [ ] fuller test
- [ ] webpack support

## Installation

Install and add `nuxt-workers` to your `nuxt.config`.

```bash
npx nuxi@latest module add nuxt-workers
```

```js
export default defineNuxtConfig({
  modules: ['nuxt-workers'],
})
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Stub module with `pnpm dev:prepare`
- Run `pnpm dev` to start [playground](./playground) in development mode

## License

Made with ❤️

Published under the [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-workers?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-workers
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-workers?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-workers
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/danielroe/nuxt-workers/ci.yml?branch=main
[github-actions-href]: https://github.com/danielroe/nuxt-workers/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/danielroe/nuxt-workers/main?style=flat-square
[codecov-href]: https://codecov.io/gh/danielroe/nuxt-workers
