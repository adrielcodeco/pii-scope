const recursive = require('./recursive')

module.exports = {
  hello: function () {
    recursive.hello()
  }
}
