import { IContainerSettings, IObjectStore } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';
import { ModelObject, ModelObjectConstructor } from './model-object';

export class Container {
    public readonly messageRouter: MessageRouter;
    public readonly objectStore: IObjectStore;
    public readonly modelMetadata: ModelMetadata;

    public constructor(settings: IContainerSettings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
    }

    public async createNew<T extends ModelObject>(constr: ModelObjectConstructor<T>): Promise<T> {
        let classInfo = this.modelMetadata.getClassInfo<T>(constr);
        let id = await this.objectStore.getNewId(classInfo);
        let o = new constr(this);
        await o.initNew(id);
        return o;
    }

    public async load<T extends ModelObject>(constr: ModelObjectConstructor<T>, data: any): Promise<T> {
        let o = new constr(this);
        await o.init(data);
        return o;
    }
}
