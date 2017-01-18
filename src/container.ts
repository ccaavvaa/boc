import { IContainerSettings } from './interface';
import { MessageRouter } from './message-router';
import { ModelMetadata } from './model-metadata';
import { ModelObject, ModelObjectConstructor } from './model-object';
import { ObjectFilter } from './object-filter';

import { IObjectStore, IdType } from 'boc-interfaces';

export class Container {
    public readonly messageRouter: MessageRouter;

    public readonly modelMetadata: ModelMetadata;

    private objectStore: IObjectStore;

    private objects: Map<any, Map<IdType, any>>;

    public constructor(settings: IContainerSettings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
        this.clear();
    }

    public clear(): void {
        this.objects = new Map<any, Map<IdType, any>>();
        this.messageRouter.errorsByRule.clear();
        this.objectStore.reset();
    }

    public getInMemById<C extends ModelObject>(constr: any, id: IdType): C {
        let objectsByClass = this.objects.get(constr);
        if (objectsByClass) {
            let o = objectsByClass.get(id);
            return o;
        }
        return null;
    }

    public getOneInMem<C extends ModelObject>(constr: any, filter: any): C {
        let values: Array<C> = this.getInMem<C>(constr, filter, true);
        return values.length > 0 ? values[0] : null;
    }

    public async getOne<C extends ModelObject>(constr: any, filter: any): Promise<C> {
        let o: C = null;
        let oid = filter[ModelObject.oidProp];
        if (oid) {
            o = this.getInMemById<C>(constr, oid);
        } else {
            o = this.getOneInMem<C>(constr, filter);
        }
        if (!o) { // not in memory
            let classInfo = this.modelMetadata.getClassInfo(constr);
            let dataStoreKey = classInfo.dataStoreKey;
            let objectData = await this.objectStore.getOne(dataStoreKey, filter);
            if (objectData) {
                o = await this.load<C>(constr, objectData);
            }
        }
        return o;
    }

    public async getMany<C extends ModelObject>(constr: any, filter: any): Promise<Array<C>> {
        let classInfo = this.modelMetadata.getClassInfo(constr);
        let dataStoreKey = classInfo.dataStoreKey;
        let storeData: any[] = await this.objectStore.getMany(dataStoreKey, filter);
        for (let data of storeData) {
            let oid = data[ModelObject.oidProp];
            let inMem = this.getInMemById(constr, oid);
            if (!inMem) {
                await this.load(constr, data);
            }
        }
        return this.getInMem<C>(constr, filter, false);
    }

    public async createNew<T extends ModelObject>(constr: ModelObjectConstructor<T>): Promise<T> {
        let classInfo = this.modelMetadata.getClassInfo<T>(constr);
        let id = await this.objectStore.getNewId(classInfo.dataStoreKey);
        let o = new constr(this);
        await o.initNew(id);
        return o;
    }

    public async getObject<T extends ModelObject>(constr: ModelObjectConstructor<T>, data: any): Promise<T> {
        let o = await this.getInMemById<T>(constr, data[ModelObject.oidProp]);
        if (!o) {
            o = await this.load<T>(constr, data);
        }
        return o;
    }

    public store(o: ModelObject): void {
        let classObjects = this.objects.get(o.constructor);
        if (!classObjects) {
            classObjects = new Map<IdType, any>();
            this.objects.set(o.constructor, classObjects);
        }
        classObjects.set(o[ModelObject.oidProp], o);
    }

    private getInMem<T extends ModelObject>(constr: any, filter: any, firstOnly: boolean): Array<T> {
        let objectsByClass = this.objects.get(constr);
        if (!objectsByClass) {
            return [];
        }
        let candidates = objectsByClass.values();
        return firstOnly ?
            [ObjectFilter.first<T>(filter, candidates)] :
            ObjectFilter.filter(filter, objectsByClass.values());
    }

    private async load<T extends ModelObject>(constr: ModelObjectConstructor<T>, data: any): Promise<T> {
        let o = new constr(this);
        await o.init(data);
        return o;
    }
}
