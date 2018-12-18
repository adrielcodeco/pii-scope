'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var path_1 = require('path')
var moduleLoader_1 = require('./moduleLoader')
function Scope (path, options) {
  if (!path) {
    throw new Error('the path argument is invalid')
  }
  var defaultParams = {
    noCacheFor: [],
    parentModule: module,
    globals: Object.create(null)
  }
  var _a = Object.assign({}, defaultParams, options)

  var noCacheFor = _a.noCacheFor

  var parentModule = _a.parentModule

  var globals = _a.globals
  if (!path_1.isAbsolute(path)) {
    throw new Error('the path argument is not an absolute path')
  }
  noCacheFor = noCacheFor
    .map(function (m) {
      if (path_1.isAbsolute(m)) {
        return m
      }
      try {
        return require.resolve(m)
      } finally {
      }
      try {
        return parentModule.require.resolve(m)
      } finally {
      }
      return ''
    })
    .filter(function (i) {
      return i
    })
  if (!noCacheFor.includes(path)) {
    noCacheFor.push(path)
  }
  parentModule.noCacheFor = noCacheFor
  return moduleLoader_1.moduleLoader(path, parentModule, globals)
}
exports.default = Scope

//# sourceMappingURL=scope.js.map
