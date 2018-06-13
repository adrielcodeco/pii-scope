"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const util = require("util");
const helpers_1 = require("./helpers");
const assert = require('assert');
const Module = require('module');
const debug = util.debuglog('module');
const NativeRequire = require;
const _recursive = Object.create(null);
const _extensions = Object.create(null);
_extensions['.js'] = function (module, filename) {
    module.exports = NativeRequire('./compile').compile(filename, module, module.noCacheFor, undefined);
};
_extensions['.json'] = function (module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
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
    const children = parent && parent.children;
    if (children && !(scan && children.includes(child)))
        children.push(child);
}
function tryModuleLoad(module, filename) {
    try {
        debug('load %j for module %j', filename, module.id);
        assert(!module.loaded);
        module.filename = filename;
        module.paths = Module._nodeModulePaths(path.dirname(filename));
        let extension = path.extname(filename) || '.js';
        if (!_extensions[extension])
            extension = '.js';
        _extensions[extension](module, filename);
        module.loaded = true;
    }
    finally {
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
            if (!path.isAbsolute(request) &&
                !noCacheFor.includes(filename)) {
                const cachedModule = _cache[filename];
                if (cachedModule) {
                    if (cachedModule.loaded) {
                        updateChildren(mod, cachedModule, true);
                        return cachedModule.exports;
                    }
                    else {
                        console.warn(msg);
                        _recursive[request] = filename;
                    }
                }
            }
            const module = new ParentModule(filename, mod);
            module.noCacheFor = noCacheFor;
            module.context = mod.context;
            if (!path.isAbsolute(request) &&
                !noCacheFor.includes(filename)) {
                _cache[filename] = module;
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
        return Module._resolveFilename(request, mod, false, options);
    }
    function paths(request) {
        if (typeof request !== 'string') {
            throw new Error('The "request" argument must be of type "string"');
        }
        return Module._resolveLookupPaths(request, mod, true);
    }
    const requireAny = require;
    requireAny['resolve'] = resolve;
    requireAny['paths'] = paths;
    requireAny['main'] = process.mainModule;
    requireAny['extensions'] = _extensions;
    requireAny['cache'] = _cache;
    return require;
}
exports.makeRequireFunction = makeRequireFunction;
//# sourceMappingURL=require.js.map