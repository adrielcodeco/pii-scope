#!/usr/bin/env node

import { moduleLoader } from './moduleLoader'
import * as path from 'path'
const yargs = require('yargs')
const Module = require('module')

// tslint:disable
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
    (argv: any) => {
      process.env.CHECK_CR = argv.showLoading.toString()
      const filename = path.resolve(process.cwd(), argv.file)
      const module = new Module()
      module.paths = Module._nodeModulePaths(path.dirname(filename))
      moduleLoader(argv.file, module, Object.create(null))
    }
  )
  .help().argv
// tslint:enable
