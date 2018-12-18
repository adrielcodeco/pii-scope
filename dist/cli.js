#!/usr/bin/env node
'use strict'
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null) {
      for (var k in mod) { if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k] }
    }
    result['default'] = mod
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
var moduleLoader_1 = require('./moduleLoader')
var path = __importStar(require('path'))
var yargs = require('yargs')
var Module = require('module')
yargs
  .command(
    ['check [file]', '$0'],
    '-  check for circular reference',
    {
      showLoading: {
        alias: 'sl',
        default: true
      }
    },
    function (argv) {
      process.env.CHECK_CR = argv.showLoading.toString()
      var filename = path.resolve(process.cwd(), argv.file)
      var module = new Module()
      module.paths = Module._nodeModulePaths(path.dirname(filename))
      moduleLoader_1.moduleLoader(argv.file, module, Object.create(null))
    }
  )
  .help().argv

//# sourceMappingURL=cli.js.map
