
const map = {}
let count = 0
let _nuxt_worker

function initWorker (worker) {
  const worker = new Worker(new URL("somefile.ts", import.meta.url))
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

export async function foo (...args) {
  _nuxt_worker ||= initWorker()

  const id = count++
  return new Promise((resolve, reject) => {
    map[id] = [resolve, reject]
    _nuxt_worker.postMessage({ name: "foo", args, id })
  })
}

export async function bar (...args) {
  _nuxt_worker ||= initWorker()

  const id = count++
  return new Promise((resolve, reject) => {
    map[id] = [resolve, reject]
    _nuxt_worker.postMessage({ name: "bar", args, id })
  })
}
