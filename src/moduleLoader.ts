import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'
import { stripBOM, stripShebang } from './helpers'
import Context from './context'
const NativeModule = require('module')

const _cache = Object.create(null)
const _scriptCache = Object.create(null)
const NativeRequire = require
const _extensions = Object.create(null)

export function initModule (filename: string, parentModule: any = {}) {
  const ParentModule = parentModule.constructor || NativeModule
  const _module = new ParentModule(filename, parentModule)
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

export function moduleLoader (request: string, parentModule: any, globals: any) {
  if (!request) {
    throw new Error('the request argument is invalid')
  }
  if (process.env.CHECK_CR === 'true') {
    console.log(`\u001b[33mLoading module: ${request}\u001b[39m`)
  }
  const filename = NativeModule._resolveFilename(request, parentModule, false)
  if (process.env.CHECK_CR === 'true') {
    console.log(`  from: ${filename}`)
    console.log(`  parent module: ${parentModule.filename || ''}`)
  }
  let msg = `Recursive module load detected!\r\n`
  msg += `The "${request}" module located in "${filename}" will be loaded`
  msg += `, but this is not a best practice\r\n`
  msg += `This could be a mistake, check your code and correct.\r\n`
  msg += `Parent module "${parentModule.filename}".\r\n`
  if (
    parentModule._recursive &&
    filename in parentModule._recursive &&
    parentModule._recursive[filename] === request
  ) {
    console.warn(`\u001b[31m${msg}\u001b[39m`)
    return {}
  }
  if (
    !parentModule.noCacheFor ||
    !parentModule.noCacheFor.includes(request) &&
    !parentModule.noCacheFor.includes(filename)
  ) {
    const cachedModule = _cache[filename]
    if (cachedModule) {
      if (cachedModule.loaded) {
        updateChildren(parentModule, cachedModule, true)
        return cachedModule.exports
      } else {
        console.warn(`\u001b[31m${msg}\u001b[39m`)
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
  const _module = initModule(filename, parentModule)
  let extension = path.extname(filename) || '.js'
  if (!_extensions[extension]) {
    extension = '.js'
  }
  try {
    _extensions[extension](_module, filename, globals)
  } finally {
    // does nothing
  }
  _module.loaded = true
  delete _module._recursive[filename]
  return _module.exports
}

export function compatibilityTsNode (filename: string, code: string): string {
  if (path.extname(filename) === '.ts') {
    try {
      const { register } = require('ts-node')
      code = register().compile(code, filename)
    } catch (err) {
      console.debug(err)
    }
  }
  return code
}

export function codePreProcessor (filename: string, code: string): string {
  code = compatibilityTsNode(filename, code)
  return code
}

export function compile (mod: any, filename: string, globals: any): any {
  if (!filename) {
    throw new Error('the filename argument is invalid')
  }
  if (!mod) {
    throw new Error('the mod argument is invalid')
  }
  const sandbox = Context.makeContext(globals)
  const context = globals ? vm.createContext(sandbox) : mod.context
  let func
  if (filename in _scriptCache) {
    const script = _scriptCache[filename]
    func = context ? script.runInContext(context) : script.runInThisContext()
  } else {
    let content = fs.readFileSync(filename, 'utf8')
    content = stripBOM(content)
    content = stripShebang(content)
    content = codePreProcessor(filename, content)
    let wrapper = NativeModule.wrap(content)
    const script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    })
    _scriptCache[filename] = script
    func = context ? script.runInContext(context) : script.runInThisContext()
  }
  mod.context = context
  const customRequire = makeRequireFunction(mod)
  const dirname = path.dirname(filename)
  func.call(context, mod.exports, customRequire, mod, filename, dirname)
  return mod.exports
}

Reflect.set(compile, '_cache', _scriptCache)

_extensions['.js'] = compile
_extensions['.ts'] = compile

// Native extension for .json
_extensions['.json'] = NativeModule._extensions['.json']
// Native extension for .node
_extensions['.node'] = NativeModule._extensions['.node']

function updateChildren (parent: any, child: any, scan: any) {
  const children = parent && parent.children
  if (children && !(scan && children.includes(child))) children.push(child)
}

export function makeRequireFunction (mod: any) {
  if (!mod) {
    throw new Error('the mod argument is invalid')
  }
  const _cache = (mod.context || {})._cache || NativeModule._cache

  function require (request: string) {
    return moduleLoader(request, mod, undefined)
  }

  function resolve (request: string, options: any) {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof request !== 'string') {
      // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
      throw new Error('The "request" argument must be of type "string"')
    }
    return NativeModule._resolveFilename(request, mod, false, options)
  }

  function paths (request: string) {
    // tslint:disable-next-line: strict-type-predicates
    if (typeof request !== 'string') {
      // throw new ERR_INVALID_ARG_TYPE("request", "string", request);
      throw new Error('The "request" argument must be of type "string"')
    }
    return NativeModule._resolveLookupPaths(request, mod, true)
  }

  const requireAny = require as any
  requireAny['resolve'] = resolve
  requireAny['paths'] = paths
  requireAny['main'] = process.mainModule
  requireAny['extensions'] = _extensions
  requireAny['cache'] = _cache
  return require
}
