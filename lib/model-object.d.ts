import { Container } from "./container";
export declare class ModelObject {
    protected container: Container;
    readonly oid: string;
    protected data: any;
    protected constructor(container: Container);
    init(data: any): void;
    initNew(oid: string): Promise<boolean>;
    protected getProp(propName: string): any;
    protected setProp(propName: string, value: any): Promise<boolean>;
}
