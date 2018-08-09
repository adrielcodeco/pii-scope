/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const _global: any = global

export default {
  makeContext: (global: any) => {
    const newGlobal = Object.assign(Object.create(null), global, {
      _cache: Object.create(null),
      Array,
      ArrayBuffer,
      Atomics,
      BigInt: _global.BigInt,
      BigInt64Array: _global.BigInt64Array,
      BigUint64Array: _global.BigUint64Array,
      Boolean,
      Buffer,
      clearImmediate,
      clearInterval,
      clearTimeout,
      console,
      DataView,
      Date,
      decodeURI,
      decodeURIComponent,
      encodeURI,
      encodeURIComponent,
      Error,
      escape,
      eval: _global.eval,
      EvalError,
      Float32Array,
      Float64Array,
      Function,
      Infinity,
      Int16Array,
      Int32Array,
      Int8Array,
      Intl,
      isFinite,
      isNaN,
      JSON,
      Map,
      Math,
      NaN,
      Number,
      Object,
      parseFloat,
      parseInt,
      process,
      Promise,
      Proxy,
      RangeError,
      ReferenceError,
      Reflect,
      RegExp,
      Set,
      setImmediate,
      setInterval,
      setTimeout,
      SharedArrayBuffer,
      String,
      Symbol,
      [Symbol.toStringTag]: _global[Symbol.toStringTag],
      SyntaxError,
      TypeError,
      Uint16Array,
      Uint32Array,
      Uint8Array,
      Uint8ClampedArray,
      undefined,
      unescape,
      URIError,
      URL: _global.URL,
      URLSearchParams: _global.URLSearchParams,
      WeakMap,
      WeakSet,
      WebAssembly: _global.WebAssembly
    })
    Reflect.set(newGlobal, 'global', newGlobal)
    Reflect.set(newGlobal, 'GLOBAL', newGlobal)
    return newGlobal
  }
}
