"use strict";
const message_1 = require("./message");
class ModelObject {
    constructor(acontainer) {
        this.container = acontainer;
    }
    get oid() {
        return this.data.oid;
    }
    init(data, isNew) {
        this.data = data;
        let message = new message_1.Message(message_1.MessageType.ObjectInit, this, {
            isNew: isNew,
        });
        return this.container.messageRouter.sendMessage(message);
    }
    initNew(oid) {
        let data = {};
        data[ModelObject.oidProp] = oid;
        return this.init(data, true);
    }
    sendMessage(message) {
        return this.container.messageRouter.sendMessage(message);
    }
    getProp(propName) {
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }
    setProp(propName, value) {
        let oldValue = this.data[propName];
        this.data[propName] = value;
        let message = new message_1.Message(message_1.MessageType.PropChanged, this, {
            oldValue: oldValue,
            propName: propName,
        });
        return this.sendMessage(message);
    }
}
ModelObject.oidProp = 'oid';
exports.ModelObject = ModelObject;
//# sourceMappingURL=model-object.js.map