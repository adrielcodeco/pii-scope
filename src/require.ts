import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'
import * as util from 'util'
import { stripBOM } from './helpers'
const Module = require('module')

const debug = util.debuglog('module')
const NativeRequire = require
const _cache = Object.create(null)
const _extensions = Object.create(null)

// Native extension for .js
_extensions['.js'] = function(module: any, filename: string) {
    module.exports = NativeRequire('./compile').compile(filename, module, module.noCacheFor)
}

// Native extension for .json
_extensions['.json'] = function(module: any, filename: string) {
    var content = fs.readFileSync(filename, 'utf8')
    try {
        module.exports = JSON.parse(stripBOM(content))
    } catch (err) {
        err.message = filename + ': ' + err.message
        throw err
    }
}

// Native extension for .node
_extensions['.node'] = function(module: any, filename: string) {
    return (process as any)['dlopen'](module, (path as any).toNamespacedPath(filename))
}

function updateChildren(parent: any, child: any, scan: any) {
    var children = parent && parent.children
    if (children && !(scan && children.includes(child))) children.push(child)
}

function tryModuleLoad(module: any, filename: string) {
    try {
        debug('load %j for module %j', filename, module.id)
        assert(!module.loaded)
        module.filename = filename
        module.paths = Module._nodeModulePaths(path.dirname(filename))

        var extension = path.extname(filename) || '.js'
        if (!_extensions[extension]) extension = '.js'
        _extensions[extension](module, filename)
        module.loaded = true
    } finally {
    }
}

export function makeRequireFunction(mod: any) {
    const ParentModule = mod.constructor

    function require(path: string) {
        try {
            const filename = ParentModule._resolveFilename(path, mod, false)
            if (!mod.noCacheFor.includes(filename)) {
                var cachedModule = Module._cache[filename]
                if (cachedModule) {
                    updateChildren(mod, cachedModule, true)
                    return cachedModule.exports
                }
            }
            if (filename == path) {
                return NativeRequire(path)
            }
            const module = new ParentModule(filename, mod)
            module.noCacheFor = mod.noCacheFor
            if (!mod.noCacheFor.includes(filename)) {
                Module._cache[filename] = module
            }
            tryModuleLoad(module, filename)
            return module.exports
        } finally {
        }
    }

    function resolve(request: string, options: any) {
        if (typeof request !== 'string') {
            // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
            throw new Error('The "request" argument must be of type "string"')
        }
        return ParentModule._resolveFilename(request, mod, false, options)
    }

    const requireAny = require as any

    requireAny['resolve'] = resolve

    function paths(request: string) {
        if (typeof request !== 'string') {
            // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
            throw new Error('The "request" argument must be of type "string"')
        }
        return ParentModule._resolveLookupPaths(request, mod, true)
    }

    requireAny['paths'] = paths
    requireAny['main'] = process.mainModule
    requireAny['extensions'] = _extensions
    requireAny['cache'] = _cache
    return require
}
