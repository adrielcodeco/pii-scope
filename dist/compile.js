'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _vm = require('vm');

var vm = _interopRequireWildcard(_vm);

var _module2 = require('module');

var _module3 = _interopRequireDefault(_module2);

var _helpers = require('./helpers');

var _require = require('./require');

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const _cache = Object.create(null); /**
                                     * Copyright 2018-present, CODECO. All rights reserved.
                                     *
                                     * This source code is licensed under the MIT license found in the
                                     * LICENSE file in the root directory of this source tree.
                                     *
                                     * 
                                     */

function compile(filename, mod, noCacheFor, globals) {
  if (!filename) {
    throw new Error('the filename argument is invalid');
  }
  const Module = mod ? mod.constructor : _module3.default;
  const sandbox = new _context2.default();
  sandbox.console = console;
  sandbox.process = process;
  sandbox.global = globals;
  const context = globals ? vm.createContext(sandbox) : (mod || {}).context;
  let func;
  if (filename in _cache) {
    const script = _cache[filename];
    func = context ? script.runInContext(context) : script.runInThisContext();
  } else {
    let content = fs.readFileSync(filename, 'utf8');
    content = (0, _helpers.stripBOM)(content);
    content = (0, _helpers.stripShebang)(content);
    const wrapper = _module3.default.wrap(content);
    const script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    });
    _cache[filename] = script;
    func = context ? script.runInContext(context) : script.runInThisContext();
  }
  const _module = new Module(filename, mod);
  _module.filename = filename;
  _module.paths = _module3.default._nodeModulePaths(path.dirname(filename));
  _module.noCacheFor = noCacheFor || [];
  _module.context = context;
  _module.loaded = true;
  const customRequire = (0, _require.makeRequireFunction)(_module);
  const dirname = path.dirname(filename);
  func.call(context, _module.exports, customRequire, _module, filename, dirname);
  return _module.exports;
}

Reflect.set(compile, '_cache', _cache);