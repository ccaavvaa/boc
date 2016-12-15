export declare class Base {
    id: string;
    dataObject: any;
    constructor(data?: any);
}
export interface IManySettings<P extends Base, C extends Base> {
    fk: keyof C;
    prop: keyof P;
    constr?: {
        new (data?: any): C;
    };
}
export declare class ManyBase<P extends Base, C extends Base> {
    items: Array<C>;
    protected owner: any;
    protected settings: IManySettings<P, C>;
    constructor(owner: P, settings: IManySettings<P, C>);
    Add(opposite: C): void;
}
export declare class HasMany<P extends Base, C extends Base> extends ManyBase<P, C> {
    items: Array<C>;
    private readonly dataArray;
    constructor(owner: P, settings: IManySettings<P, C>);
    Add(opposite: C): void;
    Load(): void;
}
export declare class A extends Base {
    private listBField;
    id: string;
    readonly listB: HasMany<A, B>;
    constructor(data?: any);
}
export declare class B extends Base {
    idA: string;
    constructor(data?: any);
}
