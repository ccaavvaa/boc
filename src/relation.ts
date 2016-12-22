// import { Container } from './container';
import { Message, MessageType } from './message';
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

    protected owner: P;

    protected constructor(owner: P, settings: IRelationSettings<P, C>) {
        this.settings = settings;
        this.owner = owner;
    }

    public getOppositeRole(opposite: C): Relation<C, P> {
        if (opposite) {
            let role = opposite[this.settings.oppositeRoleProp] as any;
            return role as Relation<C, P>;
        }
        return null;
    }

    protected abstract async notifyLink(opposite: C): Promise<boolean>;

    protected abstract async notifyUnlink(opposite: C): Promise<boolean>;

    protected abstract doLink(opposite: C): void;

    protected abstract doUnlink(opposite: C): void;
}

export abstract class OneBase<P extends ModelObject, C extends ModelObject> extends Relation<P, C> {
    protected oppositeValue: C;

    protected loaded: boolean;

    public constructor(owner: P, settings: IRelationSettings<P, C>) {
        super(owner, settings);
    }

    public async getOpposite(): Promise<C> {
        if (!this.oppositeValue) {
            await this.load();
        }

        return this.oppositeValue;
    }

    public async link(opposite: C): Promise<boolean> {
        let currentOpposite = this.loaded ? this.oppositeValue : await this.getOpposite();
        if (currentOpposite === opposite) {
            return true;
        }
        if (currentOpposite) {
            throw new Error('Opposite is allready set');
        }
        return this.internalLink(opposite);
    }

    public async unlink(): Promise<boolean> {
        let opposite = this.loaded ? this.oppositeValue : await this.getOpposite();
        let oppositeRole = this.getOppositeRole(opposite);
        if (opposite) {
            this.doUnlink(opposite);
            if (oppositeRole) {
                (oppositeRole as any).doUnlink(this.owner);
            }
        }

        let notify = async (): Promise<boolean> => {
            return this.notifyUnlink(opposite);
        };

        let oppositeNotify = async (): Promise<boolean> => {
            if (oppositeRole) {
                return (oppositeRole as any).notifyUnlink(this.owner);
            } else {
                return true;
            }
        };

        let notifications: (() => Promise<boolean>)[] = this.settings.isSlave ?
            [oppositeNotify, notify] :
            [notify, oppositeNotify];

        let result = true;
        for (let notification of notifications) {
            result = result && await notification();
        }
        return result;
    }

    protected abstract load(): Promise<boolean>;

    protected async internalLink(opposite: C): Promise<boolean> {
        this.doLink(opposite);
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole) {
            (oppositeRole as any).doLink(this.owner);
        }

        let oppositeNotify = async (): Promise<boolean> => {
            if (oppositeRole) {
                return (oppositeRole as any).notifyLink(this.owner);
            } else {
                return true;
            }
        };
        let notify = async (): Promise<boolean> => {
            return this.notifyLink(opposite);
        };

        let notifications: (() => Promise<boolean>)[] = this.settings.isSlave ?
            [oppositeNotify, notify] :
            [notify, oppositeNotify];

        let result = true;
        for (let notification of notifications) {
            result = result && await notification();
        }
        return result;
    }
}

export class Reference<P extends ModelObject, C extends ModelObject> extends OneBase<P, C> {
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

    protected async notifyUnlink(opposite: C): Promise<boolean> {
        let message = new Message(
            MessageType.Unlink,
            this.owner,
            {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
        let propagationOK = await this.owner.container.messageRouter.sendMessage(message);
        return propagationOK;
    }

    protected async notifyLink(opposite: C): Promise<boolean> {
        let message = new Message(
            MessageType.Link,
            this.owner,
            {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
        let propagationOK = await this.owner.container.messageRouter.sendMessage(message);
        return propagationOK;
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
    protected doLink(opposite: C): void {
        this.loaded = true;
        this.oppositeValue = opposite;
        if (opposite) {
            this.owner.data[this.settings.roleProp] = opposite.data;
        }
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
