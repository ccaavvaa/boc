"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const object_filter_1 = require("../object-filter");
let data = {
    'A': [
        {
            c: {
                idA: 'A1',
                oid: 'C1',
            },
            idB: 'B1',
            oid: 'A1',
        },
    ],
    'B': [
        { oid: 'B1' },
    ],
};
class ObjectStore {
    getOne(collectionKey, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = data[collectionKey];
            return object_filter_1.ObjectFilter.first(filter, collection);
        });
    }
    getMany(collectionKey, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = data[collectionKey];
            return object_filter_1.ObjectFilter.filter(filter, collection);
        });
    }
    getNewId(collectionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return collectionKey + ObjectStore.nextId++;
        });
    }
}
ObjectStore.nextId = 100;
exports.ObjectStore = ObjectStore;
//# sourceMappingURL=test-data.sample.js.map