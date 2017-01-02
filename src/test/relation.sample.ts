import { Container } from '../container';
import { ModelObject } from '../model-object';
import { HasMany, HasOne, IRelationSettings, Reference } from '../relation';

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

export class D extends ModelObject {
    public readonly listE: HasMany<D, E>;

    public constructor(container: Container) {
        super(container);
        this.listE = new HasMany<D, E>(this,
            {
                isSlave: false,
                oppositeRoleProp: 'd',
                roleProp: 'listE',
            } as IRelationSettings<D, E>);
    }
}

export class E extends ModelObject {
    public readonly d: Reference<E, D>;
    public get idD(): string {
        return this.data.idD;
    }
    public constructor(container: Container) {
        super(container);
        this.d = new Reference<E, D>(this,
            {
                isSlave: true,
                key: 'idD',
                oppositeRoleProp: 'listE',
                roleProp: 'd',
            } as IRelationSettings<E, D>);
    }
}
