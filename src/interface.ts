import { ModelMetadata } from './model-metadata';
import { IObjectStore } from 'boc-interfaces';

/*
export interface IObjectStore {
    getOne(collectionKey: any, filter: any): Promise<any>;
    getMany(collectionKey: any, filter: any): Promise<any[]>;
    getNewId(collectionKey: any): Promise<IdType>;
    reset(): void;
}
*/
export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
