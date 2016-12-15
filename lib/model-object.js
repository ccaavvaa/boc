"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const message_1 = require("./message");
class ModelObject {
    constructor(container) {
        this.container = container;
    }
    get oid() {
        return this.data.id;
    }
    init(data) {
        this.data = data;
    }
    initNew(oid) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.oid = oid;
            let message = new message_1.Message(message_1.MessageType.ObjectInit, this);
            let propagationOK = yield this.container.messageRouter.sendMessage(message);
            return propagationOK;
        });
    }
    getProp(propName) {
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }
    setProp(propName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldValue = this.data[propName];
            this.data[propName] = value;
            let message = new message_1.Message(message_1.MessageType.PropChanged, this, {
                oldValue: oldValue,
                propName: propName,
            });
            let propagationOK = yield this.container.messageRouter.sendMessage(message);
            return propagationOK;
        });
    }
}
exports.ModelObject = ModelObject;
//# sourceMappingURL=model-object.js.map