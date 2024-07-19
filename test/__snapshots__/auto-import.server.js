
export async function foo (...args) {
  const { foo: fn } = await import("somefile.ts")
  return fn(...args)
}

export async function bar (...args) {
  const { bar: fn } = await import("somefile.ts")
  return fn(...args)
}
