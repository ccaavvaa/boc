"use strict";
const _ = require("lodash");
(function (MessageType) {
    MessageType[MessageType["Unknown"] = 0] = "Unknown";
    MessageType[MessageType["ObjectInit"] = 1] = "ObjectInit";
    MessageType[MessageType["PropChanged"] = 2] = "PropChanged";
    MessageType[MessageType["Saving"] = 32] = "Saving";
    MessageType[MessageType["Saved"] = 64] = "Saved";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
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
    constructor(kind, constr, target, body) {
        this.kind = kind;
        this.constr = constr;
        this.target = target;
        this.body = body;
    }
    match(trigger) {
        return _.isMatch(this, trigger);
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map