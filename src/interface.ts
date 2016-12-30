import { ModelMetadata } from './model-metadata';
import { ClassInfo } from './model-metadata';
import { IdType, ModelObject } from './model-object';

export interface IObjectStore {
    getInMemById<C extends ModelObject>(constr: any, id: IdType): C;
    getOne<C extends ModelObject>(constr: any, filter: any): Promise<C>;
    getMany<C extends ModelObject>(constr: any, filter: any): Promise<Array<C>>;
    getNewId(classInfo: ClassInfo): Promise<IdType>;
    store<C extends ModelObject>(o: C): void;
}

export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
