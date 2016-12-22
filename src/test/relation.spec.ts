import { Container } from '../container';
import { ModelMetadata } from '../model-metadata';
import { A, B, C } from './relation.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;
const assert = chai.assert;
describe('Reference A=>B', () => {
    let objectStore: any = {};
    let container: Container;
    before(() => {
        let metadata: ModelMetadata = new ModelMetadata();
        metadata.registerClass(A);
        metadata.registerClass(B);
        metadata.registerClass(C);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: objectStore,
        };
        container = new Container(containerSettings);
    });

    /*    it('add reference with link', () => {
            let test = async (): Promise<boolean> => {
                let a = new A(container);
                await a.initNew('a1');
                let b = new B(container);
                await b.initNew('b1');
                let result = await a.refB.link(b);
                expect(result).to.be.true;
                expect(a.idB).to.equal('b1');
                let reference = await a.refB.getOpposite();
                expect(reference === b).to.be.true;
                return result;
            };
            return test();
        });
        it('load reference', () => {
            let test = async (): Promise<boolean> => {
                let a = new A(container);
                await a.init({
                    idB: 'b1',
                    oid: 'a1',
                });
                let b = new B(container);
                await b.initNew('b1');
                objectStore.getOne = (filter: any) => {
                    return Promise.resolve(b);
                };
    
                let reference = await a.refB.getOpposite();
                expect(reference === b).to.be.true;
                return true;
            };
            return test();
        });
    */
    it('Composition A => C', () => {
        let test = async (): Promise<boolean> => {
            let a = new A(container);
            a.initNew('a1');
            let c = new C(container);
            c.initNew('c1');

            objectStore.getInMemById = (id: string) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };

            await a.c.link(c);

            let oc = await a.c.getOpposite();
            expect(oc === c).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c.data).to.be.true;
            return true;
        };
        return test();
    });
    it('Composition C => A', () => {
        let test = async (): Promise<boolean> => {
            let a = new A(container);
            a.initNew('a1');
            let c = new C(container);
            c.initNew('c1');

            objectStore.getInMemById = (id: string) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };

            await c.a.link(a);

            let oc = await a.c.getOpposite();
            expect(oc === c).to.true;
            assert.deepEqual(oc.idA, oc.idA, 'xxxxxxxxx');
            expect(oc.idA).equals(a.oid + '3');
            expect(a.data.c === c.data).to.be.true;

            return true;
        };
        return test();
    });
    it('Composition C1,2 => A', () => {
        let test = async (): Promise<boolean> => {
            let a = new A(container);
            a.initNew('a1');
            let c1 = new C(container);
            c1.initNew('c1');
            let c2 = new C(container);
            c2.initNew('c2');

            objectStore.getInMemById = (id: string) => {
                switch (id) {
                    case 'a1': return a;
                    case 'c1': return c1;
                    case 'c2': return c2;
                    default: return null;
                }
            };

            await a.c.link(c1);
            let e = null;
            try {
                await a.c.link(c2);
                expect(1).to.be.equal(0);
            } catch (ex) {
                e = ex;
            }

            let oc = await a.c.getOpposite();
            expect(oc === c1).to.true;
            expect(oc.idA).to.be.equal(a.oid);
            expect(a.data.c === c1.data).to.be.true;
            return true;
        };
        return test();
    });

});

/*
describe('Composition AB', () => {
    it('added B should exists in A', () => {
        let a: A = new A({
            id: 'A1',
        });

        let b: B = new B({
            id: 'B1',
        });

        a.listB.Add(b);
        expect(a.listB.items.length).to.be.equal(1);
        expect(a.listB.items[0]).to.be.equal(b);
        expect(a.dataObject.listB).to.be.not.null;
        expect(a.dataObject.listB[0].id).to.be.equal('B1');
    });
    it('loaded B should exists in A', () => {
        let a: A = new A({
            id: 'A1',
            listB: [
                {
                    id: 'B1',
                    idA: 'A1',
                },
                {
                    id: 'B2',
                    idA: 'A1',
                },
            ],
        });

        expect(a.listB.items.length).to.be.equal(2);
        expect(a.listB.items[0].id).to.be.equal('B1');
        expect(a.listB.items[1].id).to.be.equal('B2');
        expect(a.dataObject.listB[1].id).to.be.equal('B2');
    });
});
*/
