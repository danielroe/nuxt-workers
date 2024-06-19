import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

await setup({
  server: true,
  browser: true,
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('nuxt-workers', () => {
  it('should work on the server', async () => {
    expect(await $fetch('/')).toContain('Hello from worker!')
  })
})
