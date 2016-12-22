import { Container } from "./container";
import { ModelObject } from "./model-object";
export declare class ObjectStore {
    tempGet: (filter: any) => Promise<any>;
    private readonly container;
    constructor(container: Container);
    getOne<C extends ModelObject>(filter: any): Promise<C>;
}
