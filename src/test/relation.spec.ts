// import { BocTools } from '../boc-tools';
import { Container } from '../container';
import { ModelMetadata } from '../model-metadata';
import { A, B, C, D, E } from './relation.sample';
import { ObjectStore } from './test-data.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;
// const assert = chai.assert;
describe('Relations', () => {
    let container: Container;
    before(() => {
        let metadata: ModelMetadata = new ModelMetadata();
        metadata.registerClasses(A, B, C, D, E);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: new ObjectStore(),
        };
        container = new Container(containerSettings);
    });

    it('add reference with link', () => {
        let test = async (): Promise<void> => {
            container.clear();
            let a = await container.createNew<A>(A);
            let b = await container.createNew<B>(B);
            await a.refB(b);

            expect(a.idB).to.equal(b.oid);
            let reference = await a.refB();
            expect(reference === b).to.be.true;
        };
        return test();
    });

    it('load reference', () => {
        let test = async (): Promise<boolean> => {
            container.clear();
            let a = await container.getOne<A>(A, { oid: 'A1' });
            let reference = await a.refB();

            let b = await container.getOne<B>(B, { oid: 'B1' });
            expect(reference === b).to.be.true;
            return true;
        };
        return test();
    });

    it('Composition A => C', () => {
        let test = async (): Promise<boolean> => {
            container.clear();
            let a = await container.createNew<A>(A);
            let c = await container.createNew<C>(C);

            await a.c(c);

            let oc = await a.c();
            expect(oc === c).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c.data).to.be.true;
            return true;
        };
        return test();
    });

    it('Composition C => A', () => {
        let test = async (): Promise<boolean> => {
            container.clear();
            let a = await container.createNew<A>(A);
            let c = await container.createNew<C>(C);

            await c.a.link(a);

            let oc = await a.c();
            expect(oc === c).to.true;
            expect(oc.idA).equals(a.oid);
            expect(a.data.c === c.data).to.be.true;

            return true;
        };
        return test();
    });
    it('Composition C1,2 => A', () => {
        let test = async (): Promise<boolean> => {
            container.clear();
            let a = await container.createNew<A>(A);
            let c1 = await container.createNew<C>(C);
            let c2 = await container.createNew<C>(C);

            await a.c(c1);
            let e = null;
            try {
                await a.c(c2);
            } catch (ex) {
                e = ex;
            }
            expect(e).to.be.not.null;
            let oc = await a.c();
            expect(oc === c1).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c1.data).to.be.true;
            return true;
        };
        return test();
    });

    it('Composition loading', () => {
        let test = async (): Promise<boolean> => {
            let a = await container.getOne<A>(A, { oid: 'A1' });
            let c = await a.c();

            let a2 = await c.a.getOpposite();
            expect(a2).deep.equal(a);
            a2 = null;
            a.roles.c.unload();
            let c2 = await a.c();
            expect(c2).deep.equal(c);
            return true;
        };
        return test();
    });

    it('HasMany', () => {
        let test = async (): Promise<boolean> => {
            let d1 = await container.createNew<D>(D);
            let e1 = await container.createNew<E>(E);
            await e1.d.link(d1);
            expect(e1.idD).equals(d1.oid);
            let x = await e1.d.getOpposite();
            expect(x).deep.equal(d1);
            return true;
        };
        return test();
    });
});
