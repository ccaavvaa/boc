import { BocTools } from '../boc-tools';
import { Container } from '../container';
import { ClassInfo, ModelMetadata } from '../model-metadata';
import { IdType, ModelObject } from '../model-object';
import { A, B, C, D, E } from './relation.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;
// const assert = chai.assert;
describe('Reference A=>B', () => {
    let objectStore: any = {
        getNewId: (classInfo: ClassInfo) => {
            ++this.id;
            return Promise.resolve<IdType>(classInfo.constr.name + this.id);
        },
        id: 0,
    };
    let container: Container;
    before(() => {
        let metadata: ModelMetadata = new ModelMetadata();
        metadata.registerClasses(A, B, C, D, E);
        let containerSettings = {
            modelMetadata: metadata,
            objectStore: objectStore,
        };
        container = new Container(containerSettings);
    });

    it('add reference with link', () => {
        let test = async (): Promise<void> => {
            let a = container.createNew<A>(A);
            let b = container.createNew<A>(A);
            await b.initNew('b1');
            let linkResult = await a.refB.link(b);

            expect(BocTools.hasThrownError(linkResult)).to.be.false;
            expect(a.idB).to.equal('b1');
            let reference = await a.refB.getOpposite();
            expect(reference === b).to.be.true;
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
    });
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

    it('HasMany', () => {
        let test = async (): Promise<boolean> => {
            let d1 = new D(container);
            await d1.initNew('d1');
            let e1 = new E(container);
            await e1.initNew('e1');

            objectStore.getInMemById = (oid: string) => {
                switch (oid) {
                    case 'd1': return d1;
                    case 'e1': return e1;
                    case 'd2':
                    default: return null;
                }
            };
            objectStore.getOne = async (filter: any): Promise<ModelObject> => {
                let oid: string = filter.oid;
                return objectStore.getInMemById(oid);
            };
            await e1.d.link(d1);
            expect(e1.idD).equals(d1.oid);
            let x = await e1.d.getOpposite();
            expect(x).deep.equal(d1);

            return true;
        };
        return test();
    });
});
