/// <reference types="node" />
declare class NativeModule {
    _cache: {};
    _extensions: {
        '.json': Function;
        '.node': Function;
    };
    _nodeModulePaths: (path: string) => string[];
    _resolveFilename: (require: string, module: Module, isMain: boolean, options?: {}) => string;
    _resolveLookupPaths: (require: string, module: Module, isMain: boolean) => string[];
}
export default NativeModule;
//# sourceMappingURL=Module.d.ts.map