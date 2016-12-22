import { Container } from './container';
import { Message } from './message';
export declare class ModelObject {
    static readonly oidProp: string;
    readonly container: Container;
    readonly oid: string;
    data: any;
    protected constructor(container: Container);
    init(data: any): void;
    initNew(oid: string): Promise<boolean>;
    sendMessage(message: Message): Promise<boolean>;
    protected getProp(propName: string): any;
    protected setProp(propName: string, value: any): Promise<boolean>;
}
