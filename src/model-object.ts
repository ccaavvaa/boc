import { Container } from './container';
import { IRuleExecutionResult, Message, MessageType } from './message';
import { ClassInfo } from './model-metadata';
import { ErrorInfos } from './object-error';
import { HasMany, Many } from './relation';

import { IdType } from 'boc-interfaces';

export type ModelObjectConstructor<T extends ModelObject> = new (container: Container) => T;

export class ModelObject {

    public static readonly oidProp = 'oid';

    public readonly container: Container;

    public get oid(): IdType {
        return this.data.oid;
    }

    // data object
    public data: any;

    public roles: any;

    public properties: any;

    public state: any;

    public readonly errors: ErrorInfos;

    protected constructor(parentContainer: Container) {
        this.container = parentContainer;
        let ci = this.container.modelMetadata.getClassInfo(this.constructor);

        this.createProperties(ci);
        this.createRoles(ci);
        this.errors = new ErrorInfos(this);
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
        let propObject = this.properties[propName];
        if (propObject) {
            return propObject.value;
        }

        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }

    protected setProp(propName: string, value: any): Promise<IRuleExecutionResult[]> {
        let oldValue = this.data[propName];
        let propObject = this.properties[propName];
        if (propObject) {
            propObject.value = value;
        } else {
            this.data[propName] = value;
        }
        let message = new Message(
            MessageType.PropChanged,
            this,
            {
                propName: propName,
            },
            {
                newValue: this.data[propName],
                oldValue: oldValue,
            });
        return this.sendMessage(message);
    }

    protected async prop(propName: string, value?: any): Promise<any> {
        if (value !== undefined) {
            await this.setProp(propName, value);
        }
        return this.getProp(propName);
    }

    protected getRoleProp(roleName: string): Promise<any> {
        let role = this.roles[roleName];
        return role.getOpposite();
    }

    protected async setRoleProp(roleName: string, value?: any): Promise<any> {
        let role = this.roles[roleName];
        if (value) {
            return role.link(value);
        } else {
            return role.unlink();
        }
    }

    protected createRoles(ci: ClassInfo): void {
        this.roles = {};
        if (ci.roles) {
            for (let roleDeclaration of ci.roles) {
                let role = new roleDeclaration.constr(this, roleDeclaration.settings);
                if (role.constructor === HasMany || role.constructor === Many) {
                    let that: any = this;
                    that[roleDeclaration.settings.roleProp] = role;
                } else {
                    this.roles[roleDeclaration.settings.roleProp] = role;
                }
            }
        }
    }

    protected createProperties(ci: ClassInfo): void {
        this.properties = {};
        if (ci.properties) {
            for (let propertyDeclaration of ci.properties) {
                let typeSettings = this.container.modelMetadata.mergeTypeSettings(propertyDeclaration.typeSettings);
                this.properties[propertyDeclaration.propName] =
                    new typeSettings.constr(this, propertyDeclaration.propName, typeSettings);
            }
        }
    }
}
