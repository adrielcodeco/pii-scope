const getGlobal = require('./getGlobalVar')

global['test'] = 1

class NewGlobalScope {
  setGlobal (key, value) {
    global[key] = value
  }
  getGlobal (key) {
    return getGlobal(key)
  }
}

module.exports = NewGlobalScope
