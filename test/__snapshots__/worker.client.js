const bob = () => 42; const foo = () => "thing"
const __worker_exports__ = { bob: bob }
self.onmessage = async (e) => {
  const { name, args, id } = e.data
  const fn = __worker_exports__[name]
  if (!fn) { throw new Error('Worker function not found: ' + name) }
  try {
    const result = await fn(...args)
    self.postMessage({ result, id })
  } catch (e) {
    self.postMessage({ error: e.message, id })
  }
}