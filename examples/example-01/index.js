// import scope from '@pii/scope'
// or require for ES5
const scope = require('../../dist').default

const Test1 = scope.New(require.resolve('./test'))

const t1 = new Test1()
t1.set()
t1.log()

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
list.forEach(_ => {
  const Test2 = scope.New(require.resolve('./test'))
  const t2 = new Test2()
  t2.log()
})
