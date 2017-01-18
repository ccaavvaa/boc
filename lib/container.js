"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const message_router_1 = require("./message-router");
const model_object_1 = require("./model-object");
const object_filter_1 = require("./object-filter");
class Container {
    constructor(settings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new message_router_1.MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
        this.clear();
    }
    clear() {
        this.objects = new Map();
        this.messageRouter.errorsByRule.clear();
        this.objectStore.reset();
    }
    getInMemById(constr, id) {
        let objectsByClass = this.objects.get(constr);
        if (objectsByClass) {
            let o = objectsByClass.get(id);
            return o;
        }
        return null;
    }
    getOneInMem(constr, filter) {
        let values = this.getInMem(constr, filter, true);
        return values.length > 0 ? values[0] : null;
    }
    getOne(constr, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let o = null;
            let oid = filter[model_object_1.ModelObject.oidProp];
            if (oid) {
                o = this.getInMemById(constr, oid);
            }
            else {
                o = this.getOneInMem(constr, filter);
            }
            if (!o) {
                let classInfo = this.modelMetadata.getClassInfo(constr);
                let dataStoreKey = classInfo.dataStoreKey;
                let objectData = yield this.objectStore.getOne(dataStoreKey, filter);
                if (objectData) {
                    o = yield this.load(constr, objectData);
                }
            }
            return o;
        });
    }
    getMany(constr, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let classInfo = this.modelMetadata.getClassInfo(constr);
            let dataStoreKey = classInfo.dataStoreKey;
            let storeData = yield this.objectStore.getMany(dataStoreKey, filter);
            for (let data of storeData) {
                let oid = data[model_object_1.ModelObject.oidProp];
                let inMem = this.getInMemById(constr, oid);
                if (!inMem) {
                    yield this.load(constr, data);
                }
            }
            return this.getInMem(constr, filter, false);
        });
    }
    createNew(constr) {
        return __awaiter(this, void 0, void 0, function* () {
            let classInfo = this.modelMetadata.getClassInfo(constr);
            let id = yield this.objectStore.getNewId(classInfo.dataStoreKey);
            let o = new constr(this);
            yield o.initNew(id);
            return o;
        });
    }
    getObject(constr, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let o = yield this.getInMemById(constr, data[model_object_1.ModelObject.oidProp]);
            if (!o) {
                o = yield this.load(constr, data);
            }
            return o;
        });
    }
    store(o) {
        let classObjects = this.objects.get(o.constructor);
        if (!classObjects) {
            classObjects = new Map();
            this.objects.set(o.constructor, classObjects);
        }
        classObjects.set(o[model_object_1.ModelObject.oidProp], o);
    }
    getInMem(constr, filter, firstOnly) {
        let objectsByClass = this.objects.get(constr);
        if (!objectsByClass) {
            return [];
        }
        let candidates = objectsByClass.values();
        return firstOnly ?
            [object_filter_1.ObjectFilter.first(filter, candidates)] :
            object_filter_1.ObjectFilter.filter(filter, objectsByClass.values());
    }
    load(constr, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let o = new constr(this);
            yield o.init(data);
            return o;
        });
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map