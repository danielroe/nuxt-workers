
const counts = {}
const map = {}

function initWorker (worker, name) {
  map[name] = {}
  counts[name] = 0
  worker.onmessage = (e) => {
    const [resolve, reject] = map[name][e.data.id]
    if ('error' in e.data) {
      reject(new Error(e.data.error))
    } else {
      resolve(e.data.result)
    }
  }
  return worker
}
var _nuxt_worker_bob;
async function bob (...args) {

  _nuxt_worker_bob ||= initWorker(new Worker(new URL("somefile.ts", import.meta.url)), "bob")

  const id = counts["bob"]++
  return new Promise((resolve, reject) => {
    map["bob"][id] = [resolve, reject]
    _nuxt_worker_bob.postMessage({ name: "bob", args, id })
  })
}

export { bob }
