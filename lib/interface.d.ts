import { ModelMetadata } from './model-metadata';
import { IdType } from './model-object';
export interface IObjectStore {
    getOne(collectionKey: any, filter: any): Promise<any>;
    getMany(collectionKey: any, filter: any): Promise<any[]>;
    getNewId(collectionKey: any): Promise<IdType>;
}
export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
