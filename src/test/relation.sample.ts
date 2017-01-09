import { Container } from '../container';
import { IRuleExecutionResult } from '../message';
import { ModelObject } from '../model-object';
import { HasMany, HasOne, IRelationSettings, IRoleDeclaration, Reference } from '../relation';

export class A extends ModelObject {
    public static defineRoles(): Array<IRoleDeclaration> {
        return [
            {
                constr: HasOne,
                settings: {
                    oppositeConstr: C,
                    oppositeKey: 'idA',
                    oppositeRoleProp: 'a',
                    roleProp: 'c',
                } as IRelationSettings<A, C>,
            },
            {
                constr: Reference,
                settings: {
                    key: 'idB',
                    oppositeConstr: B,
                    roleProp: 'refB',
                } as IRelationSettings<A, B>,
            },
        ];
    }

    // public readonly refB: Reference<A, B>;

    public get idB(): string {
        return this.data.idB;
    }

    constructor(container: Container) {
        super(container);
        /*
        this.refB = new Reference<A, B>(this,
            {
                key: 'idB',
                oppositeConstr: B,
                roleProp: 'refB',
            } as IRelationSettings<A, B>);
        this.roles.c = new HasOne<A, C>(this,
            {
                oppositeConstr: C,
                oppositeKey: 'idA',
                oppositeRoleProp: 'a',
                roleProp: 'c',
            } as IRelationSettings<A, C>
        );
        */
    }

    public c(): Promise<C> {
        return this.getRoleProp('c');
    }

    public set_c(value: C): Promise<IRuleExecutionResult[]> {
        return this.setRoleProp('c', value);
    }

    public refB(): Promise<B> {
        return this.getRoleProp('refB');
    }

    public set_refB(value: B): Promise<IRuleExecutionResult[]> {
        return this.setRoleProp('refB', value);
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
                oppositeConstr: A,
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
                oppositeConstr: E,
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
                oppositeConstr: D,
                oppositeRoleProp: 'listE',
                roleProp: 'd',
            } as IRelationSettings<E, D>);
    }
}
