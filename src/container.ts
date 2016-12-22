import { IContainerSettings, IObjectStore } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';

export class Container {
    public readonly messageRouter: MessageRouter;
    public readonly objectStore: IObjectStore;
    public readonly modelMetadata: ModelMetadata;

    public constructor(settings: IContainerSettings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
    }
}
