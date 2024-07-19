const foo = () => 42; const bar = async () => "thing"; const baz = function () { }
const __worker_exports__ = { foo: foo, bar: bar }
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