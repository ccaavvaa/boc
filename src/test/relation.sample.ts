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

export class HasManySettings<P extends Base, C extends Base> {
    public readonly fk: keyof C;
    public readonly prop: keyof P;
    public readonly constr: { new (data?: any): C };

    public constructor(fk: keyof C, constr: { new (data?: any): C }, prop: keyof P) {
        this.fk = fk;
        this.prop = prop;
        this.constr = constr;
    }
}

export class HasMany<P extends Base, C extends Base>{
    public items: Array<C>;

    private settings: HasManySettings<P, C>;
    private owner: any;

    private get dataArray(): any[] {
        return this.owner.dataObject[this.settings.prop] as any[];
    }

    constructor(owner: P, settings: HasManySettings<P, C>) {
        this.owner = owner;
        this.settings = settings;
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
    private flistB: HasMany<A, B>;

    public get id(): string {
        return this.dataObject.id;
    }
    public set id(value: string) {
        this.dataObject.id = value;
    }
    public get listB(): HasMany<A, B> {
        return this.flistB;
    }

    constructor(data: any = {}) {
        super(data);
        if (!this.dataObject.listB) {
            this.dataObject.listB = [];
        }
        this.flistB = new HasMany(this, new HasManySettings<A, B>("idA", B, "listB"));
    }
}

export class B extends Base {
    public idA: string;

    constructor(data: any = {}) {
        super(data);
    }
}
