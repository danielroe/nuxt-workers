import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        overrides: {
          modules: ['nuxt-workers'],
        },
      },
    },
    coverage: {
      reporter: ['text', 'json'],
    },
  },
})
