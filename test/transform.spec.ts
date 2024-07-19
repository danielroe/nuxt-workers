/* @vitest-environment node */
import { describe, it, expect } from 'vitest'
import { WorkerTransformPlugin, WorkerPlugin, VIRTUAL_ID } from '../src/plugins/unplugin.js'

describe('worker transform', () => {
  it('should not transform code on the server', async () => {
    const code = await transform('server', 'export const bob = () => 42; export const foo = () => "thing"')
    expect(code).toBeUndefined()
  })
  it('should transform code on the client', async () => {
    const code = await transform('client', 'export const bob = () => 42; export const foo = () => "thing"')
    expect(code).toMatchFileSnapshot('__snapshots__/worker.client.js')
  })
})

async function transform(mode: 'server' | 'client', code: string) {
  const context = { workerExports: {}, reverseMap: { 'somefile.ts': ['bob'] } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin = WorkerTransformPlugin({ mode, context }).raw({}, {} as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (plugin as any).transform(code, 'somefile.ts')?.code
}

describe('worker loader', () => {
  it('should load worker on server', async () => {
    const code = await load('server')
    expect(code).toMatchFileSnapshot('__snapshots__/auto-import.server.js')
  })
  it('should load worker on client', async () => {
    const code = await load('client')
    expect(code).toMatchFileSnapshot('__snapshots__/auto-import.client.js')
  })
})

async function load(mode: 'server' | 'client') {
  const context = { workerExports: { bob: 'somefile.ts' }, reverseMap: { 'somefile.ts': ['bob'] } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin = WorkerPlugin({ mode, context }).raw({}, {} as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (plugin as any).load(VIRTUAL_ID + `?source=somefile.ts`)?.code
}
