import Scope, { ScopeOptions } from './scope'

export default class {
  static New (path: string, options: ScopeOptions) {
    return Scope(path, options)
  }
}
