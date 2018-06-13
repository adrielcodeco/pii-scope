(() => {
  const requireTest = () => {
    // require scope
    return require('../src/helpers')
  }

  test('require', () => {
    expect.assertions(2)
    const helpers = requireTest()
    expect(helpers).toBeDefined()
    expect(typeof helpers === 'object').toBeTruthy()
  })

  test('call stripBOM without arguments', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripBOM()
    }).not.toThrow()
    expect(content).toBeUndefined()
  })

  test('call stripBOM', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripBOM(`${String.fromCharCode(0xfeff)}test`)
    }).not.toThrow()
    expect(content).toEqual('test')
  })

  test('call stripShebang without arguments', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripShebang()
    }).not.toThrow()
    expect(!content).toBeTruthy()
  })

  test('call stripShebang', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripShebang(`test`)
    }).not.toThrow()
    expect(content).toEqual('test')
  })

  test('call stripShebang with #! only', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripShebang(`#!`)
    }).not.toThrow()
    expect(content).toEqual('')
  })

  test('call stripShebang with #!', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripShebang(`#!/usr/bin/env node`)
    }).not.toThrow()
    expect(content).toEqual('')
  })

  test('call stripShebang with #! multiline', () => {
    expect.assertions(2)
    const helpers = requireTest()
    let content
    expect(() => {
      content = helpers.stripShebang(
          `#!/usr/bin/env node
           test`
        )
    }).not.toThrow()
    expect(content).toMatch(/^[\s\r\n]+test$/)
  })
})()
