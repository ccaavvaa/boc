"use strict";
class Base {
    get id() {
        return this.dataObject.id;
    }
    set id(value) {
        this.dataObject.id = value;
    }
    constructor(data = {}) {
        this.dataObject = data;
    }
}
exports.Base = Base;
class HasManySettings {
    constructor(fk, constr, prop) {
        this.fk = fk;
        this.prop = prop;
        this.constr = constr;
    }
}
exports.HasManySettings = HasManySettings;
class HasMany {
    constructor(owner, settings) {
        this.owner = owner;
        this.settings = settings;
        this.Load();
    }
    get dataArray() {
        return this.owner.dataObject[this.settings.prop];
    }
    Add(opposite) {
        opposite[this.settings.fk] = this.owner.id;
        this.items.push(opposite);
        this.owner.dataObject[this.settings.prop].push(opposite.dataObject);
    }
    Load() {
        this.items = new Array();
        let dataArray = this.dataArray;
        if (dataArray) {
            for (let data of dataArray) {
                let opposite = new this.settings.constr(data);
                this.items.push(opposite);
            }
        }
    }
}
exports.HasMany = HasMany;
class A extends Base {
    get id() {
        return this.dataObject.id;
    }
    set id(value) {
        this.dataObject.id = value;
    }
    get listB() {
        return this.flistB;
    }
    constructor(data = {}) {
        super(data);
        if (!this.dataObject.listB) {
            this.dataObject.listB = [];
        }
        this.flistB = new HasMany(this, new HasManySettings("idA", B, "listB"));
    }
}
exports.A = A;
class B extends Base {
    constructor(data = {}) {
        super(data);
    }
}
exports.B = B;
//# sourceMappingURL=relation.sample.js.map