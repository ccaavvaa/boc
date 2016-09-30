import { Rule } from "../decorators";
import { Message, MessageType } from "../message";
import { MessageRouter } from "../message-router";

export class Base {

    protected data: any = {};

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
        this.data[propName] = value;
        let message = new Message(
            MessageType.PropChanged,
            this,
            {
                oldValue: oldValue,
                propName: propName,
            }
            );
        let propagationOK = await this.router.sendMessage(message);
        return propagationOK;
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

    public get_b(): Promise<string> {
        return Promise.resolve<string>(this.data.b);
    }

    public set_b(value: string): Promise<boolean> {
        return this.setProp("b", value);
    }

    public get_c(): Promise<string> {
        return Promise.resolve<string>(this.data.c);
    }

    public set_c(value: string): Promise<boolean> {
        return this.setProp("c", value);
    }

    @Rule({
        description: "A:initialisation",
        id: "A.0",
        level: 0,
        triggers: [{ kind: MessageType.ObjectInit }],
    })
    public async init(msg: Message): Promise<boolean> {
        let result = await this.set_a("initial a");
        return result;
    }

    @Rule({
        description: "A:c=a+b",
        id: "A.1",
        level: 0,
        triggers: [
            {
                body: { propName: "a" },
                kind: MessageType.PropChanged,
            },
            {
                body: { propName: "b" },
                kind: MessageType.PropChanged,
            },
        ],
    })
    public async calculateC(msg: Message): Promise<boolean> {
        let aa = await this.get_a();
        let bb = await this.get_b();
        let x: string[] = [aa, bb];
        let newValue = x.reduce((p, v) => {
            if (v) {
                if (p) {
                    p = p + " ";
                }
                p = p + v;
            }
            return p;
        }, "");

        let result = await this.set_c(newValue);
        return result;
    }
}
