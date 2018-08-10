#!/usr/bin/env node
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const moduleLoader_1 = require('./moduleLoader')
const path = require('path')
const yargs = require('yargs')
const Module = require('module')
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
    argv => {
      process.env.CHECK_CR = argv.showLoading.toString()
      const filename = path.resolve(process.cwd(), argv.file)
      const module = new Module()
      module.paths = Module._nodeModulePaths(path.dirname(filename))
      moduleLoader_1.moduleLoader(argv.file, module, Object.create(null))
    }
  )
  .help().argv

//# sourceMappingURL=cli.js.map
