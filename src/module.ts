import { readFileSync } from 'node:fs'
import { defineNuxtModule, resolveFiles, updateTemplates, resolveAlias, addBuildPlugin } from '@nuxt/kit'
import { findExportNames } from 'mlly'
import { join, relative, resolve } from 'pathe'
import { withQuery } from 'ufo'
import type { InputPluginOption } from 'rollup'

import { VIRTUAL_ID, WorkerPlugin, WorkerTransformPlugin } from './plugins/unplugin'

export interface ModuleOptions {
  /**
   * Path to directories to be scanned for workers.
   * By default it is resolved relative to your `srcDir`
   */
  dir: string | string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    configKey: 'workers',
    name: 'nuxt-workers',
  },
  defaults: {
    dir: 'workers',
  },
  async setup(options, nuxt) {
    const scanPattern = nuxt.options.extensions.map(e => `*${e}`)

    const _dirs = new Set<string>()
    for (const dir of Array.isArray(options.dir) ? options.dir : [options.dir]) {
      for (const layer of nuxt.options._layers) {
        _dirs.add(resolve(layer.config.srcDir || layer.cwd, resolveAlias(dir, nuxt.options.alias)))
      }
    }

    const dirs = [..._dirs]

    console.log({ dirs })

    const context = {
      workerExports: Object.create(null) as Record<string, string>,
      reverseMap: Object.create(null) as Record<string, string[]>,
    }

    nuxt.hook('imports:extend', (i) => {
      for (const name in context.workerExports) {
        i.push({
          name,
          from: VIRTUAL_ID + withQuery('', { source: context.workerExports[name] }),
        })
      }
    })

    addBuildPlugin(WorkerPlugin({ mode: 'client', sourcemap: !!nuxt.options.sourcemap.client, context }), { server: false })
    addBuildPlugin(WorkerPlugin({ mode: 'server', sourcemap: !!nuxt.options.sourcemap.server, context }), { client: false })
    const transformPlugin = WorkerTransformPlugin({ mode: 'client', sourcemap: !!nuxt.options.sourcemap.client, context })
    if (nuxt.options.dev) {
      addBuildPlugin(transformPlugin, { server: false })
    }
    else {
      nuxt.hook('vite:extendConfig', (config, { isClient }) => {
        if (isClient) {
          const plugins = (config.build!.rollupOptions!.plugins ||= []) as InputPluginOption[]
          plugins.push(transformPlugin.rollup())
        }
      })
    }

    const typesDir = join(nuxt.options.buildDir, 'types')
    nuxt.options.build.templates.unshift({
      filename: join(typesDir, 'nuxt-workers.d.ts'),
      write: true,
      async getContents() {
        const files = await Promise.all(dirs.map(dir => resolveFiles(dir, scanPattern)))

        let script = 'type ToAsyncFunction<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T\n'

        script += 'export {}\n\n'
        script += 'declare global {\n'

        context.workerExports = Object.create(null)
        context.reverseMap = Object.create(null)
        for (const file of files.flat()) {
          const contents = readFileSync(file, 'utf-8')
          for (const e of findExportNames(contents)) {
            if (e in context.workerExports) {
              console.warn(`[nuxt-workers] Duplicate export \`${e}\` found in \`${file}\` and \`${context.workerExports[e]}\`.`)
            }
            else {
              context.workerExports[e] = file
              context.reverseMap[file] ||= []
              context.reverseMap[file].push(e)
              script += `  const ${e}: ToAsyncFunction<typeof import(${JSON.stringify(relative(typesDir, file))}).${e}>\n`
            }
          }
        }

        script += '}\n'

        return script
      },
    })

    nuxt.hook('prepare:types', (ctx) => {
      ctx.references.push({ path: 'types/nuxt-workers.d.ts' })
    })

    nuxt.hook('builder:watch', (event, relativePath) => {
      const path = resolve(nuxt.options.srcDir, relativePath)
      if (!dirs.some(dir => path.startsWith(dir))) {
        return
      }

      return updateTemplates({
        filter(template) {
          return template.filename.endsWith('nuxt-workers.d.ts') || [
            '/types/imports.d.ts',
            '/imports.d.ts',
            '/imports.mjs',
          ].some(i => template.filename.endsWith(i))
        },
      })
    })
  },
})
