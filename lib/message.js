"use strict";
const _ = require("lodash");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Unknown"] = 0] = "Unknown";
    MessageType[MessageType["ObjectInit"] = 1] = "ObjectInit";
    MessageType[MessageType["PropChanged"] = 2] = "PropChanged";
    MessageType[MessageType["Link"] = 4] = "Link";
    MessageType[MessageType["Unlink"] = 8] = "Unlink";
    MessageType[MessageType["Saving"] = 16] = "Saving";
    MessageType[MessageType["Saved"] = 32] = "Saved";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
exports.messageTypes = new Set([
    MessageType.ObjectInit,
    MessageType.PropChanged,
    MessageType.Saving,
    MessageType.Saved,
]);
;
class Trigger {
    constructor(source) {
        if (source) {
            _.assign(this, source);
        }
    }
    equals(other) {
        return _.isEqual(this, other);
    }
}
exports.Trigger = Trigger;
class Message {
    constructor(kind, target, body = undefined, data = undefined, constr = undefined) {
        this.kind = kind;
        this.target = target;
        this.body = body;
        this.data = data;
        this.constr = constr;
        if (constr === undefined) {
            this.constr = target.constructor;
        }
    }
    matchTrigger(trigger) {
        let m = _.isMatch(this, trigger);
        return m;
    }
    matchMessage(message) {
        return message.target === this.target
            && message.kind === this.kind
            && _.isEqual(this.body, message.body);
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map