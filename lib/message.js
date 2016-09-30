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
    constructor(kind, target, body = undefined, constr = undefined) {
        this.kind = kind;
        this.target = target;
        this.body = body;
        this.constr = constr;
        if (constr === undefined) {
            this.constr = target.constructor;
        }
    }
    match(trigger) {
        let m = _.isMatch(this, trigger);
        return m;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map