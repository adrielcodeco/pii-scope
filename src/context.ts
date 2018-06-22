/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default class Context {
  global: any
  process: any
  console: any
  _cache: any
  constructor () {
    this.global = Object.create(null)
    this._cache = Object.create(null)
  }
}
