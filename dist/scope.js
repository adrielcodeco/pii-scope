"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compile_1 = require("./compile");
function Scope(path, options) {
    let { noCacheFor } = options || {
        noCacheFor: [],
    };
    const filename = require.resolve(path);
    noCacheFor = noCacheFor.map(m => {
        const Module = module.constructor;
        return Module._resolveFilename(m, module.parent, false);
    });
    if (!noCacheFor.includes(filename)) {
        noCacheFor.push(filename);
    }
    return compile_1.compile(filename, module.parent, noCacheFor);
}
exports.default = Scope;
//# sourceMappingURL=scope.js.map