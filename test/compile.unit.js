/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-env jest */

const path = require('path')
const Module = require('module')
const Context = require('../src/context').default

const createModule = () => {
  const mod = new Module(__filename, module)
  mod.filename = __filename
  mod.paths = Module._nodeModulePaths(path.dirname(__filename))
  mod.noCacheFor = []
  mod.exports = module.exports
  const context = Context.makeContext()
  context.console = console
  context.process = process
  mod.loaded = true
  return mod
}

const requireTest = () => {
  jest.resetModules()
  return module.require('../src/moduleLoader').compile
}

test('require', () => {
  expect.assertions(2)
  const compile = requireTest()
  expect(compile).toBeDefined()
  expect(typeof compile === 'function').toBeTruthy()
})

test('validation of invalid filename', () => {
  expect.assertions(1)
  const compile = requireTest()
  expect(() => {
    compile()
  }).toThrowError(/the filename argument is invalid/)
})

test('compile dummy file without parent module', () => {
  expect.assertions(1)
  const compile = requireTest()
  const filename = require.resolve('./dummy/newGlobalScope')
  expect(() => {
    compile(null, filename)
  }).toThrowError(/the mod argument is invalid/)
})

test('compile dummy file with parent module', () => {
  expect.assertions(3)
  const compile = requireTest()
  const filename = require.resolve('./dummy/newGlobalScope')
  const initModule = module.require('../src/moduleLoader').initModule
  const mod = initModule(filename, createModule())
  mod.context = undefined
  const NewGlobalScope = compile(mod, filename)
  expect(NewGlobalScope).toBeDefined()
  expect(NewGlobalScope.prototype).toBeDefined()
  const keys = Reflect.ownKeys(NewGlobalScope.prototype)
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
})

test('compile dummy file with module cached', () => {
  expect.assertions(3)
  const compile = requireTest()
  const filename = require.resolve('./dummy/newGlobalScope')
  const initModule = module.require('../src/moduleLoader').initModule
  const mod = initModule(filename, createModule())
  compile(mod, filename)
  const NewGlobalScope = compile(mod, filename)
  expect(NewGlobalScope).toBeDefined()
  expect(NewGlobalScope.prototype).toBeDefined()
  const keys = Reflect.ownKeys(NewGlobalScope.prototype)
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
})

test('compile dummy file with module cached without context', () => {
  expect.assertions(3)
  const compile = requireTest()
  const filename = require.resolve('./dummy/newGlobalScope')
  const initModule = module.require('../src/moduleLoader').initModule
  const mod = initModule(filename, createModule())
  mod.context = undefined
  compile(mod, filename)
  const NewGlobalScope = compile(mod, filename)
  expect(NewGlobalScope).toBeDefined()
  expect(NewGlobalScope.prototype).toBeDefined()
  const keys = Reflect.ownKeys(NewGlobalScope.prototype)
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
})

test('compile dummy file with globals', () => {
  expect.assertions(4)
  const compile = requireTest()
  const filename = require.resolve('./dummy/newGlobalScope')
  const initModule = module.require('../src/moduleLoader').initModule
  const mod = initModule(filename, createModule())
  mod.context = undefined
  const NewGlobalScope = compile(mod, filename, {
    pii: '@pii'
  })
  expect(NewGlobalScope).toBeDefined()
  expect(NewGlobalScope.prototype).toBeDefined()
  const keys = Reflect.ownKeys(NewGlobalScope.prototype)
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
  const newGlobalScope = new NewGlobalScope()
  const value = newGlobalScope.getGlobal('pii')
  expect(value).toEqual('@pii')
})
