/// <reference types="lodash" />
import { MessageType, Trigger } from "./message";
import { RuleDeclaration } from "./rule";
export interface IRulesForTrigger {
    trigger: Trigger;
    ruleDeclarations: RuleDeclaration[];
}
export declare class ClassInfo {
    readonly constr: any;
    readonly rulesByType: Map<MessageType, IRulesForTrigger[]>;
    constructor(constr: any);
    registerRules(): void;
    private registerRuleDeclaration(ruleDeclaration);
}
export declare class ModelMetadata {
    classesByConstr: Map<any, ClassInfo>;
    registerClass(constr: any): void;
}
