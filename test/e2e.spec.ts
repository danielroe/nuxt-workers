import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage, url } from '@nuxt/test-utils/e2e'

await setup({
  server: true,
  browser: true,
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('nuxt-workers', () => {
  it('should work on the server', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Hello from worker!')
    expect(html).toContain('Hello from layer worker!')
  })

  it('should work on the client', async () => {
    const page = await createPage()
    const logs: string[] = []
    page.on('console', (log) => {
      logs.push(log.text())
    })
    await page.goto(url('/'))
    expect(logs).toMatchInlineSnapshot(`[]`)
    await page.getByText('Load client side message').click()
    expect(logs).toMatchInlineSnapshot(`[]`)
    expect(await page.getByText('Client-side message: Hello from worker!').textContent()).toBeDefined()
    await page.close()
  })
})
