export class Base {
    public get id(): string {
        return this.dataObject.id;
    }
    public set id(value: string) {
        this.dataObject.id = value;
    }
    public dataObject: any;

    constructor(data: any = {}) {
        this.dataObject = data;
    }
}

export interface IManySettings<P extends Base, C extends Base> {
    fk: keyof C;
    prop: keyof P;
    constr?: { new (data?: any): C };
}

export class ManyBase<P extends Base, C extends Base> {
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

export class A extends Base {
    private listBField: HasMany<A, B>;

    public get id(): string {
        return this.dataObject.id;
    }
    public set id(value: string) {
        this.dataObject.id = value;
    }
    public get listB(): HasMany<A, B> {
        return this.listBField;
    }

    constructor(data: any = {}) {
        super(data);
        if (!this.dataObject.listB) {
            this.dataObject.listB = [];
        }
        this.listBField = new HasMany(this,
            {
                constr: B,
                fk: "idA",
                prop: "listB",
            } as IManySettings<A, B>
        );
    }
}

export class B extends Base {
    public idA: string;

    constructor(data: any = {}) {
        super(data);
    }
}
