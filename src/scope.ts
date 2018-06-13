import { isAbsolute } from 'path'
import { compile } from './compile'

export type ScopeOptions = {
  noCacheFor: string[]
  parentModule: any
}

export default function Scope (path: string, options: ScopeOptions) {
  if (!path) {
    throw new Error('the path argument is invalid')
  }
  let { noCacheFor, parentModule } = Object.assign(
    {},
    {
      noCacheFor: [] as string[],
      parentModule: module as any
    },
    options
  )
  let filename
  if (!isAbsolute(path)) {
    throw new Error('the path argument is not an absolute path')
  } else {
    filename = require.resolve(path)
  }
  noCacheFor = noCacheFor.map(m => {
    if (isAbsolute(m)) {
      return require.resolve(m)
    }
    return undefined
  }).filter(i => i) as string[]
  if (!noCacheFor.includes(filename)) {
    noCacheFor.push(filename)
  }
  return compile(filename, parentModule, noCacheFor, {})
}
