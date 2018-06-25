/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-env jest */
const testKey = 'Pii'

const requireTest = () => {
  // require scope
  return require('../dist').default
}

const useNativeModule = () => {
  const NativeModule = require('module')
  return new NativeModule(module.filename, null)
}

const getTestScoped = () => {
  const Scope = requireTest()
  // require newGlobalScope in new scope
  return Scope.New(require.resolve('./dummy/newGlobalScope'), {
    parentModule: useNativeModule()
  })
}

test('require', () => {
  expect.assertions(1)
  const Scope = requireTest()
  // check if scope have New static function
  expect(Scope).toHaveProperty('New')
})

test('call New function', () => {
  expect.assertions(3)
  const NewGlobalScope = getTestScoped()
  // check if then new scope is anything
  expect(NewGlobalScope).toBeDefined()
  expect(NewGlobalScope.prototype).toBeDefined()
  const keys = Reflect.ownKeys(NewGlobalScope.prototype)
  // check if the new scope have the properties getGlobal and setGlobal
  expect(keys).toEqual(expect.arrayContaining(['getGlobal', 'setGlobal']))
})

test('test scopes', () => {
  expect.assertions(10)
  const value = 'mainScope'
  Reflect.set(global, testKey, value)

  const NewGlobalScope1 = getTestScoped()
  const test1 = new NewGlobalScope1()
  expect(test1.getGlobal(testKey)).not.toEqual(value)
  test1.setGlobal(testKey, 'test1')
  expect(test1.getGlobal(testKey)).toEqual('test1')
  expect(Reflect.get(global, testKey)).not.toEqual('test1')

  const NewGlobalScope2 = getTestScoped()
  const test2 = new NewGlobalScope2()
  expect(test2.getGlobal(testKey)).not.toEqual(value)
  expect(test2.getGlobal(testKey)).not.toEqual('test1')
  test2.setGlobal(testKey, 'test2')
  expect(test2.getGlobal(testKey)).toEqual('test2')

  expect(test1.getGlobal(testKey)).not.toEqual(value)
  expect(test1.getGlobal(testKey)).not.toEqual('test2')
  expect(test1.getGlobal(testKey)).toEqual('test1')
  expect(Reflect.get(global, testKey)).not.toEqual('test2')
})
