import { Container } from '../container';
import { ModelObject } from '../model-object';
import { HasOne, IRelationSettings, Reference } from '../relation';
/*
export class ManyBase<P extends ModelObject, C extends ModelObject> {
    public items: Array<C>;

    protected owner: any;
    protected settings: IManySettings<P, C>;

    constructor(owner: P, settings: IManySettings<P, C>) {
        this.owner = owner;
        this.settings = settings;
    }

    public Add(opposite: C) {
        opposite[this.settings.fk] = this.owner.id;
        this.items.push(opposite);
    }
}
export class HasMany<P extends Base, C extends Base> extends ManyBase<P, C> {
    public items: Array<C>;

    private get dataArray(): any[] {
        return this.owner.dataObject[this.settings.prop] as any[];
    }

    constructor(owner: P, settings: IManySettings<P, C>) {
        super(owner, settings);
        this.Load();
    }

    public Add(opposite: C) {
        opposite[this.settings.fk] = this.owner.id;
        this.items.push(opposite);
        this.owner.dataObject[this.settings.prop].push(opposite.dataObject);
    }

    public Load(): void {
        this.items = new Array<C>();
        let dataArray = this.dataArray;
        if (dataArray) {
            for (let data of dataArray) {
                let opposite = new this.settings.constr(data);
                this.items.push(opposite);
            }
        }
    }
}

*/
export class A extends ModelObject {

    public readonly c: HasOne<A, C>;

    public readonly refB: Reference<A, B>;

    public get idB(): string {
        return this.data.idB;
    }

    constructor(container: Container) {
        super(container);
        this.refB = new Reference<A, B>(this,
            {
                key: 'idB',
                roleProp: 'refB',
            } as IRelationSettings<A, B>);
        this.c = new HasOne<A, C>(this,
            {
                oppositeConstr: C,
                oppositeKey: 'idA',
                oppositeRoleProp: 'a',
                roleProp: 'c',
            } as IRelationSettings<A, C>);

    }
}

export class B extends ModelObject {
    public constructor(container: Container) {
        super(container);
    }
}

export class C extends ModelObject {

    public readonly a: Reference<C, A>;

    public get idA(): string {
        return this.data.idA;
    }

    public constructor(container: Container) {
        super(container);
        this.a = new Reference<C, A>(this,
            {
                isSlave: true,
                key: 'idA',
                oppositeRoleProp: 'c',
                roleProp: 'a',
            } as IRelationSettings<C, A>);
    }
}
