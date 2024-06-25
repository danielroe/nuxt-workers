import { fileURLToPath } from 'node:url'
import { describe, it, expect, vi } from 'vitest'
import { setup, $fetch, createPage, url } from '@nuxt/test-utils/e2e'

await setup({
  server: true,
  browser: true,
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('nuxt-workers', () => {
  it('should work on the server', async () => {
    expect(await $fetch('/')).toContain('Hello from worker!')
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

  it('should automatically shut down the worker after 1 second of inactivity', async () => {
    const page = await createPage()
    await page.goto(url('/'))
    await page.getByText('Load client side message').click()
    await new Promise(resolve => setTimeout(resolve, 1500)) // wait for more than 1 second to ensure worker shutdown
    const logs = await page.evaluate(() => console.log.mock.calls)
    expect(logs).toContainEqual(expect.stringContaining('Worker terminated due to inactivity.'))
    await page.close()
  })
})

vi.spyOn(console, 'log').mockImplementation(() => {})
