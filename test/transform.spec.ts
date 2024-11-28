/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { WorkerTransformPlugin, WorkerPlugin, VIRTUAL_ID } from '../src/plugins/unplugin.js'

describe('worker transform', () => {
  const workerSource = 'export const foo = () => 42; export const bar = async () => "thing"; export const baz = function () { }'
  it('should not transform code on the server', async () => {
    const code = await transform('server', workerSource)
    expect(code).toBeUndefined()
  })
  it('should transform code on the client', async () => {
    const code = await transform('client', workerSource)
    await expect(code).toMatchFileSnapshot('__snapshots__/worker.client.js')
  })
})

describe('worker loader', () => {
  it('should load worker on server', async () => {
    const code = await load('server')
    await expect(code).toMatchFileSnapshot('__snapshots__/auto-import.server.js')
  })
  it('should load worker on client', async () => {
    const code = await load('client')
    await expect(code).toMatchFileSnapshot('__snapshots__/auto-import.client.js')
  })
})

// Helper utils

const context = { workerExports: { foo: 'somefile.ts', bar: 'somefile.ts' }, reverseMap: { 'somefile.ts': ['foo', 'bar'] } }

async function transform(mode: 'server' | 'client', code: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin = WorkerTransformPlugin({ mode, context }).raw({}, {} as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (plugin as any).transform(code, 'somefile.ts')?.code
}

async function load(mode: 'server' | 'client') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin = WorkerPlugin({ mode, context }).raw({}, {} as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (plugin as any).load(VIRTUAL_ID + `?source=somefile.ts`)?.code
}
