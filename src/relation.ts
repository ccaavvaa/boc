// import { Container } from './container';
import { IRuleExecutionResult, Message, MessageType } from './message';
// import { MessageRouter } from './message-router';
import { ModelObject } from './model-object';
// import { ModelMetadata } from './model-metadata';
import { ObjectFilter } from './object-filter';

export interface IRelationSettings<P extends ModelObject, C extends ModelObject> {
    roleProp: keyof P;
    key?: keyof P;
    oppositeKey?: keyof C;
    // oppositeKey?: keyof C;
    oppositeRoleProp?: keyof C;
    oppositeConstr?: { new (data?: any): C };
    isSlave?: boolean;
}

export abstract class Relation<P extends ModelObject, C extends ModelObject> {
    protected settings: IRelationSettings<P, C>;

    protected loaded: boolean;

    public get isLoaded(): boolean {
        return this.loaded;
    }

    protected isMany: boolean;

    protected isComposition = false;

    protected owner: P;

    protected constructor(owner: P, settings: IRelationSettings<P, C>) {
        this.isMany = false;
        this.isComposition = false;
        this.settings = settings;
        this.owner = owner;
        this.loaded = false;

    }

    public getOppositeRole(opposite: C): Relation<C, P> {
        if (opposite && this.settings.oppositeRoleProp) {
            let role = opposite[this.settings.oppositeRoleProp] as any;
            return role as Relation<C, P>;
        }
        return null;
    }

    public unload(): void {
        this.loaded = false;
    }

    protected async notifyRelationChange(
        messageType: MessageType,
        opposite: C, oldOpposite?: C): Promise<IRuleExecutionResult[]> {
        let oppositeRole = this.getOppositeRole(opposite);
        let oldOppositeRole = this.getOppositeRole(oldOpposite);

        type Notifier = () => Promise<IRuleExecutionResult[]>;
        let oldOppositeNotifier: Notifier = oldOppositeRole ? () =>
            oppositeRole.notifyRoleChange(MessageType.Unlink, this.owner) : null;
        let oppositeNotifier: Notifier = oppositeRole ? () =>
            oppositeRole.notifyRoleChange(messageType, this.owner) : null;
        let selfNotifier: Notifier = () => this.notifyRoleChange(messageType, opposite);
        let roleNotifiers: Array<Notifier> = this.settings.isSlave ?
            [oldOppositeNotifier, oppositeNotifier, selfNotifier] :
            [oldOppositeNotifier, selfNotifier, oppositeNotifier];

        let result: IRuleExecutionResult[];

        for (let notifier of roleNotifiers) {
            if (notifier) {
                let executionsResult = await notifier();
                if (executionsResult) {
                    result = result.concat(executionsResult);
                }
            }
        }
        return result;
    }

    protected async notifyRoleChange(messageType: MessageType, opposite: C): Promise<IRuleExecutionResult[]> {
        let message = new Message(
            messageType,
            this.owner,
            {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
        let propagationOK = await this.owner.container.messageRouter.sendMessage(message);
        return propagationOK;
    }

    protected abstract doLink(opposite: C): void;

    protected abstract doUnlink(opposite: C): void;

    protected internalLink(opposite: C, oldOpposite?: C): Promise<IRuleExecutionResult[]> {
        this.doLink(opposite);
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole) {
            (oppositeRole as any).doLink(this.owner);
        }

        return this.notifyRelationChange(MessageType.Link, opposite, oldOpposite);
    }

    protected internalUnlink(opposite: C): Promise<IRuleExecutionResult[]> {
        this.doUnlink(opposite);
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole) {
            (oppositeRole as any).doUnlink(this.owner);
        }

        return this.notifyRelationChange(MessageType.Link, opposite);
    }
}

export abstract class OneBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {

    protected oppositeValue: C;

    public constructor(owner: P, settings: IRelationSettings<P, C>) {
        super(owner, settings);
    }

    public unload(): void {
        super.unload();
        this.oppositeValue = null;
    }

    public async getOpposite(): Promise<C> {
        await this.load();
        return this.oppositeValue;
    }

    public async link(opposite: C): Promise<IRuleExecutionResult[]> {
        let currentOpposite = this.loaded ? this.oppositeValue : await this.getOpposite();

        if (currentOpposite === opposite) {
            return null;
        }

        // opposite is linked to another ?
        let oppositeRole = this.getOppositeRole(opposite) as any;
        if (oppositeRole && !oppositeRole.isMany && oppositeRole.key !== this.owner.oid) {
            throw new Error('Opposite is linked to another object');
        }

        if (currentOpposite) {
            if (this.isComposition) {
                throw new Error('Opposite is set');
            }
            let currentOppositeRole = this.getOppositeRole(currentOpposite);
            if (currentOppositeRole) {
                (currentOppositeRole as any).doUnlink(this.owner);
            }
        }
        return this.internalLink(opposite, currentOpposite);
    }

    public async unlink(): Promise<IRuleExecutionResult[]> {
        let opposite = this.loaded ? this.oppositeValue : await this.getOpposite();
        let oppositeRole = this.getOppositeRole(opposite);
        if (opposite) {
            this.doUnlink(opposite);
            if (oppositeRole) {
                (oppositeRole as any).doUnlink(this.owner);
            }
        }

        return this.notifyRelationChange(MessageType.Unlink, opposite);
    }

    protected abstract load(): Promise<boolean>;
}

export class Reference<P extends ModelObject, C extends ModelObject> extends OneBase<P, C> {

    public get key(): string {
        if (this.loaded) {
            return this.oppositeValue.oid;
        } else if (this.settings.key) {
            return this.owner.data[this.settings.key];
        } else {
            return null;
        }
    }

    protected doLink(opposite: C): void {
        this.loaded = true;
        this.oppositeValue = opposite;
        if (this.settings.key) {
            this.owner.data[this.settings.key] = opposite ? opposite.oid as any : null;
        }
    }

    protected doUnlink(opposite: C): void {
        this.loaded = true;
        this.oppositeValue = null;
        if (this.settings.key) {
            this.owner.data[this.settings.key] = null;
        }
    }

    protected async load(): Promise<boolean> {
        if (!this.loaded) {
            let referenceId = this.owner.data[this.settings.key] as any;
            if (referenceId == null) {
                this.oppositeValue = null;
            } else {
                let filter = ObjectFilter.forKey<C>(ModelObject.oidProp, referenceId);
                this.oppositeValue = await this.owner.container.objectStore.getOne<C>(filter);
            }
            this.loaded = true;
        }
        return this.loaded;
    }
}

export class HasOne<P extends ModelObject, C extends ModelObject> extends Reference<P, C> {

    public constructor(owner: P, settings: IRelationSettings<P, C>) {
        settings.isSlave = false;
        super(owner, settings);
        this.isComposition = true;
    }

    protected doLink(opposite: C): void {
        this.loaded = true;
        this.oppositeValue = opposite;
        this.owner.data[this.settings.roleProp] = opposite ? opposite.data : null;
    }

    protected doUnlink(opposite: C): void {
        this.loaded = true;
        this.oppositeValue = null;
        this.owner.data[this.settings.roleProp] = null;
    }

    protected async load(): Promise<boolean> {
        if (!this.loaded) {
            let oppositeData: any = this.owner.data[this.settings.roleProp];
            if (oppositeData == null) {
                this.oppositeValue = null;
                this.loaded = true;
            } else {
                let oppositeId = oppositeData[ModelObject.oidProp];
                // check if allready in memory
                let opposite = this.owner.container.objectStore.getInMemById<C>(oppositeId);
                if (opposite == null) { // not in memory
                    opposite = new this.settings.oppositeConstr(oppositeData);
                }
                this.oppositeValue = opposite;
                this.loaded = true;
            }
        }
        return this.loaded;
    }
}

export abstract class ManyBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected items: Array<C>;

    public constructor(owner: P, settings: IRelationSettings<P, C>) {
        super(owner, settings);
        this.isMany = true;

        this.unload();
    }

    public unload(): void {
        this.items = new Array<C>();
        this.loaded = false;
    }

    public async toArray(): Promise<Array<C>> {
        if (!this.loaded) {
            await this.load();
        }
        return this.items.slice(0);
    }

    public abstract load(): Promise<void>;

    public async link(opposite: C): Promise<IRuleExecutionResult[]> {
        if (this.contains(opposite)) {
            return null;
        }
        let oppositeRole = this.getOppositeRole(opposite) as any;
        if (oppositeRole && oppositeRole.key !== this.owner.oid) {
            throw new Error('Opposite is linked to another object');
        }
        return this.internalLink(opposite);
    }

    public async unlink(opposite: C): Promise<IRuleExecutionResult[]> {
        if (!this.contains(opposite)) {
            return null;
        }
        return this.internalUnlink(opposite);
    }

    protected doLink(opposite: C): void {
        if (this.contains(opposite)) {
            return;
        }

        if (this.loaded) {
            this.items.push(opposite);
        }
    }

    protected doUnlink(opposite: C): void {
        if (this.contains(opposite)) {
            return;
        }
        if (this.loaded) {
            let index = this.items.indexOf(opposite);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
        }
    }

    protected contains(opposite: C): boolean {
        if (opposite == null) {
            return false;
        }
        let oppositeRole = this.getOppositeRole(opposite) as Reference<C, P>;
        if (oppositeRole.key === this.owner.oid) {
            return true;
        }
        return false;
    }
}

export class Many<P extends ModelObject, C extends ModelObject> extends ManyBase<P, C> {
    public async load(): Promise<void> {
        if (!this.loaded) {
            let filter = ObjectFilter.forKey<C>(this.settings.oppositeKey, this.owner.oid);
            this.items = await this.owner.container.objectStore.getMany<C>(filter);
            this.loaded = true;
        }
    }
}

export class HasMany<P extends ModelObject, C extends ModelObject> extends ManyBase<P, C> {

    public constructor(owner: P, settings: IRelationSettings<P, C>) {
        super(owner, settings);
        this.isMany = true;
        this.isComposition = true;
    }

    public async load(): Promise<void> {
        if (!this.loaded) {
            let relationData = this.owner.data[this.settings.roleProp] as any[];
            if (!relationData) {
                this.items = [];
            } else {
                for (let item of relationData) {
                    let oppositeId = item.oid;
                    let opposite = this.owner.container.objectStore.getInMemById<C>(oppositeId);
                    if (!opposite) {
                        opposite = new this.settings.oppositeConstr(this.owner.container);
                        opposite.init(item);
                    }
                    this.items.push(opposite);
                }
            }
            this.loaded = true;
        }
    }

    protected doLink(opposite: C): void {
        super.doLink(opposite);
        let relationData = this.owner.data[this.settings.roleProp] as any[];
        if (!relationData) {
            this.owner.data[this.settings.roleProp] = [opposite.data];
        } else {
            relationData.push(opposite.data);
        }
    }

    protected doUnlink(opposite: C): void {
        super.doUnlink(opposite);
        let relationData = this.owner.data[this.settings.roleProp] as any[];
        if (relationData) {
            let index = relationData.indexOf(opposite);
            if (index >= 0) {
                relationData.splice(index, 1);
            }
        }
    }
}
