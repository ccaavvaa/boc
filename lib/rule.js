"use strict";
(function (MessageType) {
    MessageType[MessageType["Unknown"] = 0] = "Unknown";
    MessageType[MessageType["ObjectInit"] = 1] = "ObjectInit";
    MessageType[MessageType["PropChanged"] = 2] = "PropChanged";
    MessageType[MessageType["Saving"] = 32] = "Saving";
    MessageType[MessageType["Saved"] = 64] = "Saved";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
;
class RuleDeclaration {
}
exports.RuleDeclaration = RuleDeclaration;
exports.ruleDeclarations = [];
//# sourceMappingURL=rule.js.map