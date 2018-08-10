const path = require('path')
const Module = require('module')
const Context = require('./src/context').default
const requireTest = () => {
  // require scope
  const compile = module.require('./src/moduleLoader').compile
  for (let c in compile._cache) {
    delete compile._cache[c]
  }
  return compile
}
const createModule = () => {
  const mod = new Module(__filename, module)
  mod.filename = __filename
  mod.paths = Module._nodeModulePaths(path.dirname(__filename))
  mod.noCacheFor = []
  mod.exports = module.exports
  const context = Context.makeContext()
  context.console = console
  context.process = process
  mod.loaded = true
  return mod
}
const compile = requireTest()
const filename = require.resolve('./test/dummy/newGlobalScope')
const initModule = module.require('./src/moduleLoader').initModule
const mod = initModule(filename, createModule())
mod.context = undefined
const NewGlobalScope = compile(mod, filename, {
  pii: '@pii'
})
const newGlobalScope = new NewGlobalScope()
const value = newGlobalScope.getGlobal('pii')
console.log(value)
