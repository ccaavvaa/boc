import { Container } from '../container';
import { ModelObject } from '../model-object';
import { HasOne, Reference } from '../relation';
export declare class A extends ModelObject {
    readonly c: HasOne<A, C>;
    readonly refB: Reference<A, B>;
    readonly idB: string;
    constructor(container: Container);
}
export declare class B extends ModelObject {
    constructor(container: Container);
}
export declare class C extends ModelObject {
    readonly a: Reference<C, A>;
    readonly idA: string;
    constructor(container: Container);
}
