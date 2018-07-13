'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const helpers_1 = require('./helpers')
const require_1 = require('./require')
const context_1 = require('./context')
const NativeModule = require('module')
const _cache = Object.create(null)
function compile (filename, mod, noCacheFor, globals) {
  if (!filename) {
    throw new Error('the filename argument is invalid')
  }
  const Module = mod ? mod.constructor : NativeModule
  const sandbox = new context_1.default()
  sandbox.console = console
  sandbox.process = process
  sandbox.global = globals
  const context = globals ? vm.createContext(sandbox) : (mod || {}).context
  let func
  if (filename in _cache) {
    const script = _cache[filename]
    func = context ? script.runInContext(context) : script.runInThisContext()
  } else {
    let content = fs.readFileSync(filename, 'utf8')
    content = helpers_1.stripBOM(content)
    content = helpers_1.stripShebang(content)
    const wrapper = NativeModule.wrap(content)
    const script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    })
    _cache[filename] = script
    func = context ? script.runInContext(context) : script.runInThisContext()
  }
  const _module = new Module(filename, mod)
  _module.filename = filename
  _module.paths = NativeModule._nodeModulePaths(path.dirname(filename))
  _module.noCacheFor = noCacheFor || []
  _module.context = context
  _module.loaded = true
  const customRequire = require_1.makeRequireFunction(_module)
  const dirname = path.dirname(filename)
  func.call(context, _module.exports, customRequire, _module, filename, dirname)
  return _module.exports
}
exports.compile = compile
Reflect.set(compile, '_cache', _cache)

//# sourceMappingURL=compile.js.map
