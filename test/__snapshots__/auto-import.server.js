
var _nuxt_worker_bob;
async function bob (...args) {

  const { bob: fn } = await import("somefile.ts")

  return fn(...args)

}

export { bob }
