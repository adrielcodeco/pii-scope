class Test {
  set () {
    global.testVar = 3.1415
  }
  log () {
    console.log(global.testVar || Math.random())
  }
}

module.exports = Test
