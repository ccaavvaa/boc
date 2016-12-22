import { IContainerSettings, IObjectStore } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';
export declare class Container {
    readonly messageRouter: MessageRouter;
    readonly objectStore: IObjectStore;
    readonly modelMetadata: ModelMetadata;
    constructor(settings: IContainerSettings);
}
