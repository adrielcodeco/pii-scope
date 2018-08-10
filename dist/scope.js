'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const path_1 = require('path')
const moduleLoader_1 = require('./moduleLoader')
function Scope (path, options) {
  if (!path) {
    throw new Error('the path argument is invalid')
  }
  const defaultParams = {
    noCacheFor: [],
    parentModule: module,
    globals: Object.create(null)
  }
  let { noCacheFor, parentModule, globals } = Object.assign(
    {},
    defaultParams,
    options
  )
  if (!path_1.isAbsolute(path)) {
    throw new Error('the path argument is not an absolute path')
  }
  noCacheFor = noCacheFor
    .map(m => {
      if (path_1.isAbsolute(m)) {
        return m
      }
      return ''
    })
    .filter(i => i)
  if (!noCacheFor.includes(path)) {
    noCacheFor.push(path)
  }
  parentModule.noCacheFor = noCacheFor
  return moduleLoader_1.moduleLoader(path, parentModule, globals)
}
exports.default = Scope

//# sourceMappingURL=scope.js.map
