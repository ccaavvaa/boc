import { Container } from '../container';
import { ModelObject } from '../model-object';
import { Reference } from '../relation';
import { A } from './relation.sample';
export declare class C extends ModelObject {
    readonly a: Reference<C, A>;
    readonly idA: string;
    constructor(container: Container);
}
