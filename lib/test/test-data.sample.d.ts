import { IObjectStore } from '../interface';
import { IdType } from '../model-object';
export declare class ObjectStore implements IObjectStore {
    private static nextId;
    getOne(collectionKey: string, filter: any): Promise<any>;
    getMany(collectionKey: any, filter: any): Promise<any[]>;
    getNewId(collectionKey: any): Promise<IdType>;
}
