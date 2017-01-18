"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
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
        this.errorsByRule = new Map();
        this.stack = [];
    }
    get currentStackElement() {
        let index = this.stack.length - 1;
        return index >= 0 ? this.stack[index] : undefined;
    }
    clearError(error) {
        let stackElement = error.raisedBy;
        if (stackElement) {
            let routerErrors = this
                .errorsByRule.get(stackElement.ruleDeclaration);
            if (routerErrors) {
                let index = routerErrors.indexOf(error);
                if (index >= 0) {
                    routerErrors.splice(index, 1);
                }
            }
        }
    }
    addError(error) {
        let stackElement = error.raisedBy;
        if (stackElement) {
            let routerErrors = this
                .errorsByRule.get(stackElement.ruleDeclaration);
            if (routerErrors) {
                routerErrors.push(error);
            }
            else {
                this.errorsByRule.set(error.raisedBy.ruleDeclaration, [error]);
            }
        }
    }
    clearErrors(ruleDeclaration, message) {
        let errors = this.errorsByRule.get(ruleDeclaration);
        if (errors) {
            let errorsToClear = errors.filter(v => v.raisedBy.message.matchMessage(message));
            for (let error of errorsToClear) {
                error.target.errors.clearError(error);
            }
        }
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
                .filter(v => message.matchTrigger(v.trigger))
                .map(v => v.ruleDeclarations)
                .reduce((p, v) => {
                let n = _.union(p, v);
                return n;
            }, []);
            if (rulesToExecute.length > 0) {
                result = [];
            }
            for (let rule of rulesToExecute) {
                let ruleExecutionResult = yield this.dispatchMessage(rule, message);
                result.push(ruleExecutionResult);
            }
            return result;
        });
    }
    dispatchMessage(ruleDeclaration, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
            this.clearErrors(ruleDeclaration, message);
            let result = {
                message: message,
                rule: ruleDeclaration,
            };
            try {
                this.clearErrors(ruleDeclaration, message);
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
                let errorsObject = message.target.errors;
                if (errorsObject) {
                    errorsObject.addError(ex);
                }
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