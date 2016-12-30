"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const message_router_1 = require("./message-router");
class Container {
    constructor(settings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new message_router_1.MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
    }
    createNew(constr) {
        return __awaiter(this, void 0, void 0, function* () {
            let classInfo = this.modelMetadata.getClassInfo(constr);
            let id = yield this.objectStore.getNewId(classInfo);
            let o = new constr(this);
            yield o.initNew(id);
            return o;
        });
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