import { ObjectFilter } from '../object-filter';
import { IObjectStore, IdType  } from 'boc-interfaces';

import * as _ from 'lodash';

let data: any = {
    'A': [
        {
            c: {
                idA: 'A1',
                oid: 'C1',
            },
            idB: 'B1',
            oid: 'A1',
        },
    ],
    'B': [
        { oid: 'B1' },
    ],
    'Vente': [
        {
            clients: [
                {
                    codeTiers: 'tiers1',
                    idVente: 'V1',
                    oid: 'C1',
                },
                {
                    codeTiers: 'tiers2',
                    idVente: 'V1',
                    oid: 'C2',
                },
            ],
            oid: 'V1',
            statut: 0,
        },
    ],
};

export class ObjectStore implements IObjectStore {
    private static nextId: number = 100;

    private data: any;

    constructor() {
        this.reset();
    }

    public async getOne(collectionKey: string, filter: any): Promise<any> {
        let collection: any[] = this.data[collectionKey];
        return ObjectFilter.first(filter, collection);
    }

    public async getMany(collectionKey: any, filter: any): Promise<any[]> {
        let collection: any[] = this.data[collectionKey];
        return ObjectFilter.filter(filter, collection);
    }

    public async getNewId(collectionKey: any): Promise<IdType> {
        return collectionKey + ObjectStore.nextId++;
    }

    public reset(): void {
        this.data = _.cloneDeep(data);
    }
}
