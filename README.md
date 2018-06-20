# [Pii Scope](https://github.com/adrielcodeco/pii-scope)

Pii Scope is library to create new global scopes

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status (linux, Mac)](https://travis-ci.org/adrielcodeco/pii-scope.svg?branch=master)](https://travis-ci.org/adrielcodeco/pii-scope)
[![Build status (Windows)](https://ci.appveyor.com/api/projects/status/5v0t0a0ndlu8hupc/branch/master?svg=true)](https://ci.appveyor.com/project/adrielcodeco/pii-scope/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/adrielcodeco/pii-scope/badge.svg?branch=master)](https://coveralls.io/github/adrielcodeco/pii-scope?branch=master)

[![NPM](https://nodei.co/npm/@pii/scope.png)](https://npmjs.org/package/@pii/scope)

## Installation

```
npm i -S @pii/scope
```

## Requirements

* NodeJS version >= 6

## Documentation

* [Quick Start](https://adrielcodeco.github.io/pii-scope#quick-start)
* [Examples](https://github.com/adrielcodeco/pii-scope/tree/master/examples)

## Examples

Here is a simple example to get you started:

index.js

```js
import scope from '@pii/scope'
// or require for ES5 
// const scope = require('@pii/scope').default

const Test1 = scope.New(require.resolve('./test'))

const t1 = new Test1()
t1.set()
t1.log()

const list = [1,2,3,4,5,6,7,8,9]
list.forEach(_ => {
  const Test2 = scope.New(require.resolve('./test'))
  const t2 = new Test2()
  t2.log()
})
```

test.js

```js
class Test {
  set() {
    global.testVar = 3.1415
  }
  log() {
    console.log(global.testVar || Math.random())
  }
}

module.exports = Test
```

### License

This project is [MIT licensed](./LICENSE).

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)