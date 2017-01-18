import { IContainerSettings } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';
import { ModelObject, ModelObjectConstructor } from './model-object';
import { IdType } from 'boc-interfaces';
export declare class Container {
    readonly messageRouter: MessageRouter;
    readonly modelMetadata: ModelMetadata;
    private objectStore;
    private objects;
    constructor(settings: IContainerSettings);
    clear(): void;
    getInMemById<C extends ModelObject>(constr: any, id: IdType): C;
    getOneInMem<C extends ModelObject>(constr: any, filter: any): C;
    getOne<C extends ModelObject>(constr: any, filter: any): Promise<C>;
    getMany<C extends ModelObject>(constr: any, filter: any): Promise<Array<C>>;
    createNew<T extends ModelObject>(constr: ModelObjectConstructor<T>): Promise<T>;
    getObject<T extends ModelObject>(constr: ModelObjectConstructor<T>, data: any): Promise<T>;
    store(o: ModelObject): void;
    private getInMem<T>(constr, filter, firstOnly);
    private load<T>(constr, data);
}
