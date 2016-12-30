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
        metadata.registerClasses(relation_sample_1.A, relation_sample_1.B, relation_sample_1.C, relation_sample_1.D, relation_sample_1.E);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: objectStore,
        };
        container = new container_1.Container(containerSettings);
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