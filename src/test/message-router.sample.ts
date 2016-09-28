// import { Rule } from "../decorators";
import { Message, MessageType } from "../message";
import { MessageRouter } from "../message-router";

export class Base {

    protected data: any = {};

    protected lastValidData: any = {};

    protected errors: any = {};

    protected constructor(protected router: MessageRouter) { }

    public setError(error: any, path: string) {
        if (!path) {
            path = ".";
        }
        let errors: any[] = this.errors[path] as any[];
        if (!errors) {
            errors = [error];
            this.errors[path] = errors;
        } else {
            errors.push(error);
        }
    }

    protected async setProp(propName: string, value: any): Promise<boolean> {
        let oldValue = this.data[propName];
        let oldValidValue = this.lastValidData[propName];
        if (value !== oldValue || value !== oldValidValue) {
            this.errors[propName] = [];
            this.data[propName] = value;
            let message = new Message(
                MessageType.PropChanged,
                this.constructor,
                this,
                {
                    oldValidValue: oldValidValue,
                    oldValue: oldValue,
                    propName: propName,
                });
            let propagationOK = await this.router.sendMessage(message);
            if (propagationOK) {
                this.lastValidData[propName] = value;
            }
            return propagationOK;
        }
        return true;
    }
}

export class A extends Base {

    constructor(router: MessageRouter) {
        super(router);
    }

    public get_a(): Promise<string> {
        return Promise.resolve<string>(this.data.a);
    }

    public set_a(value: string): Promise<boolean> {
        return this.setProp("a", value);
    }
}
