# [Pii Scope](https://github.com/adrielcodeco/pii-scope)

Pii Scope is library to create new global scopes

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status](https://travis-ci.org/adrielcodeco/pii-scope.svg?branch=master)](https://travis-ci.org/adrielcodeco/pii-scope)
[![Coverage Status](https://coveralls.io/repos/github/adrielcodeco/pii-scope/badge.svg)](https://coveralls.io/github/adrielcodeco/pii-scope)

[![NPM](https://nodei.co/npm/@pii/scope.png)](https://npmjs.org/package/@pii/scope)

## Installation

```
npm i -S @pii/scope
```

## Documentation

* [Quick Start](https://github.com/adrielcodeco/pii-scope/quick-start.html)
* [Examples](https://github.com/adrielcodeco/pii-scope/examples.html)

## Examples

Here is a simple example to get you started:

index.js

```js
const scope = require('@pii/scope')

const test1 = scope.New('./test')

const t1 = new test1()
t1.set()
t1.log()

const list = [1,2,3,4,5,6,7,8,9]
list.forEach(_ => {
    const test2 = scope.New('./test')
    const t2 = new test2()
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