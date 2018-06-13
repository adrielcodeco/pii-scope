"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const require_1 = require("./require");
function moduleWrap() {
    const customRequire = require_1.makeRequireFunction(module);
}
exports.default = moduleWrap;
//# sourceMappingURL=moduleWrap.js.map