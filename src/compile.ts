/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'
import { stripBOM, stripShebang } from './helpers'
import { makeRequireFunction } from './require'
import Context from './context'
const NativeModule = require('module')

const _cache = Object.create(null)

export function compile (
  filename: string,
  mod: any,
  noCacheFor: string[],
  globals: {}
): any {
  if (!filename) {
    throw new Error('the filename argument is invalid')
  }
  const Module = mod ? mod.constructor : NativeModule as Function
  const sandbox = new Context()
  sandbox.console = console
  sandbox.process = process
  sandbox.global = globals
  const context = globals ? vm.createContext(sandbox) : (mod || {}).context
  let func
  if (filename in _cache) {
    const script = _cache[filename]
    func = context ? script.runInContext(context) : script.runInThisContext()
  } else {
    let content = fs.readFileSync(filename, 'utf8')
    content = stripBOM(content)
    content = stripShebang(content)
    const wrapper = NativeModule.wrap(content)
    const script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true
    })
    _cache[filename] = script
    func = context ? script.runInContext(context) : script.runInThisContext()
  }
  const _module = new Module(filename, mod)
  _module.filename = filename
  _module.paths = NativeModule._nodeModulePaths(path.dirname(filename))
  _module.noCacheFor = noCacheFor || []
  _module.context = context
  _module.loaded = true
  const customRequire = makeRequireFunction(_module)
  const dirname = path.dirname(filename)
  func.call(context, _module.exports, customRequire, _module, filename, dirname)
  return _module.exports
}

Reflect.set(compile, '_cache', _cache)
