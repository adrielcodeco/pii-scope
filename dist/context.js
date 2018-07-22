'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class Context {
  constructor (global) {
    this.global = global || Object.create(null)
    this._cache = Object.create(null)
    this.Buffer = Buffer
    this.clearImmediate = clearImmediate
    this.clearInterval = clearInterval
    this.clearTimeout = clearTimeout
    this.process = process
    this.Reflect = Reflect
    this.setImmediate = setImmediate
    this.setInterval = setInterval
    this.setTimeout = setTimeout
  }
}
exports.default = Context

//# sourceMappingURL=context.js.map
