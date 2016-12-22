import { Message } from './message';
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

    public async sendMessage(message: Message): Promise<boolean> {
        let classInfo = this.metadata.classesByConstr.get(message.constr);
        if (classInfo === undefined) {
            throw new Error('Class not registered: ${message.constr.name}');
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
            let shouldContinue = await this.dispatchMessage(message, rulesToExecute[i]);
            if (!shouldContinue) {
                return false;
            }
        }
        return true;
    }

    private async dispatchMessage(message: Message, ruleDeclaration: RuleDeclaration): Promise<boolean> {
        this.stack.push(new MessageRouterStackElement(message, ruleDeclaration));
        let execResult: boolean = false;
        try {
            if (ruleDeclaration.isStatic) {
                execResult = await ruleDeclaration.rule(message.target, message);
            } else {
                execResult = await ((ruleDeclaration.rule as Function).call(message.target, message));
            }
        } catch (ex) {
            execResult = false;
            message.target.setError(ex);
        } finally {
            this.stack.pop();
        }
        return execResult;
    }
}
