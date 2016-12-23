import { Container } from '../container';
import { ModelMetadata } from '../model-metadata';
import { ModelObject } from '../model-object';
import { A, B, C } from './relation.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;
// const assert = chai.assert;
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
                expect(oc.idA).equals(a.oid);
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
                } catch (ex) {
                    e = ex;
                }
                expect(e).to.be.not.null;
                let oc = await a.c.getOpposite();
                expect(oc === c1).to.true;
                expect(oc.idA).to.be.equal(a.oid);
                expect(a.data.c === c1.data).to.be.true;
                return true;
            };
            return test();
        });*/
    it('Composition loading', () => {
        let test = async (): Promise<boolean> => {
            let a = new A(container);
            a.init(
                {
                    c: {
                        idA: 'a1',
                        oid: 'c1',
                    },
                    oid: 'a1',
                });
            let c = new C(container);
            c.init(
                {
                    idA: 'a1',
                    oid: 'c1',
                });
            objectStore.getInMemById = (oid: string) => {
                switch (oid) {
                    case 'a1': return a;
                    case 'c1': return c;
                    default: return null;
                }
            };
            objectStore.getOne = async (filter: any): Promise<ModelObject> => {
                let oid: string = filter.oid;
                return objectStore.getInMemById(oid);
            };

            let a2 = await c.a.getOpposite();
            expect(a2).deep.equal(a);
            a2 = null;
            a.c.unload();
            let c2 = await a.c.getOpposite();
            expect(c2).deep.equal(c);
            return true;
        };
        return test();
    });
});
