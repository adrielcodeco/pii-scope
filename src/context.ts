/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export default class Context {
  global: any
  _cache: any

  // Array: any
  // ArrayBuffer: any
  // Atomics: any
  // BigInt: any
  // BigInt64Array: any
  // BigUint64Array: any
  // Boolean: any
  Buffer: any
  clearImmediate: any
  clearInterval: any
  clearTimeout: any
  // console: any
  // DataView: any
  // Date: any
  // decodeURI: any
  // decodeURIComponent: any
  // encodeURI: any
  // encodeURIComponent: any
  // Error: any
  // escape: any
  // eval: any
  // EvalError: any
  // Float32Array: any
  // Float64Array: any
  // Function: any
  // Infinity: any
  // Int16Array: any
  // Int32Array: any
  // Int8Array: any
  // Intl: any
  // isFinite: any
  // isNaN: any
  // JSON: any
  // Map: any
  // Math: any
  // NaN: any
  // Number: any
  // Object: any
  // parseFloat: any
  // parseInt: any
  process: any
  // Promise: any
  // Proxy: any
  // RangeError: any
  // ReferenceError: any
  Reflect: any
  // RegExp: any
  // Set: any
  setImmediate: any
  setInterval: any
  setTimeout: any
  // SharedArrayBuffer: any
  // String: any
  // Symbol: any
  // [Symbol.toStringTag]: any
  // SyntaxError: any
  // TypeError: any
  // Uint16Array: any
  // Uint32Array: any
  // Uint8Array: any
  // Uint8ClampedArray: any
  // undefined: any
  // unescape: any
  // URIError: any
  // URL: any
  // URLSearchParams: any
  // WeakMap: any
  // WeakSet: any
  // WebAssembly: any

  constructor (global: any) {
    this.global = global || Object.create(null)
    this._cache = Object.create(null)

    // this.Array = global.Array
    // this.ArrayBuffer = global.ArrayBuffer
    // this.Atomics = global.Atomics
    // this.BigInt = global.BigInt
    // this.BigInt64Array = global.BigInt64Array
    // this.BigUint64Array = global.BigUint64Array
    // this.Boolean = global.Boolean
    this.Buffer = Buffer
    this.clearImmediate = clearImmediate
    this.clearInterval = clearInterval
    this.clearTimeout = clearTimeout
    // this.console = global.console
    // this.DataView = global.DataView
    // this.Date = global.Date
    // this.decodeURI = global.decodeURI
    // this.decodeURIComponent = global.decodeURIComponent
    // this.encodeURI = global.encodeURI
    // this.encodeURIComponent = global.encodeURIComponent
    // this.Error = global.Error
    // this.escape = global.escape
    // this.eval = global.eval
    // this.EvalError = global.EvalError
    // this.Float32Array = global.Float32Array
    // this.Float64Array = global.Float64Array
    // this.Function = global.Function
    // this.Infinity = global.Infinity
    // this.Int16Array = global.Int16Array
    // this.Int32Array = global.Int32Array
    // this.Int8Array = global.Int8Array
    // this.Intl = global.Intl
    // this.isFinite = global.isFinite
    // this.isNaN = global.isNaN
    // this.JSON = global.JSON
    // this.Map = global.Map
    // this.Math = global.Math
    // this.NaN = global.NaN
    // this.Number = global.Number
    // this.Object = global.Object
    // this.parseFloat = global.parseFloat
    // this.parseInt = global.parseInt
    this.process = process
    // this.Promise = global.Promise
    // this.Proxy = global.Proxy
    // this.RangeError = global.RangeError
    // this.ReferenceError = global.ReferenceError
    this.Reflect = Reflect
    // this.RegExp = global.RegExp
    // this.Set = global.Set
    this.setImmediate = setImmediate
    this.setInterval = setInterval
    this.setTimeout = setTimeout
    // this.SharedArrayBuffer = global.SharedArrayBuffer
    // this.String = global.String
    // this.Symbol = global.Symbol
    // this[Symbol.toStringTag] = global[Symbol.toStringTag]
    // this.SyntaxError = global.SyntaxError
    // this.TypeError = global.TypeError
    // this.Uint16Array = global.Uint16Array
    // this.Uint32Array = global.Uint32Array
    // this.Uint8Array = global.Uint8Array
    // this.Uint8ClampedArray = global.Uint8ClampedArray
    // this.undefined = global.undefined
    // this.unescape = global.unescape
    // this.URIError = global.URIError
    // this.URL = global.URL
    // this.URLSearchParams = global.URLSearchParams
    // this.WeakMap = global.WeakMap
    // this.WeakSet = global.WeakSet
    // this.WebAssembly = global.WebAssembly
  }
}
