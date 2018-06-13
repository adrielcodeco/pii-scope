(() => {
  const requireTest = () => {
    // require scope
    return require('../src/scope').default
  }

  const useNativeModule = () => {
    const NativeModule = require('module')
    return new NativeModule(module.filename, null)
  }

  test('require', () => {
    expect.assertions(3)
    let Scope
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
      Scope(require.resolve('./dummy/newGlobalScope'), { parentModule: useNativeModule() })
    }).not.toThrow()
  })

  test('using noCacheFor', () => {
    expect.assertions(1)
    const Scope = requireTest()
    expect(() => {
      const filename = require.resolve('./dummy/newGlobalScope')
      Scope(filename, {
        noCacheFor: [filename, './dummy/getGlobalVar'],
        parentModule: useNativeModule()
      })
    }).not.toThrow()
  })
})()
