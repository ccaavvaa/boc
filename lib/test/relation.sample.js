"use strict";
const model_object_1 = require("../model-object");
const relation_1 = require("../relation");
class A extends model_object_1.ModelObject {
    static defineRoles() {
        return [
            {
                constr: relation_1.HasOne,
                settings: {
                    oppositeConstr: C,
                    oppositeKey: 'idA',
                    oppositeRoleProp: 'a',
                    roleProp: 'c',
                },
            },
            {
                constr: relation_1.Reference,
                settings: {
                    key: 'idB',
                    oppositeConstr: B,
                    roleProp: 'refB',
                },
            },
        ];
    }
    get idB() {
        return this.data.idB;
    }
    constructor(container) {
        super(container);
    }
    c(value) {
        return this.roleProp('c', value);
    }
    refB(value) {
        return this.roleProp('refB', value);
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
            oppositeConstr: A,
            oppositeRoleProp: 'c',
            roleProp: 'a',
        });
    }
}
exports.C = C;
class D extends model_object_1.ModelObject {
    constructor(container) {
        super(container);
        this.listE = new relation_1.HasMany(this, {
            isSlave: false,
            oppositeConstr: E,
            oppositeRoleProp: 'd',
            roleProp: 'listE',
        });
    }
}
exports.D = D;
class E extends model_object_1.ModelObject {
    get idD() {
        return this.data.idD;
    }
    constructor(container) {
        super(container);
        this.d = new relation_1.Reference(this, {
            isSlave: true,
            key: 'idD',
            oppositeConstr: D,
            oppositeRoleProp: 'listE',
            roleProp: 'd',
        });
    }
}
exports.E = E;
//# sourceMappingURL=relation.sample.js.map