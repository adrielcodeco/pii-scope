'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRequireFunction = makeRequireFunction;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _util = require('util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

const assert = require('assert');
const Module = require('module');

const debug = util.debuglog('module');
const NativeRequire = require;
const _recursive = Object.create(null);
const _extensions = Object.create(null);

// Native extension for .js
_extensions['.js'] = function (module, filename) {
  Reflect.set(module, 'exports', NativeRequire('./compile').compile(filename, module, module.noCacheFor, undefined));
};

// Native extension for .json
_extensions['.json'] = Module._extensions['.json'];

// Native extension for .node
_extensions['.node'] = Module._extensions['.node'];

function updateChildren(parent, child, scan) {
  const children = parent && parent.children;
  if (children && !(scan && children.includes(child))) children.push(child);
}

function tryModuleLoad(module, filename) {
  try {
    debug('load %j for module %j', filename, module.id);
    assert(!module.loaded);
    module.filename = filename;
    module.paths = Module._nodeModulePaths(path.dirname(filename));

    let extension = path.extname(filename) || '.js';
    if (!_extensions[extension]) extension = '.js';
    _extensions[extension](module, filename);
    module.loaded = true;
  } finally {
    // does nothing
  }
}

function makeRequireFunction(mod) {
  if (!mod) {
    throw new Error('the mod argument is invalid');
  }
  const ParentModule = mod.constructor;
  const _cache = (mod.context || {})._cache || Module._cache;
  const noCacheFor = mod.noCacheFor || [];

  function require(request) {
    try {
      if (!request) {
        throw new Error('the path argument is invalid');
      }
      let msg = `Recursive module load detected!\r\n`;
      msg += `The "${request}" module will be loaded, but this is not a best practice\r\n`;
      msg += `This could be a mistake, check your code and correct`;
      const filename = Module._resolveFilename(request, mod, false);
      if (request in _recursive && _recursive[request] === filename) {
        console.warn(msg);
        return {};
      }
      if (!path.isAbsolute(request) && !noCacheFor.includes(filename)) {
        const cachedModule = _cache[filename];
        if (cachedModule) {
          if (cachedModule.loaded) {
            updateChildren(mod, cachedModule, true);
            return cachedModule.exports;
          } else {
            console.warn(msg);
            _recursive[request] = filename;
          }
        }
      }
      // if (filename === request) {
      //   return NativeRequire(request)
      // }
      const module = new ParentModule(filename, mod);
      module.noCacheFor = noCacheFor;
      module.context = mod.context;
      if (!path.isAbsolute(request) && !noCacheFor.includes(filename)) {
        _cache[filename] = module;
      }
      tryModuleLoad(module, filename);
      return Reflect.get(module, 'exports');
    } finally {
      // does nothing
    }
  }

  function resolve(request, options) {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof request !== 'string') {
      // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
      throw new Error('The "request" argument must be of type "string"');
    }
    return Module._resolveFilename(request, mod, false, options);
  }

  function paths(request) {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof request !== 'string') {
      // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
      throw new Error('The "request" argument must be of type "string"');
    }
    return Module._resolveLookupPaths(request, mod, true);
  }

  require['resolve'] = resolve;
  require['paths'] = paths;
  require['main'] = process.mainModule;
  require['extensions'] = _extensions;
  require['cache'] = _cache;
  return require;
}