"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

class Context {
  constructor() {
    this.global = Object.create(null);
    this._cache = Object.create(null);
  }
}
exports.default = Context;