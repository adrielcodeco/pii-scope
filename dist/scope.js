"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const compile_1 = require("./compile");
function Scope(path, options) {
    if (!path) {
        throw new Error('the path argument is invalid');
    }
    let { noCacheFor, parentModule } = Object.assign({}, {
        noCacheFor: [],
        parentModule: module
    }, options);
    let filename;
    if (!path_1.isAbsolute(path)) {
        throw new Error('the path argument is not an absolute path');
    }
    else {
        filename = require.resolve(path);
    }
    noCacheFor = noCacheFor.map(m => {
        if (path_1.isAbsolute(m)) {
            return require.resolve(m);
        }
        return undefined;
    }).filter(i => i);
    if (!noCacheFor.includes(filename)) {
        noCacheFor.push(filename);
    }
    return compile_1.compile(filename, parentModule, noCacheFor, {});
}
exports.default = Scope;
//# sourceMappingURL=scope.js.map