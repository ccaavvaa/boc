import { ModelMetadata } from './model-metadata';
import { ModelObject } from './model-object';
export interface IObjectStore {
    getInMemById<C extends ModelObject>(id: string): C;
    getOne<C extends ModelObject>(filter: any): C;
}
export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
