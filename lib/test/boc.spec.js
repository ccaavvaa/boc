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
const type_1 = require("../type");
const type_adapter_1 = require("../type-adapter");
const boc_sample_1 = require("./boc.sample");
const test_data_sample_1 = require("./test-data.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('Vente', () => {
    let container;
    before(() => {
        let metadata = new model_metadata_1.ModelMetadata();
        metadata.registerTypeSettings('money', { constr: type_1.SimpleValue, adapter: type_adapter_1.DecimalAdapter, decimals: 2 });
        metadata.registerTypeSettings('positive', { min: 0 });
        metadata.registerClasses(boc_sample_1.ClientVente, boc_sample_1.Vente);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: new test_data_sample_1.ObjectStore(),
        };
        container = new container_1.Container(containerSettings);
    });
    it('has correct type for "prix"', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let vente = yield container.createNew(boc_sample_1.Vente);
            yield vente.set_prix(123.456);
            let prix = vente.prix;
            expect(prix).to.be.equal(123.46);
        });
        return test();
    });
    it('load vente', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let vente = yield container.getOne(boc_sample_1.Vente, { oid: 'V1' });
            let clients = yield vente.clients.toArray();
            expect(clients.length).to.be.equal(2);
        });
        return test();
    });
    it('change statut', () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            container.clear();
            let vente = yield container.getOne(boc_sample_1.Vente, { oid: 'V1' });
            let rulesResult = yield vente.set_statut(boc_sample_1.StatutVente.Accord);
            expect(boc_tools_1.BocTools.hasThrownError(rulesResult)).to.be.false;
            expect(vente.dateAccord.toJSON()).equals(boc_tools_1.BocTools.today().toJSON());
        });
        return test();
    });
});
//# sourceMappingURL=boc.spec.js.map