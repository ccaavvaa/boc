import { IObjectStore } from '../interface';
import { IdType } from '../model-object';
import { ObjectFilter } from '../object-filter';
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
    public async getOne(collectionKey: string, filter: any): Promise<any> {
        let collection: any[] = data[collectionKey];
        return ObjectFilter.first(filter, collection);
    }

    public async getMany(collectionKey: any, filter: any): Promise<any[]> {
        let collection: any[] = data[collectionKey];
        return ObjectFilter.filter(filter, collection);
    }

    public async getNewId(collectionKey: any): Promise<IdType> {
        return collectionKey + ObjectStore.nextId++;
    }
}
