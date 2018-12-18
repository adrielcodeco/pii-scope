'use strict'
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) {
      for (var k in mod) { if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k] }
    }
    result['default'] = mod
    return result
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var fs = __importStar(require('fs'))
var path = __importStar(require('path'))
var vm = __importStar(require('vm'))
var helpers_1 = require('./helpers')
var context_1 = __importDefault(require('./context'))
var NativeModule = require('module')
var _cache = Object.create(null)
var _scriptCache = Object.create(null)
var NativeRequire = require
var _extensions = Object.create(null)
function initModule (filename, parentModule) {
  if (parentModule === void 0) {
    parentModule = {}
  }
  var ParentModule = parentModule.constructor || NativeModule
  var _module = new ParentModule(filename, parentModule)
  _module.noCacheFor = parentModule.noCacheFor || []
  _module.filename = filename
  _module.paths = NativeModule._nodeModulePaths(path.dirname(filename))
  _module._recursive = parentModule._recursive || Object.create(null)
  _module.context = parentModule.context
  if (parentModule.noCacheFor && !parentModule.noCacheFor.includes(filename)) {
    _cache[filename] = _module
  }
  return _module
}
exports.initModule = initModule
function moduleLoader (request, parentModule, globals) {
  if (!request) {
    throw new Error('the request argument is invalid')
  }
  if (process.env.CHECK_CR === 'true') {
    console.log('\u001B[33mLoading module: ' + request + '\u001B[39m')
  }
  var filename = NativeModule._resolveFilename(request, parentModule, false)
  if (process.env.CHECK_CR === 'true') {
    console.log('  from: ' + filename)
    console.log('  parent module: ' + (parentModule.filename || ''))
  }
  var msg = 'Recursive module load detected!\r\n'
  msg +=
    'The "' + request + '" module located in "' + filename + '" will be loaded'
  msg += ', but this is not a best practice\r\n'
  msg += 'This could be a mistake, check your code and correct.\r\n'
  msg += 'Parent module "' + parentModule.filename + '".\r\n'
  if (
    parentModule._recursive &&
    filename in parentModule._recursive &&
    parentModule._recursive[filename] === request
  ) {
    console.warn('\u001B[31m' + msg + '\u001B[39m')
    return {}
  }
  if (
    !parentModule.noCacheFor ||
    (!parentModule.noCacheFor.includes(request) &&
      !parentModule.noCacheFor.includes(filename))
  ) {
    var cachedModule = _cache[filename]
    if (cachedModule) {
      if (cachedModule.loaded) {
        updateChildren(parentModule, cachedModule, true)
        return cachedModule.exports
      } else {
        console.warn('\u001B[31m' + msg + '\u001B[39m')
        if (!parentModule._recursive) {
          parentModule._recursive = Object.create(null)
        }
        parentModule._recursive[filename] = request
      }
    }
  }
  if (!path.isAbsolute(request) && filename === request) {
    return NativeRequire(request)
  }
  var _module = initModule(filename, parentModule)
  var extension = path.extname(filename) || '.js'
  if (!_extensions[extension]) {
    extension = '.js'
  }
  try {
    _extensions[extension](_module, filename, globals)
  } finally {
  }
  _module.loaded = true
  delete _module._recursive[filename]
  return _module.exports
}
exports.moduleLoader = moduleLoader
function compatibilityTsNode (filename, code) {
  if (path.extname(filename) === '.ts') {
    try {
      var register = require('ts-node').register
      code = register().compile(code, filename)
    } catch (err) {
      console.debug(err)
    }
  }
  return code
}
exports.compatibilityTsNode = compatibilityTsNode
function codePreProcessor (filename, code) {
  code = compatibilityTsNode(filename, code)
  return code
}
exports.codePreProcessor = codePreProcessor
function compile (mod, filename, globals) {
  if (!filename) {
    throw new Error('the filename argument is invalid')
  }
  if (!mod) {
    throw new Error('the mod argument is invalid')
  }
  var sandbox = context_1.default.makeContext(globals)
  var context = globals ? vm.createContext(sandbox) : mod.context
  var func
  if (filename in _scriptCache) {
    var script = _scriptCache[filename]
    func = context ? script.runInContext(context) : script.runInThisContext()
  } else {
    var content = fs.readFileSync(filename, 'utf8')
    content = helpers_1.stripBOM(content)
    content = helpers_1.stripShebang(content)
    content = codePreProcessor(filename, content)
    var wrapper = NativeModule.wrap(content)
    var script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    })
    _scriptCache[filename] = script
    func = context ? script.runInContext(context) : script.runInThisContext()
  }
  mod.context = context
  var customRequire = makeRequireFunction(mod)
  var dirname = path.dirname(filename)
  func.call(context, mod.exports, customRequire, mod, filename, dirname)
  return mod.exports
}
exports.compile = compile
Reflect.set(compile, '_cache', _scriptCache)
_extensions['.js'] = compile
_extensions['.ts'] = compile
_extensions['.json'] = NativeModule._extensions['.json']
_extensions['.node'] = NativeModule._extensions['.node']
function updateChildren (parent, child, scan) {
  var children = parent && parent.children
  if (children && !(scan && children.includes(child))) children.push(child)
}
function makeRequireFunction (mod) {
  if (!mod) {
    throw new Error('the mod argument is invalid')
  }
  var _cache = (mod.context || {})._cache || NativeModule._cache
  function require (request) {
    return moduleLoader(request, mod, undefined)
  }
  function resolve (request, options) {
    if (typeof request !== 'string') {
      throw new Error('The "request" argument must be of type "string"')
    }
    return NativeModule._resolveFilename(request, mod, false, options)
  }
  function paths (request) {
    if (typeof request !== 'string') {
      throw new Error('The "request" argument must be of type "string"')
    }
    return NativeModule._resolveLookupPaths(request, mod, true)
  }
  var requireAny = require
  requireAny['resolve'] = resolve
  requireAny['paths'] = paths
  requireAny['main'] = process.mainModule
  requireAny['extensions'] = _extensions
  requireAny['cache'] = _cache
  return require
}
exports.makeRequireFunction = makeRequireFunction

//# sourceMappingURL=moduleLoader.js.map
