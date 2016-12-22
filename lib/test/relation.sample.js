"use strict";
const model_object_1 = require("../model-object");
const relation_1 = require("../relation");
class A extends model_object_1.ModelObject {
    get idB() {
        return this.data.idB;
    }
    constructor(container) {
        super(container);
        this.refB = new relation_1.Reference(this, {
            key: 'idB',
            roleProp: 'refB',
        });
        this.c = new relation_1.HasOne(this, {
            oppositeConstr: C,
            oppositeKey: 'idA',
            oppositeRoleProp: 'a',
            roleProp: 'c',
        });
    }
}
exports.A = A;
class B extends model_object_1.ModelObject {
    constructor(container) {
        super(container);
    }
}
exports.B = B;
class C extends model_object_1.ModelObject {
    get idA() {
        return this.data.idA;
    }
    constructor(container) {
        super(container);
        this.a = new relation_1.Reference(this, {
            isSlave: true,
            key: 'idA',
            oppositeRoleProp: 'c',
            roleProp: 'a',
        });
    }
}
exports.C = C;
//# sourceMappingURL=relation.sample.js.map