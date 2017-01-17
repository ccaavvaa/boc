import { IRuleExecutionResult, Message } from './message';
import { ModelMetadata } from './model-metadata';
import { IErrorInfo } from './object-error';
import { RuleDeclaration } from './rule';
export declare class MessageRouterStackElement {
    readonly message: Message;
    readonly ruleDeclaration: RuleDeclaration;
    constructor(message: Message, ruleDeclaration: RuleDeclaration);
}
export declare class MessageRouter {
    readonly metadata: ModelMetadata;
    readonly errorsByRule: Map<RuleDeclaration, IErrorInfo[]>;
    private stack;
    readonly currentStackElement: MessageRouterStackElement;
    constructor(metadata: ModelMetadata);
    clearError(error: IErrorInfo): void;
    addError(error: IErrorInfo): void;
    clearErrors(ruleDeclaration: RuleDeclaration, message: Message): void;
    sendMessage(message: Message): Promise<IRuleExecutionResult[]>;
    private dispatchMessage(ruleDeclaration, message);
}
