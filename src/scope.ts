/**
 * Copyright 2018-present, CODECO. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { isAbsolute } from 'path'
import { moduleLoader } from './moduleLoader'
import Module from 'module'

export type ScopeOptions = {
  noCacheFor?: string[]
  parentModule?: Module
  globals?: {} | undefined
}

export default function Scope (path: string, options: ScopeOptions) {
  if (!path) {
    throw new Error('the path argument is invalid')
  }
  const defaultParams: {
    noCacheFor: string[]
    parentModule: Module
    globals: {} | undefined
  } = {
    noCacheFor: [],
    parentModule: module,
    globals: Object.create(null)
  }
  let { noCacheFor, parentModule, globals } = Object.assign(
    {},
    defaultParams,
    options
  )
  if (!isAbsolute(path)) {
    throw new Error('the path argument is not an absolute path')
  }
  noCacheFor = noCacheFor
    .map(m => {
      if (isAbsolute(m)) {
        return m
      }
      try {
        return require.resolve(m)
      } finally {
        // does nothing
      }
      try {
        return (parentModule.require as any).resolve(m)
      } finally {
        // does nothing
      }
      return ''
    })
    .filter(i => i)
  if (!noCacheFor.includes(path)) {
    noCacheFor.push(path)
  }
  (parentModule as any).noCacheFor = noCacheFor
  return moduleLoader(path, parentModule, globals)
}
