import { findExports } from 'mlly'
import { parseQuery } from 'ufo'
import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'

export const VIRTUAL_ID = 'virtual:nuxt-workers.mjs'

interface WorkerPluginOptions {
  mode: 'server' | 'client'
  context: {
    workerExports: Record<string, string>
    reverseMap: Record<string, string[]>
  }
  sourcemap?: boolean
}

export const WorkerTransformPlugin = (opts: WorkerPluginOptions) => createUnplugin(() => {
  return {
    name: 'nuxt-workers:transform',
    enforce: 'pre',
    transform(code, _id) {
      if (opts.mode === 'server') {
        return
      }

      const id = _id.replace(/\?.+$/, '')
      if (!(id in opts.context.reverseMap)) {
        return
      }

      const s = new MagicString(code)

      const vals = findExports(code)
      for (const val of vals) {
        s.replace(val.code, val.code.replace(/export /g, ''))
      }

      const exports = opts.context.reverseMap[id]
      s.append([
        '',
        `const __worker_exports__ = { ${exports.map(e => `${e}: ${e}`).join(', ')} }`,
        `self.onmessage = async (e) => {`,
        `  const { name, args, id } = e.data`,
        `  const fn = __worker_exports__[name]`,
        `  if (!fn) { throw new Error('Worker function not found: ' + name) }`,
        `  try {`,
        `    const result = await fn(...args)`,
        `    self.postMessage({ result, id })`,
        `  } catch (e) {`,
        `    self.postMessage({ error: e.message, id })`,
        `  }`,
        `}`,
      ].join('\n'))

      return {
        code: s.toString(),
        map: opts?.sourcemap ? s.generateMap({ hires: true }) : null,
      }
    },
  }
})

export const WorkerPlugin = (opts: WorkerPluginOptions) => createUnplugin(() => {
  return {
    name: 'nuxt-workers:load',
    enforce: 'pre',
    resolveId(id) {
      if (id.startsWith(VIRTUAL_ID)) {
        return id
      }
    },
    loadInclude: id => id.startsWith(VIRTUAL_ID),
    load(id) {
      const query = parseQuery(id.split('?')[1])

      const file = query.source as string

      const exports = opts.context.reverseMap[file]
      if (!exports || !exports.length) {
        return 'export {}'
      }

      let source = ''
      if (opts.mode === 'client') {
        source += `
const map = {}
let count = 0
let _nuxt_worker

function initWorker () {
  const worker = new Worker(new URL(${JSON.stringify(file)}, import.meta.url))
  worker.onmessage = (e) => {
    const [resolve, reject] = map[e.data.id]
    if ('error' in e.data) {
      reject(new Error(e.data.error))
    } else {
      resolve(e.data.result)
    }
  }
  return worker
}
`
      }

      for (const name of exports) {
        source += `\nexport async function ${name} (...args) {`
        if (opts.mode === 'server') {
          source += `\n  const { ${name}: fn } = await import(${JSON.stringify(opts.context.workerExports[name])})`
          source += `\n  return fn(...args)`
        }
        else {
          source += `\n  _nuxt_worker ||= initWorker()\n`
          source += `\n  const id = count++`
          source += `\n  return new Promise((resolve, reject) => {`
          source += `\n    map[id] = [resolve, reject]`,
          source += `\n    _nuxt_worker.postMessage({ name: ${JSON.stringify(name)}, args, id })`
          source += `\n  })`
        }

        source += `\n}\n`
      }

      return {
        code: source,
        map: null,
      }
    },
  }
})
