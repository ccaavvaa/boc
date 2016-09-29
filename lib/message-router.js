"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
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
            if (classInfo === undefined) {
                throw new Error("Class not registered: ${message.constr.name}");
            }
            let triggersRules = classInfo.rulesByType.get(message.kind);
            if (triggersRules === undefined) {
                return true;
            }
            let rulesToExecute = triggersRules
                .filter(v => message.match(v.trigger))
                .map(v => v.ruleDeclarations)
                .reduce((p, v) => {
                let n = _.union(p, v);
                return n;
            }, []);
            for (let i = 0, len = rulesToExecute.length; i < len; i++) {
                let shouldContinue = yield this.dispatchMessage(message, rulesToExecute[i]);
                if (!shouldContinue) {
                    return false;
                }
            }
            return true;
        });
    }
    dispatchMessage(message, ruleDeclaration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
            let execResult = false;
            try {
                if (ruleDeclaration.isStatic) {
                    execResult = yield ruleDeclaration.rule(message.target, message);
                }
                else {
                    execResult = yield (ruleDeclaration.rule.call(message.target, message));
                }
            }
            catch (ex) {
                execResult = false;
                message.target.setError(ex);
            }
            finally {
                this.stack.pop();
            }
            return execResult;
        });
    }
}
exports.MessageRouter = MessageRouter;
//# sourceMappingURL=message-router.js.map