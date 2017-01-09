import { BocTools } from '../boc-tools';
import { Container } from '../container';
import { ModelMetadata } from '../model-metadata';
import { SimpleValue } from '../type';
import { DecimalAdapter } from '../type-adapter';
import { ClientVente, StatutVente, Vente } from './boc.sample';
import { ObjectStore } from './test-data.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;
// const assert = chai.assert;
describe('Vente', () => {
    let container: Container;
    before(() => {
        let metadata: ModelMetadata = new ModelMetadata();
        metadata.registerTypeSettings('money', { constr: SimpleValue, adapter: DecimalAdapter, decimals: 2 });
        metadata.registerTypeSettings('positive', { min: 0 });
        metadata.registerClasses(ClientVente, Vente);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: new ObjectStore(),
        };
        container = new Container(containerSettings);
    });

    it('has correct type for "prix"', () => {
        let test = async (): Promise<void> => {
            container.clear();
            let vente = await container.createNew<Vente>(Vente);
            await vente.set_prix(123.456);
            let prix = vente.prix;
            expect(prix).to.be.equal(123.46);
        };
        return test();
    });
    it('load vente', () => {
        let test = async (): Promise<void> => {
            container.clear();
            let vente = await container.getOne<Vente>(Vente, { oid: 'V1' });
            let clients = await vente.clients.toArray();
            expect(clients.length).to.be.equal(2);
        };
        return test();
    });
    it('change statut', () => {
        let test = async (): Promise<void> => {
            container.clear();
            let vente = await container.getOne<Vente>(Vente, { oid: 'V1' });
            let rulesResult = await vente.set_statut(StatutVente.Accord);
            expect(BocTools.hasThrownError(rulesResult)).to.be.false;
            expect(vente.dateAccord.toJSON()).equals(BocTools.today().toJSON());
        };
        return test();
    });
});
