const recursive = require('./recursive2')

module.exports = {
  recursive: function () {
    recursive.hello()
  },
  hello: function () {
    console.log('recursive')
  }
}
