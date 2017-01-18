import { Container } from './container';
import { IRuleExecutionResult, Message } from './message';
import { ClassInfo } from './model-metadata';
import { ErrorInfos } from './object-error';
import { IdType } from 'boc-interfaces';
export declare type ModelObjectConstructor<T extends ModelObject> = new (container: Container) => T;
export declare class ModelObject {
    static readonly oidProp: string;
    readonly container: Container;
    readonly oid: IdType;
    data: any;
    roles: any;
    properties: any;
    state: any;
    readonly errors: ErrorInfos;
    protected constructor(parentContainer: Container);
    init(data: any, isNew?: boolean): Promise<IRuleExecutionResult[]>;
    initNew(oid: IdType): Promise<IRuleExecutionResult[]>;
    sendMessage(message: Message): Promise<IRuleExecutionResult[]>;
    protected getProp(propName: string): any;
    protected setProp(propName: string, value: any): Promise<IRuleExecutionResult[]>;
    protected prop(propName: string, value?: any): Promise<any>;
    protected getRoleProp(roleName: string): Promise<any>;
    protected setRoleProp(roleName: string, value?: any): Promise<any>;
    protected createRoles(ci: ClassInfo): void;
    protected createProperties(ci: ClassInfo): void;
}
