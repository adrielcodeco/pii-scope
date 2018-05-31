"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const helpers_1 = require("./helpers");
const require_1 = require("./require");
const _cache = Object.create(null);
function compile(filename, mod, noCacheFor) {
    const Module = mod.constructor;
    const context = vm.createContext({ global: {}, process });
    let func;
    if (filename in _cache) {
        const script = _cache[filename];
        func = script.runInContext(context);
    }
    else {
        let content = fs.readFileSync(filename, 'utf8');
        content = helpers_1.stripBOM(content);
        content = helpers_1.stripShebang(content);
        var wrapper = Module.wrap(content);
        const script = new vm.Script(wrapper, {
            filename: filename,
            lineOffset: 0,
            displayErrors: true,
        });
        _cache[filename] = script;
        func = script.runInContext(context);
    }
    const _module = new Module(filename, mod);
    _module.filename = filename;
    _module.paths = Module._nodeModulePaths(path.dirname(filename));
    _module.noCacheFor = noCacheFor || [];
    const customRequire = require_1.makeRequireFunction(_module);
    const dirname = path.dirname(filename);
    func.call(context, _module.exports, customRequire, _module, filename, dirname);
    _module.loaded = true;
    return _module.exports;
}
exports.compile = compile;
//# sourceMappingURL=compile.js.map