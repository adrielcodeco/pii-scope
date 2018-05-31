# [Pii Scope](https://github.com/adrielcodeco/pii-scope)

Pii Scope is library to create new global scopes

## Documentation


* [Quick Start](https://github.com/adrielcodeco/pii-scope/quick-start.html)
* [Examples](https://github.com/adrielcodeco/pii-scope/examples.html)

## Examples

Here is a simple example to get you started:

index.js

```js
const Scope = require('@pii/scope')

const test1 = Scope('./test')

const t1 = new test1()
t1.set()
t1.log()

const list = [1,2,3,4,5,6,7,8,9]
list.forEach(_ => {
    const test2 = Scope('./test')
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