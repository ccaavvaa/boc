import { Container } from './container';
import { Message, MessageType } from './message';

export class ModelObject {

    public static readonly oidProp = 'oid';

    public readonly container: Container;

    public get oid(): string {
        return this.data.oid;
    }

    // data object
    public data: any;

    protected constructor(container: Container) {
        this.container = container;
    }

    public init(data: any): void {
        this.data = data;
    }

    public async initNew(oid: string): Promise<boolean> {
        this.data = {
            'oid': oid,
        };
        let message = new Message(MessageType.ObjectInit, this);
        let propagationOK = await this.container.messageRouter.sendMessage(message);
        return propagationOK;
    }

    public sendMessage(message: Message): Promise<boolean> {
        return this.container.messageRouter.sendMessage(message);
    }

    protected getProp(propName: string): any {
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }

    protected setProp(propName: string, value: any): Promise<boolean> {
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
