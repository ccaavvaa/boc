import { IRuleExecutionResult, Message } from './message';
import { ModelMetadata } from './model-metadata';
import { IErrorInfo } from './object-error';
import { RuleDeclaration } from './rule';
import * as _ from 'lodash';

export class MessageRouterStackElement {
    constructor(
        public readonly message: Message,
        public readonly ruleDeclaration: RuleDeclaration
    ) { }
}

export class MessageRouter {

    public readonly errorsByRule: Map<RuleDeclaration, IErrorInfo[]> = new Map<RuleDeclaration, IErrorInfo[]>();

    private stack: MessageRouterStackElement[] = [];

    public get currentStackElement(): MessageRouterStackElement {
        let index = this.stack.length - 1;
        return index >= 0 ? this.stack[index] : undefined;
    }

    constructor(public readonly metadata: ModelMetadata) { }

    public clearError(error: IErrorInfo): void {
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

    public addError(error: IErrorInfo): void {
        let stackElement = error.raisedBy;
        if (stackElement) {
            let routerErrors = this
                .errorsByRule.get(stackElement.ruleDeclaration);
            if (routerErrors) {
                routerErrors.push(error);
            } else {
                this.errorsByRule.set(error.raisedBy.ruleDeclaration, [error]);
            }
        }
    }

    public clearErrors(ruleDeclaration: RuleDeclaration, message: Message) {
        let errors = this.errorsByRule.get(ruleDeclaration);
        if (errors) {
            let errorsToClear = errors.filter(v => v.raisedBy.message.matchMessage(message));
            for (let error of errorsToClear) {
                error.target.errors.clearError(error);
            }
        }
    }

    public async sendMessage(message: Message): Promise<IRuleExecutionResult[]> {
        let classInfo = this.metadata.classesByConstr.get(message.constr);
        if (!classInfo) {
            throw new Error('Class not registered: ${message.constr.name}');
        }

        let result: IRuleExecutionResult[] = null;

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
            let ruleExecutionResult = await this.dispatchMessage(rule, message);
            result.push(ruleExecutionResult);
        }
        return result;
    }

    private async dispatchMessage(ruleDeclaration: RuleDeclaration, message: Message): Promise<IRuleExecutionResult> {
        this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
        this.clearErrors(ruleDeclaration, message);
        let result: IRuleExecutionResult = {
            message: message,
            rule: ruleDeclaration,
        };
        try {
            this.clearErrors(ruleDeclaration, message);
            let execResult;
            if (ruleDeclaration.isStatic) {
                execResult = await ruleDeclaration.rule(message.target, message);
            } else {
                execResult = await ((ruleDeclaration.rule as Function).call(message.target, message));
            }
            result.result = execResult;
        } catch (ex) {
            result.error = ex;
            let errorsObject = message.target.errors;
            if (errorsObject) {
                errorsObject.addError(ex);
            }
            message.target.addError(ex, ruleDeclaration);
        } finally {
            this.stack.pop();
        }
        return result;
    }
}
