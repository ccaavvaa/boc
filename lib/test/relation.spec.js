"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const boc_tools_1 = require("../boc-tools");
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
        metadata.registerClasses(relation_sample_1.A, relation_sample_1.B, relation_sample_1.C, relation_sample_1.D, relation_sample_1.E);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: objectStore,
        };
        container = new container_1.Container(containerSettings);
    });
    it('add reference with link', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            yield a.initNew('a1');
            let b = new relation_sample_1.B(container);
            yield b.initNew('b1');
            let linkResult = yield a.refB.link(b);
            expect(boc_tools_1.BocTools.hasThrownError(linkResult)).to.be.false;
            expect(a.idB).to.equal('b1');
            let reference = yield a.refB.getOpposite();
            expect(reference === b).to.be.true;
        });
        return test();
    });
    it('load reference', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = new relation_sample_1.A(container);
            yield a.init({
                idB: 'b1',
                oid: 'a1',
            });
            let b = new relation_sample_1.B(container);
            yield b.initNew('b1');
            objectStore.getOne = (filter) => {
                return Promise.resolve(b);
            };
            let reference = yield a.refB.getOpposite();
            expect(reference === b).to.be.true;
            return true;
        });
        return test();
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
            expect(oc.idA).equals(a.oid);
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
            }
            catch (ex) {
                e = ex;
            }
            expect(e).to.be.not.null;
            let oc = yield a.c.getOpposite();
            expect(oc === c1).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c1.data).to.be.true;
            return true;
        });
        return test();
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
    it('HasMany', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let d1 = new relation_sample_1.D(container);
            yield d1.initNew('d1');
            let e1 = new relation_sample_1.E(container);
            yield e1.initNew('e1');
            objectStore.getInMemById = (oid) => {
                switch (oid) {
                    case 'd1': return d1;
                    case 'e1': return e1;
                    case 'd2':
                    default: return null;
                }
            };
            objectStore.getOne = (filter) => __awaiter(this, void 0, void 0, function* () {
                let oid = filter.oid;
                return objectStore.getInMemById(oid);
            });
            yield e1.d.link(d1);
            expect(e1.idD).equals(d1.oid);
            let x = yield e1.d.getOpposite();
            expect(x).deep.equal(d1);
            return true;
        });
        return test();
    });
});
//# sourceMappingURL=relation.spec.js.map