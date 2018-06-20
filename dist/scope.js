'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Scope;

var _path = require('path');

var _compile = require('./compile');

/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function Scope(path, options) {
  if (!path) {
    throw new Error('the path argument is invalid');
  }
  const defaultParams = {
    noCacheFor: [],
    parentModule: module
  };

  var _Object$assign = Object.assign({}, defaultParams, options);

  let noCacheFor = _Object$assign.noCacheFor,
      parentModule = _Object$assign.parentModule;

  let filename;
  if (!(0, _path.isAbsolute)(path)) {
    throw new Error('the path argument is not an absolute path');
  } else {
    filename = require.resolve(path);
  }
  noCacheFor = noCacheFor.map(m => {
    if ((0, _path.isAbsolute)(m)) {
      return require.resolve(m);
    }
    return '';
  }).filter(i => i);
  if (!noCacheFor.includes(filename)) {
    noCacheFor.push(filename);
  }
  return (0, _compile.compile)(filename, parentModule, noCacheFor, {});
}