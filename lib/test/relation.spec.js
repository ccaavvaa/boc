"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const container_1 = require("../container");
const model_metadata_1 = require("../model-metadata");
const relation_sample_1 = require("./relation.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('Reference A=>B', () => {
    let objectStore = {};
    let container;
    before(() => {
        let metadata = new model_metadata_1.ModelMetadata();
        metadata.registerClass(relation_sample_1.A);
        metadata.registerClass(relation_sample_1.B);
        metadata.registerClass(relation_sample_1.C);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: objectStore,
        };
        container = new container_1.Container(containerSettings);
    });
    it('Composition loading', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            a.init({
                c: {
                    idA: 'a1',
                    oid: 'c1',
                },
                oid: 'a1',
            });
            let c = new relation_sample_1.C(container);
            c.init({
                idA: 'a1',
                oid: 'c1',
            });
            objectStore.getInMemById = (oid) => {
                switch (oid) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };
            objectStore.getOne = (filter) => __awaiter(this, void 0, void 0, function* () {
                let oid = filter.oid;
                return objectStore.getInMemById(oid);
            });
            let a2 = yield c.a.getOpposite();
            expect(a2).deep.equal(a);
            a2 = null;
            a.c.unload();
            let c2 = yield a.c.getOpposite();
            expect(c2).deep.equal(c);
            return true;
        });
        return test();
    });
});
//# sourceMappingURL=relation.spec.js.map