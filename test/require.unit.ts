/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-env jest */

export {}

const vm = require('vm')
const Context = require('../src/context').default
const path = require('path')
const Module = require('module')

const requireTest = () => {
  return require('../src/moduleLoader').makeRequireFunction
}

const checkNewGlobalScopeInstance = (instance: any) => {
  expect(instance).toBeDefined()
  expect(instance.prototype).toBeDefined()
  const keys = Reflect.ownKeys(instance.prototype)
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
}

const createModule = () => {
  const mod = new Module(__filename, module)
  mod.filename = __filename
  mod.paths = Module._nodeModulePaths(path.dirname(__filename))
  mod.noCacheFor = []
  mod.exports = module.exports
  const context = Context.makeContext()
  context.console = console
  context.process = process
  vm.createContext(context)
  mod.context = context
  mod.loaded = true
  return mod
}

test('require', () => {
  expect.assertions(2)
  const makeRequireFunction = requireTest()
  expect(makeRequireFunction).toBeDefined()
  expect(typeof makeRequireFunction === 'function').toBeTruthy()
})

test('call makeRequireFunction without arguments', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  expect(() => {
    makeRequireFunction()
  }).toThrowError(/the mod argument is invalid/)
})

test('call makeRequireFunction', () => {
  expect.assertions(9)
  const makeRequireFunction = requireTest()
  let req: any = {}
  expect(() => {
    req = makeRequireFunction(createModule())
  }).not.toThrow()
  // tslint:disable-next-line: strict-type-predicates
  expect(typeof req === 'function').toBeTruthy()

  expect(req).toHaveProperty('resolve')
  expect(req).toHaveProperty('paths')
  expect(req).toHaveProperty('main')
  expect(req).toHaveProperty('extensions')
  expect(req).toHaveProperty('cache')

  expect(typeof req.resolve === 'function').toBeTruthy()
  expect(typeof req.paths === 'function').toBeTruthy()
})

test('call resolve without arguments', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req.resolve()
  }).toThrowError(/The "request" argument must be of type "string"/)
})

test('call resolve', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  const path = './dummy/newGlobalScope'
  const filename = req.resolve(path)
  expect(filename).toEqual(require.resolve(path))
})

test('call paths without arguments', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req.paths()
  }).toThrowError(/The "request" argument must be of type "string"/)
})

test('call paths', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const mod = createModule()
  const req = makeRequireFunction(mod)
  const path = './dummy/newGlobalScope'
  const filename = req.paths(path)
  expect(filename).toEqual(Module._resolveLookupPaths(path, mod, true))
})

test('call require without arguments', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req()
  }).toThrowError(/the request argument is invalid/)
})

test('call require with non existing module', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req('nonExistingModule')
  }).toThrowError(/Cannot find module 'nonExistingModule'/)
})

test('call require, check cache', () => {
  expect.assertions(7)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  const NewGlobalScope1 = req('./dummy/newGlobalScope')
  checkNewGlobalScopeInstance(NewGlobalScope1) // 3 assertions
  const NewGlobalScope2 = req('./dummy/newGlobalScope')
  checkNewGlobalScopeInstance(NewGlobalScope2) // 3 assertions
  expect(NewGlobalScope1 === NewGlobalScope2).toBeTruthy()
})

test('call require with noCacheFor', () => {
  expect.assertions(4)
  const makeRequireFunction = requireTest()
  const mod = createModule()
  const filename = require.resolve('./dummy/newGlobalScope')
  mod.noCacheFor = [Module._resolveFilename(filename, module, false)]
  const req = makeRequireFunction(mod)
  let NewGlobalScope
  expect(() => {
    NewGlobalScope = req(filename)
  }).not.toThrow()
  checkNewGlobalScopeInstance(NewGlobalScope) // 3 assertions
})

test('call require with noCacheFor and absolute path', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const mod = createModule()
  const filename = require.resolve('./dummy/newGlobalScope')
  mod.noCacheFor = [filename]
  const req = makeRequireFunction(mod)
  const NewGlobalScope = req(filename)
  checkNewGlobalScopeInstance(NewGlobalScope) // 3 assertions
})

test('updateChildren test', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req(require.resolve('./dummy/newGlobalScope'))
    req(require.resolve('./dummy/updateChiildrenTest'))
  }).not.toThrow()
})

test('require recursive', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  let test: any = {}
  expect(() => {
    test = req('./dummy/recursive')
  }).not.toThrow()
  expect(test).toHaveProperty('hello')
  expect(typeof test.hello === 'function').toBeTruthy()
})

test('require json', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  let test: any = {}
  expect(() => {
    test = req('./dummy/test.json')
  }).not.toThrow()
  expect(test).toHaveProperty('anything')
  expect(test.anything).toBeTruthy()
})

test('require invalid json', () => {
  expect.assertions(1)
  const makeRequireFunction = requireTest()
  const req = makeRequireFunction(createModule())
  expect(() => {
    req('./dummy/fail.json')
  }).toThrow()
})

test('require .node', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const mod = new Module()
  const req = makeRequireFunction(mod)
  let test: any = {}
  expect(() => {
    test = req(require.resolve('./dummy/addon.node'))
  }).not.toThrow()
  expect(test).toHaveProperty('hello')
  expect(typeof test.hello === 'function').toBeTruthy()
})

test('require file without extension', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const mod = new Module()
  const req = makeRequireFunction(mod)
  let test: any = {}
  expect(() => {
    test = req(require.resolve('./dummy/withoutExtension'))
  }).not.toThrow()
  expect(test).toHaveProperty('hello')
  expect(typeof test.hello === 'function').toBeTruthy()
})

test('require file with wrong extension', () => {
  expect.assertions(3)
  const makeRequireFunction = requireTest()
  const mod = new Module()
  const req = makeRequireFunction(mod)
  let test: any = {}
  expect(() => {
    test = req(require.resolve('./dummy/wrongExtension.jss'))
  }).not.toThrow()
  expect(test).toHaveProperty('hello')
  expect(typeof test.hello === 'function').toBeTruthy()
})
