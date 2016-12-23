import { MessageType } from './message';
import { ModelObject } from './model-object';
export interface IRelationSettings<P extends ModelObject, C extends ModelObject> {
    roleProp: keyof P;
    key?: keyof P;
    oppositeKey?: keyof C;
    oppositeRoleProp?: keyof C;
    oppositeConstr?: {
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
    protected notifyRelationChange(messageType: MessageType, opposite: C, oldOpposite?: C): Promise<boolean>;
    protected notifyRoleChange(messageType: MessageType, opposite: C): Promise<boolean>;
    protected abstract doLink(opposite: C): void;
    protected abstract doUnlink(opposite: C): void;
    protected internalLink(opposite: C, oldOpposite?: C): Promise<boolean>;
    protected internalUnlink(opposite: C): Promise<boolean>;
}
export declare abstract class OneBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected oppositeValue: C;
    constructor(owner: P, settings: IRelationSettings<P, C>);
    unload(): void;
    getOpposite(): Promise<C>;
    link(opposite: C): Promise<boolean>;
    unlink(): Promise<boolean>;
    protected abstract load(): Promise<boolean>;
}
export declare class Reference<P extends ModelObject, C extends ModelObject> extends OneBase<P, C> {
    readonly key: string;
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected load(): Promise<boolean>;
}
export declare class HasOne<P extends ModelObject, C extends ModelObject> extends Reference<P, C> {
    constructor(owner: P, settings: IRelationSettings<P, C>);
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected load(): Promise<boolean>;
}
export declare class ManyBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected items: Array<C>;
    constructor(owner: P, settings: IRelationSettings<P, C>);
    unload(): void;
    link(opposite: C): Promise<boolean>;
    unlink(opposite: C): Promise<boolean>;
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected contains(opposite: C): boolean;
}
export declare class HasMany<P extends ModelObject, C extends ModelObject> extends ManyBase<P, C> {
    constructor(owner: P, settings: IRelationSettings<P, C>);
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
}
