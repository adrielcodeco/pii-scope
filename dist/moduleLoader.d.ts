export declare function initModule(filename: string, parentModule?: any): any;
export declare function moduleLoader(request: string, parentModule: any, globals: any): any;
export declare function compatibilityTsNode(filename: string, code: string): string;
export declare function codePreProcessor(filename: string, code: string): string;
export declare function compile(mod: any, filename: string, globals: any): any;
export declare function makeRequireFunction(mod: any): (request: string) => any;
//# sourceMappingURL=moduleLoader.d.ts.map