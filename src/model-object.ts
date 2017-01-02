import { Container } from './container';
import { IRuleExecutionResult, Message, MessageType } from './message';

export type ModelObjectConstructor<T extends ModelObject> = new (container: Container) => T;

export type IdType = string;

export class ModelObject {

    public static readonly oidProp = 'oid';

    public readonly container: Container;

    public get oid(): IdType {
        return this.data.oid;
    }

    // data object
    public data: any;

    protected constructor(acontainer: Container) {
        this.container = acontainer;
    }

    public init(data: any, isNew?: boolean): Promise<IRuleExecutionResult[]> {
        this.data = data;
        this.container.store(this);
        let message = new Message(MessageType.ObjectInit, this, {
            isNew: isNew,
        });
        return this.container.messageRouter.sendMessage(message);
    }

    public initNew(oid: IdType): Promise<IRuleExecutionResult[]> {
        let data: any = {};
        data[ModelObject.oidProp] = oid;
        return this.init(data, true);
    }

    public sendMessage(message: Message): Promise<IRuleExecutionResult[]> {
        return this.container.messageRouter.sendMessage(message);
    }

    protected getProp(propName: string): any {
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }

    protected setProp(propName: string, value: any): Promise<IRuleExecutionResult[]> {
        let oldValue = this.data[propName];
        this.data[propName] = value;
        let message = new Message(
            MessageType.PropChanged,
            this,
            {
                oldValue: oldValue,
                propName: propName,
            });
        return this.sendMessage(message);
    }
}
