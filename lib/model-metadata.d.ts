import { MessageType, Trigger } from './message';
import { ModelObject, ModelObjectConstructor } from './model-object';
import { RuleDeclaration } from './rule';
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
    readonly classesByConstr: Map<any, ClassInfo>;
    getClassInfo<T extends ModelObject>(constr: ModelObjectConstructor<T>): ClassInfo;
    registerClass(constr: any): void;
    registerClasses(...constructors: any[]): void;
}
