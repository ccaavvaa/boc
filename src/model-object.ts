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

    public roles: any;

    protected constructor(parentContainer: Container) {
        this.container = parentContainer;
        this.createRoles();
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

    protected async roleProp(roleName: string, value?: any): Promise<any> {
        let role = this.roles[roleName];
        if (value === null) {
            await role.unlink();
        } else if (value) {
            await role.link(value);
        }
        return role.getOpposite();
    }

    protected createRoles(): void {
        this.roles = {};
        let ci = this.container.modelMetadata.getClassInfo(this.constructor);
        if (ci.roles) {
            for (let roleDeclaration of ci.roles) {
                this.roles[roleDeclaration.settings.roleProp] =
                    new roleDeclaration.constr(this, roleDeclaration.settings);
            }
        }
    }
}
