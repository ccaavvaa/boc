import { IRuleExecutionResult, Message } from './message';
import { ModelMetadata } from './model-metadata';
import { RuleDeclaration } from './rule';
import * as _ from 'lodash';

export class MessageRouterStackElement {
    constructor(
        public readonly message: Message,
        public readonly ruleDeclaration: RuleDeclaration
    ) { }
}

export class MessageRouter {
    private stack: MessageRouterStackElement[] = [];

    constructor(public readonly metadata: ModelMetadata) { }

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
            let ruleExecutionResult = await this.dispatchMessage(message, rule);
            result.push(ruleExecutionResult);
        }
        return result;
    }

    private async dispatchMessage(message: Message, ruleDeclaration: RuleDeclaration): Promise<IRuleExecutionResult> {
        this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
        let result: IRuleExecutionResult = {
            message: message,
            rule: ruleDeclaration,
        };
        try {
            let execResult;
            if (ruleDeclaration.isStatic) {
                execResult = await ruleDeclaration.rule(message.target, message);
            } else {
                execResult = await ((ruleDeclaration.rule as Function).call(message.target, message));
            }
            result.result = execResult;
        } catch (ex) {
            result.error = ex;
            message.target.addError(ex, ruleDeclaration);
        } finally {
            this.stack.pop();
        }
        return result;
    }
}
