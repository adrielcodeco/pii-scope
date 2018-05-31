import { compile } from './compile'

export type ScopeOptions = {
    noCacheFor: string[]
}

export default function Scope(path: string, options: ScopeOptions) {
    let { noCacheFor } = options || {
        noCacheFor: [],
    }
    const filename = require.resolve(path)
    noCacheFor = noCacheFor.map(m => {
        const Module = module.constructor as any
        return Module._resolveFilename(m, module.parent, false)
    })
    if (!noCacheFor.includes(filename)) {
        noCacheFor.push(filename)
    }
    return compile(filename, module.parent, noCacheFor)
}
