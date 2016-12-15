export declare class Base {
    id: string;
    dataObject: any;
    constructor(data?: any);
}
export declare class HasManySettings<P extends Base, C extends Base> {
    readonly fk: keyof C;
    readonly prop: keyof P;
    readonly constr: {
        new (data?: any): C;
    };
    constructor(fk: keyof C, constr: {
        new (data?: any): C;
    }, prop: keyof P);
}
export declare class HasMany<P extends Base, C extends Base> {
    items: Array<C>;
    private settings;
    private owner;
    private readonly dataArray;
    constructor(owner: P, settings: HasManySettings<P, C>);
    Add(opposite: C): void;
    Load(): void;
}
export declare class A extends Base {
    private flistB;
    id: string;
    readonly listB: HasMany<A, B>;
    constructor(data?: any);
}
export declare class B extends Base {
    idA: string;
    constructor(data?: any);
}
