import { ModelMetadata } from './model-metadata';
import { ClassInfo } from './model-metadata';
import { IdType, ModelObject } from './model-object';

export interface IObjectStore {
    getInMemById<C extends ModelObject>(id: IdType): C;
    getOne<C extends ModelObject>(filter: any): Promise<C>;
    getMany<C extends ModelObject>(filter: any): Promise<Array<C>>;
    getNewId(classInfo: ClassInfo): Promise<IdType>;
}

export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
