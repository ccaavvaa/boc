import { IRuleExecutionResult, MessageType } from './message';
import { ModelObject } from './model-object';
export interface IRelationSettings<P extends ModelObject, C extends ModelObject> {
    roleProp: keyof P;
    key?: keyof P;
    oppositeKey?: keyof C;
    oppositeRoleProp?: keyof C;
    oppositeConstr: {
        new (data?: any): C;
    };
    isSlave?: boolean;
}
export declare abstract class Relation<P extends ModelObject, C extends ModelObject> {
    protected settings: IRelationSettings<P, C>;
    protected loaded: boolean;
    readonly isLoaded: boolean;
    protected isMany: boolean;
    protected isComposition: boolean;
    protected owner: P;
    protected constructor(owner: P, settings: IRelationSettings<P, C>);
    getOppositeRole(opposite: C): Relation<C, P>;
    unload(): void;
    protected notifyRelationChange(messageType: MessageType, opposite: C, oldOpposite?: C): Promise<IRuleExecutionResult[]>;
    protected notifyRoleChange(messageType: MessageType, opposite: C): Promise<IRuleExecutionResult[]>;
    protected abstract doLink(opposite: C): void;
    protected abstract doUnlink(opposite: C): void;
    protected internalLink(opposite: C, oldOpposite?: C): Promise<IRuleExecutionResult[]>;
    protected internalUnlink(opposite: C): Promise<IRuleExecutionResult[]>;
}
export declare abstract class OneBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected oppositeValue: C;
    constructor(owner: P, settings: IRelationSettings<P, C>);
    unload(): void;
    getOpposite(): Promise<C>;
    link(opposite: C): Promise<IRuleExecutionResult[]>;
    unlink(): Promise<IRuleExecutionResult[]>;
    protected abstract load(): Promise<C>;
}
export declare class Reference<P extends ModelObject, C extends ModelObject> extends OneBase<P, C> {
    readonly key: string;
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected load(): Promise<C>;
}
export declare class HasOne<P extends ModelObject, C extends ModelObject> extends Reference<P, C> {
    constructor(owner: P, settings: IRelationSettings<P, C>);
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected load(): Promise<C>;
}
export declare abstract class ManyBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected items: Array<C>;
    constructor(owner: P, settings: IRelationSettings<P, C>);
    unload(): void;
    toArray(): Promise<Array<C>>;
    abstract load(): Promise<void>;
    link(opposite: C): Promise<IRuleExecutionResult[]>;
    unlink(opposite: C): Promise<IRuleExecutionResult[]>;
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected contains(opposite: C): boolean;
}
export declare class Many<P extends ModelObject, C extends ModelObject> extends ManyBase<P, C> {
    load(): Promise<void>;
}
export declare class HasMany<P extends ModelObject, C extends ModelObject> extends ManyBase<P, C> {
    constructor(owner: P, settings: IRelationSettings<P, C>);
    load(): Promise<void>;
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
}
export interface IRoleDeclaration {
    constr: any;
    settings: any;
}
