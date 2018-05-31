"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const util = require("util");
const helpers_1 = require("./helpers");
const Module = require('module');
const debug = util.debuglog('module');
const NativeRequire = require;
const _cache = Object.create(null);
const _extensions = Object.create(null);
_extensions['.js'] = function (module, filename) {
    module.exports = NativeRequire('./compile').compile(filename, module, module.noCacheFor);
};
_extensions['.json'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    try {
        module.exports = JSON.parse(helpers_1.stripBOM(content));
    }
    catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
    }
};
_extensions['.node'] = function (module, filename) {
    return process['dlopen'](module, path.toNamespacedPath(filename));
};
function updateChildren(parent, child, scan) {
    var children = parent && parent.children;
    if (children && !(scan && children.includes(child)))
        children.push(child);
}
function tryModuleLoad(module, filename) {
    try {
        debug('load %j for module %j', filename, module.id);
        assert(!module.loaded);
        module.filename = filename;
        module.paths = Module._nodeModulePaths(path.dirname(filename));
        var extension = path.extname(filename) || '.js';
        if (!_extensions[extension])
            extension = '.js';
        _extensions[extension](module, filename);
        module.loaded = true;
    }
    finally {
    }
}
function makeRequireFunction(mod) {
    const ParentModule = mod.constructor;
    function require(path) {
        try {
            const filename = ParentModule._resolveFilename(path, mod, false);
            if (!mod.noCacheFor.includes(filename)) {
                var cachedModule = Module._cache[filename];
                if (cachedModule) {
                    updateChildren(mod, cachedModule, true);
                    return cachedModule.exports;
                }
            }
            if (filename == path) {
                return NativeRequire(path);
            }
            const module = new ParentModule(filename, mod);
            module.noCacheFor = mod.noCacheFor;
            if (!mod.noCacheFor.includes(filename)) {
                Module._cache[filename] = module;
            }
            tryModuleLoad(module, filename);
            return module.exports;
        }
        finally {
        }
    }
    function resolve(request, options) {
        if (typeof request !== 'string') {
            throw new Error('The "request" argument must be of type "string"');
        }
        return ParentModule._resolveFilename(request, mod, false, options);
    }
    const requireAny = require;
    requireAny['resolve'] = resolve;
    function paths(request) {
        if (typeof request !== 'string') {
            throw new Error('The "request" argument must be of type "string"');
        }
        return ParentModule._resolveLookupPaths(request, mod, true);
    }
    requireAny['paths'] = paths;
    requireAny['main'] = process.mainModule;
    requireAny['extensions'] = _extensions;
    requireAny['cache'] = _cache;
    return require;
}
exports.makeRequireFunction = makeRequireFunction;
//# sourceMappingURL=require.js.map