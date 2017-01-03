import { MessageType, Trigger } from './message';
import { ModelObject } from './model-object';
import { IRoleDeclaration } from './relation';
import { RuleDeclaration } from './rule';
export interface IRulesForTrigger {
    trigger: Trigger;
    ruleDeclarations: RuleDeclaration[];
}
export declare class ClassInfo {
    readonly constr: any;
    dataStoreKey: any;
    readonly rulesByType: Map<MessageType, IRulesForTrigger[]>;
    roles: Array<IRoleDeclaration>;
    private _datastoreKey;
    constructor(constr: any);
    private registerRoles();
    private registerRules();
    private registerRuleDeclaration(ruleDeclaration);
}
export declare class ModelMetadata {
    readonly classesByConstr: Map<any, ClassInfo>;
    getClassInfo<T extends ModelObject>(constr: any): ClassInfo;
    registerClass(constr: any): void;
    registerClasses(...constructors: any[]): void;
}
