'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scope = require('./scope');

var _scope2 = _interopRequireDefault(_scope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = class {
  static New(path, options) {
    return (0, _scope2.default)(path, options);
  }
}; /**
    * Copyright 2018-present, CODECO. All rights reserved.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    *
    * 
    */