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
    protected owner: P;
    protected constructor(owner: P, settings: IRelationSettings<P, C>);
    getOppositeRole(opposite: C): Relation<C, P>;
    protected abstract notifyLink(opposite: C): Promise<boolean>;
    protected abstract notifyUnlink(opposite: C): Promise<boolean>;
    protected abstract doLink(opposite: C): void;
    protected abstract doUnlink(opposite: C): void;
}
export declare abstract class OneBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected oppositeValue: C;
    protected loaded: boolean;
    constructor(owner: P, settings: IRelationSettings<P, C>);
    getOpposite(): Promise<C>;
    link(opposite: C): Promise<boolean>;
    unlink(): Promise<boolean>;
    protected abstract load(): Promise<boolean>;
    protected internalLink(opposite: C): Promise<boolean>;
}
export declare class Reference<P extends ModelObject, C extends ModelObject> extends OneBase<P, C> {
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected notifyUnlink(opposite: C): Promise<boolean>;
    protected notifyLink(opposite: C): Promise<boolean>;
    protected load(): Promise<boolean>;
}
export declare class HasOne<P extends ModelObject, C extends ModelObject> extends Reference<P, C> {
    protected doLink(opposite: C): void;
    protected doUnlink(opposite: C): void;
    protected load(): Promise<boolean>;
}
