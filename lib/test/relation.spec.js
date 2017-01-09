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
const test_data_sample_1 = require("./test-data.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('Relations', () => {
    let container;
    before(() => {
        let metadata = new model_metadata_1.ModelMetadata();
        metadata.registerClasses(relation_sample_1.A, relation_sample_1.B, relation_sample_1.C, relation_sample_1.D, relation_sample_1.E);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: new test_data_sample_1.ObjectStore(),
        };
        container = new container_1.Container(containerSettings);
    });
    it('add reference with link', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let a = yield container.createNew(relation_sample_1.A);
            let b = yield container.createNew(relation_sample_1.B);
            yield a.set_refB(b);
            expect(a.idB).to.equal(b.oid);
            let reference = yield a.refB();
            expect(reference === b).to.be.true;
        });
        return test();
    });
    it('load reference', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let a = yield container.getOne(relation_sample_1.A, { oid: 'A1' });
            let reference = yield a.refB();
            let b = yield container.getOne(relation_sample_1.B, { oid: 'B1' });
            expect(reference === b).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition A => C', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let a = yield container.createNew(relation_sample_1.A);
            let c = yield container.createNew(relation_sample_1.C);
            yield a.set_c(c);
            let oc = yield a.c();
            expect(oc === c).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c.data).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition C => A', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let a = yield container.createNew(relation_sample_1.A);
            let c = yield container.createNew(relation_sample_1.C);
            yield c.a.link(a);
            let oc = yield a.c();
            expect(oc === c).to.true;
            expect(oc.idA).equals(a.oid);
            expect(a.data.c === c.data).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition C1,2 => A', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let a = yield container.createNew(relation_sample_1.A);
            let c1 = yield container.createNew(relation_sample_1.C);
            let c2 = yield container.createNew(relation_sample_1.C);
            yield a.set_c(c1);
            let e = null;
            try {
                yield a.set_c(c2);
            }
            catch (ex) {
                e = ex;
            }
            expect(e).to.be.not.null;
            let oc = yield a.c();
            expect(oc === c1).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c1.data).to.be.true;
            return true;
        });
        return test();
    });
    it('Composition loading', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let a = yield container.getOne(relation_sample_1.A, { oid: 'A1' });
            let c = yield a.c();
            let a2 = yield c.a.getOpposite();
            expect(a2).deep.equal(a);
            a2 = null;
            a.roles.c.unload();
            let c2 = yield a.c();
            expect(c2).deep.equal(c);
            return true;
        });
        return test();
    });
    it('HasMany', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let d1 = yield container.createNew(relation_sample_1.D);
            let e1 = yield container.createNew(relation_sample_1.E);
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