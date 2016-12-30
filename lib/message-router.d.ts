import { IRuleExecutionResult, Message } from './message';
import { ModelMetadata } from './model-metadata';
import { RuleDeclaration } from './rule';
export declare class MessageRouterStackElement {
    readonly message: Message;
    readonly ruleDeclaration: RuleDeclaration;
    constructor(message: Message, ruleDeclaration: RuleDeclaration);
}
export declare class MessageRouter {
    readonly metadata: ModelMetadata;
    private stack;
    constructor(metadata: ModelMetadata);
    sendMessage(message: Message): Promise<IRuleExecutionResult[]>;
    private dispatchMessage(message, ruleDeclaration);
}
