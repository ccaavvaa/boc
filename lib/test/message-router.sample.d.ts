import { Message } from "../message";
import { MessageRouter } from "../message-router";
export declare class Base {
    protected router: MessageRouter;
    protected data: any;
    protected errors: any;
    protected constructor(router: MessageRouter);
    setError(error: any, path: string): void;
    protected setProp(propName: string, value: any): Promise<boolean>;
}
export declare class A extends Base {
    constructor(router: MessageRouter);
    get_a(): Promise<string>;
    set_a(value: string): Promise<boolean>;
    get_b(): Promise<string>;
    set_b(value: string): Promise<boolean>;
    get_c(): Promise<string>;
    set_c(value: string): Promise<boolean>;
    init(msg: Message): Promise<boolean>;
    calculateC(msg: Message): Promise<boolean>;
}
