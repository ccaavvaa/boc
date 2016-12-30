import { IContainerSettings, IObjectStore } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';
import { ModelObject, ModelObjectConstructor } from './model-object';
export declare class Container {
    readonly messageRouter: MessageRouter;
    readonly objectStore: IObjectStore;
    readonly modelMetadata: ModelMetadata;
    constructor(settings: IContainerSettings);
    createNew<T extends ModelObject>(constr: ModelObjectConstructor<T>): Promise<T>;
    load<T extends ModelObject>(constr: ModelObjectConstructor<T>, data: any): Promise<T>;
}
