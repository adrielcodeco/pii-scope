export default class Context {
  global: any
  process: any
  console: any
  _cache: any
  constructor () {
    this.global = Object.create(null)
    this._cache = Object.create(null)
  }
}
