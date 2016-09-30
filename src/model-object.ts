import { Container } from "./container";
import { Message, MessageType } from "./message";

export class ModelObject {

    public get oid(): string {
        return this.data.id;
    }

    // data object
    protected data: any;

    protected constructor(protected container: Container) {
    }

    public init(data: any): void {
        this.data = data;
    }

    public async initNew(oid: string): Promise<boolean> {
        this.data.oid = oid;
        let message = new Message(MessageType.ObjectInit, this);
        let propagationOK = await this.container.messageRouter.sendMessage(message);
        return propagationOK;
    }

    protected getProp(propName: string): any {
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }

    protected async setProp(propName: string, value: any): Promise<boolean> {
        let oldValue = this.data[propName];
        this.data[propName] = value;
        let message = new Message(
            MessageType.PropChanged,
            this,
            {
                oldValue: oldValue,
                propName: propName,
            });
        let propagationOK = await this.container.messageRouter.sendMessage(message);
        return propagationOK;
    }
}
