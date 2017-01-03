"use strict";
const model_object_1 = require("../model-object");
const relation_1 = require("../relation");
const relation_sample_1 = require("./relation.sample");
class C extends model_object_1.ModelObject {
    get idA() {
        return this.data.idA;
    }
    constructor(container) {
        super(container);
        this.a = new relation_1.Reference(this, {
            isSlave: true,
            key: 'idA',
            oppositeConstr: relation_sample_1.A,
            oppositeRoleProp: 'c',
            roleProp: 'a',
        });
    }
}
exports.C = C;
//# sourceMappingURL=relation.1.sample.js.map