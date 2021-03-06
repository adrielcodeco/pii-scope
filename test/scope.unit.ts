/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-env jest */

export {}

const requireTest = () => {
  return require('../src/scope').default
}

const useNativeModule = () => {
  const NativeModule = require('module')
  return new NativeModule(module.filename, null)
}

test('require', () => {
  expect.assertions(3)
  let Scope: any = {}
  expect(() => {
    Scope = requireTest()
  }).not.toThrow()
  expect(Scope).toBeDefined()
  // tslint:disable-next-line: strict-type-predicates
  expect(typeof Scope === 'function').toBeTruthy()
})

test('validation of invalid path', () => {
  expect.assertions(1)
  const Scope = requireTest()
  expect(() => {
    Scope()
  }).toThrowError(/the path argument is invalid/)
})

test('validation of absolute path', () => {
  expect.assertions(1)
  const Scope = requireTest()
  expect(() => {
    Scope('./dummy/newGlobalScope')
  }).toThrowError(/the path argument is not an absolute path/)
})

test('validation of arguments', () => {
  expect.assertions(1)
  const Scope = requireTest()
  expect(() => {
    Scope(require.resolve('./dummy/newGlobalScope'), {
      parentModule: useNativeModule()
    })
  }).not.toThrow()
})

test('using noCacheFor', () => {
  expect.assertions(1)
  const Scope = requireTest()
  expect(() => {
    const filename = require.resolve('./dummy/newGlobalScope')
    Scope(filename, {
      noCacheFor: [filename, require.resolve('./dummy/getGlobalVar')],
      parentModule: useNativeModule()
    })
  }).not.toThrow()
})
