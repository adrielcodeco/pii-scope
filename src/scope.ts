/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isAbsolute } from 'path'
import { compile } from './compile'
import Module from 'module'

export type ScopeOptions = {
  noCacheFor?: string[],
  parentModule?: Module
}

export default function Scope (path: string, options: ScopeOptions) {
  if (!path) {
    throw new Error('the path argument is invalid')
  }
  const defaultParams: {
    noCacheFor: string[],
    parentModule: Module
  } = {
    noCacheFor: [],
    parentModule: module
  }
  let { noCacheFor, parentModule } = Object.assign({}, defaultParams, options)
  let filename
  if (!isAbsolute(path)) {
    throw new Error('the path argument is not an absolute path')
  } else {
    filename = require.resolve(path)
  }
  noCacheFor = noCacheFor
    .map(m => {
      if (isAbsolute(m)) {
        return require.resolve(m)
      }
      return ''
    })
    .filter(i => i)
  if (!noCacheFor.includes(filename)) {
    noCacheFor.push(filename)
  }
  return compile(filename, parentModule, noCacheFor, {})
}
