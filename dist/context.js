'use strict'
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator]
    if (!m) return o
    var i = m.call(o)

    var r

    var ar = []

    var e
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value)
    } catch (error) {
      e = { error: error }
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i)
      } finally {
        if (e) throw e.error
      }
    }
    return ar
  }
var __spread =
  (this && this.__spread) ||
  function () {
    for (var ar = [], i = 0; i < arguments.length; i++) { ar = ar.concat(__read(arguments[i])) }
    return ar
  }
Object.defineProperty(exports, '__esModule', { value: true })
var stackTrace = require('stack-trace')
var _global = global
exports.default = {
  makeContext: function (global) {
    var _a
    var newGlobal = Object.assign(
      Object.create(null),
      global,
      ((_a = {
        _cache: Object.create(null),
        mainGlobal: _global,
        Array: Array,
        ArrayBuffer: ArrayBuffer,
        Atomics: _global.Atomics,
        BigInt: _global.BigInt,
        BigInt64Array: _global.BigInt64Array,
        BigUint64Array: _global.BigUint64Array,
        Boolean: Boolean,
        Buffer: Buffer,
        clearImmediate: clearImmediate,
        clearInterval: clearInterval,
        clearTimeout: clearTimeout,
        console: console,
        DataView: DataView,
        Date: Date,
        decodeURI: decodeURI,
        decodeURIComponent: decodeURIComponent,
        encodeURI: encodeURI,
        encodeURIComponent: encodeURIComponent,
        Error: wrapError(_global.Error),
        escape: escape,
        eval: _global.eval,
        EvalError: EvalError,
        Float32Array: Float32Array,
        Float64Array: Float64Array,
        Function: Function,
        Infinity: Infinity,
        Int16Array: Int16Array,
        Int32Array: Int32Array,
        Int8Array: Int8Array,
        Intl: Intl,
        isFinite: isFinite,
        isNaN: isNaN,
        JSON: JSON,
        Map: Map,
        Math: Math,
        NaN: NaN,
        Number: Number,
        Object: Object,
        parseFloat: parseFloat,
        parseInt: parseInt,
        process: process,
        Promise: Promise,
        Proxy: Proxy,
        RangeError: RangeError,
        ReferenceError: ReferenceError,
        Reflect: Reflect,
        RegExp: RegExp,
        Set: Set,
        setImmediate: setImmediate,
        setInterval: setInterval,
        setTimeout: setTimeout,
        SharedArrayBuffer: _global.SharedArrayBuffer,
        String: String,
        Symbol: Symbol
      }),
      (_a[Symbol.toStringTag] = _global[Symbol.toStringTag]),
      (_a.SyntaxError = SyntaxError),
      (_a.TypeError = TypeError),
      (_a.Uint16Array = Uint16Array),
      (_a.Uint32Array = Uint32Array),
      (_a.Uint8Array = Uint8Array),
      (_a.Uint8ClampedArray = Uint8ClampedArray),
      (_a.undefined = undefined),
      (_a.unescape = unescape),
      (_a.URIError = URIError),
      (_a.URL = _global.URL),
      (_a.URLSearchParams = _global.URLSearchParams),
      (_a.WeakMap = WeakMap),
      (_a.WeakSet = WeakSet),
      (_a.WebAssembly = _global.WebAssembly),
      _a)
    )
    Reflect.set(newGlobal, 'global', newGlobal)
    Reflect.set(newGlobal, 'GLOBAL', newGlobal)
    return newGlobal
  }
}
function wrapError (Error) {
  var captureStackTraceOld = Error.captureStackTrace
  Error.captureStackTrace = function (obj) {
    var args = []
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i]
    }
    var res = captureStackTraceOld.apply(void 0, __spread([obj], args))
    if (typeof obj.stack === 'string') {
      obj.stack = stackTrace.parse({ stack: obj.stack })
    }
    return res
  }
  return Error
}

//# sourceMappingURL=context.js.map
