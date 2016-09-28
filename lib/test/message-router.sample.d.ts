import { MessageRouter } from "../message-router";
export declare class Base {
    protected router: MessageRouter;
    protected data: any;
    protected lastValidData: any;
    protected errors: any;
    protected constructor(router: MessageRouter);
    setError(error: any, path: string): void;
    protected setProp(propName: string, value: any): Promise<boolean>;
}
export declare class A extends Base {
    constructor(router: MessageRouter);
    get_a(): Promise<string>;
    set_a(value: string): Promise<boolean>;
}
