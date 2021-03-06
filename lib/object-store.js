"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class ObjectStore {
    constructor(container) {
        this.container = container;
    }
    getOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tempGet) {
                return this.tempGet(filter);
            }
            return Promise.resolve(null);
        });
    }
}
exports.ObjectStore = ObjectStore;
//# sourceMappingURL=object-store.js.map