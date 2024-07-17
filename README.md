# Nuxt Workers

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

SSR-safe, zero-config Web Workers integration for [Nuxt](https://nuxt.com).

> Web Workers enable running JavaScript code in the background to perform complex tasks without blocking the main thread, ensuring smoother and more responsive web applications.
>
> [Read more about Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

- [✨ &nbsp;Changelog](https://github.com/danielroe/nuxt-workers/blob/main/CHANGELOG.md)
- [▶️ &nbsp;Online playground](https://stackblitz.com/github/danielroe/nuxt-workers/tree/main/playground)

## Features

- 🔥 SSR-safe usage of Web Workers
- ✨ auto-imported, zero-configuration
- 💪 fully typed
- 🕒 Automatic shutdown of workers after 1 second of inactivity

## Quick Setup

Install and add `nuxt-workers` to your `nuxt.config`.

```bash
npx nuxi@latest module add nuxt-workers
```

That's it! You can add web workers in your Nuxt app ✨

## Usage

Create your web worker in the `~/workers/` directory. It should export any utilities you want to be usable elsewhere:

```ts
// workers/hi.ts
export function hi() {
  return 'Hello from web worker!'
}
```

Then, call it in the rest of your Vue app.

```vue
<script setup lang="ts">
const message = await hi()
</script>

<template>
  <div>
    {{ message }}
  </div>
</template>
```

> [!TIP]
> Even if your function is synchronous, it will always become async when it is called within a worker because communication with a worker will always be asynchronous.

### Worker Auto-Shutdown

The module automatically shuts down workers after 1 second of inactivity to free up resources. This behavior ensures that your application remains efficient and responsive, without unnecessary resource consumption by idle workers.

## Roadmap

- [x] 📖 basic documentation
- [x] 🧪 client-side test
- [ ] 🧱 `useNuxtWorker` composable for more fine-grained control
- [ ] ⚗️ automatic deduplicating on client-side
- [ ] 📦 webpack support
- [ ] ⚠️ type-level + dev warning if non serialisable args are passed
- [ ] 🤝 automatic shared workers with `.shared.ts` suffix
- [x] 💤 worker auto-shutdown

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
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
