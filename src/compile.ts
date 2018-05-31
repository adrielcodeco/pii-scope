import * as fs from 'fs'
import * as path from 'path'
import * as vm from 'vm'
import { stripBOM, stripShebang } from './helpers'
import { makeRequireFunction } from './require'

const _cache = Object.create(null)

export function compile(filename: string, mod: any, noCacheFor: string[]): any {
    const Module = mod.constructor
    const context = vm.createContext({ global: {}, process })
    let func
    if (filename in _cache) {
        const script = _cache[filename]
        func = script.runInContext(context)
    } else {
        let content = fs.readFileSync(filename, 'utf8')
        content = stripBOM(content)
        content = stripShebang(content)
        var wrapper = Module.wrap(content)
        const script = new vm.Script(wrapper, {
            filename: filename,
            lineOffset: 0,
            displayErrors: true,
        })
        _cache[filename] = script
        func = script.runInContext(context)
    }
    const _module = new Module(filename, mod)
    _module.filename = filename
    _module.paths = Module._nodeModulePaths(path.dirname(filename))
    _module.noCacheFor = noCacheFor || []
    const customRequire = makeRequireFunction(_module)
    const dirname = path.dirname(filename)
    func.call(context, _module.exports, customRequire, _module, filename, dirname)
    _module.loaded = true
    return _module.exports
}
