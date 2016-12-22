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
const assert = chai.assert;
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
    it('Composition A => C', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            a.initNew('a1');
            let c = new relation_sample_1.C(container);
            c.initNew('c1');
            objectStore.getInMemById = (id) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };
            yield a.c.link(c);
            let oc = yield a.c.getOpposite();
            expect(oc === c).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c.data).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition C => A', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            a.initNew('a1');
            let c = new relation_sample_1.C(container);
            c.initNew('c1');
            objectStore.getInMemById = (id) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };
            yield c.a.link(a);
            let oc = yield a.c.getOpposite();
            expect(oc === c).to.true;
            assert.deepEqual(oc.idA, oc.idA, 'xxxxxxxxx');
            expect(oc.idA).equals(a.oid + '3');
            expect(a.data.c === c.data).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition C1,2 => A', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            a.initNew('a1');
            let c1 = new relation_sample_1.C(container);
            c1.initNew('c1');
            let c2 = new relation_sample_1.C(container);
            c2.initNew('c2');
            objectStore.getInMemById = (id) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c1;
                    case 'c2': return c2;
                    default: return null;
                }
            };
            yield a.c.link(c1);
            let e = null;
            try {
                yield a.c.link(c2);
                expect(1).to.be.equal(0);
            }
            catch (ex) {
                e = ex;
            }
            let oc = yield a.c.getOpposite();
            expect(oc === c1).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c1.data).to.be.true;
            return true;
        });
        return test();
    });
});
//# sourceMappingURL=relation.spec.js.map