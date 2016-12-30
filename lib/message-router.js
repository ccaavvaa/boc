"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _ = require("lodash");
class MessageRouterStackElement {
    constructor(message, ruleDeclaration) {
        this.message = message;
        this.ruleDeclaration = ruleDeclaration;
    }
}
exports.MessageRouterStackElement = MessageRouterStackElement;
class MessageRouter {
    constructor(metadata) {
        this.metadata = metadata;
        this.stack = [];
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let classInfo = this.metadata.classesByConstr.get(message.constr);
            if (!classInfo) {
                throw new Error('Class not registered: ${message.constr.name}');
            }
            let result = null;
            let triggersRules = classInfo.rulesByType.get(message.kind);
            if (!triggersRules) {
                return result;
            }
            let rulesToExecute = triggersRules
                .filter(v => message.match(v.trigger))
                .map(v => v.ruleDeclarations)
                .reduce((p, v) => {
                let n = _.union(p, v);
                return n;
            }, []);
            if (rulesToExecute.length > 0) {
                result = [];
            }
            for (let rule of rulesToExecute) {
                let ruleExecutionResult = yield this.dispatchMessage(message, rule);
                result.push(ruleExecutionResult);
            }
            return result;
        });
    }
    dispatchMessage(message, ruleDeclaration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
            let result = {
                message: message,
                rule: ruleDeclaration,
            };
            try {
                let execResult;
                if (ruleDeclaration.isStatic) {
                    execResult = yield ruleDeclaration.rule(message.target, message);
                }
                else {
                    execResult = yield (ruleDeclaration.rule.call(message.target, message));
                }
                result.result = execResult;
            }
            catch (ex) {
                result.error = ex;
                message.target.addError(ex, ruleDeclaration);
            }
            finally {
                this.stack.pop();
            }
            return result;
        });
    }
}
exports.MessageRouter = MessageRouter;
//# sourceMappingURL=message-router.js.map