/// <reference types="node" />
import Module from 'module';
export declare type ScopeOptions = {
    noCacheFor?: string[];
    parentModule?: Module;
    globals?: {} | undefined;
};
export default function Scope(path: string, options: ScopeOptions): any;
//# sourceMappingURL=scope.d.ts.map