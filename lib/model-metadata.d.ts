import { MessageType, Trigger } from './message';
import { ModelObject } from './model-object';
import { IRoleDeclaration } from './relation';
import { RuleDeclaration } from './rule';
import { IPropertyDeclaration } from './type';
export interface IRulesForTrigger {
    trigger: Trigger;
    ruleDeclarations: RuleDeclaration[];
}
export declare class ClassInfo {
    static readonly objectTargetName: string;
    readonly constr: any;
    dataStoreKey: any;
    readonly rulesByType: Map<MessageType, IRulesForTrigger[]>;
    roles: Array<IRoleDeclaration>;
    properties: Array<IPropertyDeclaration>;
    private _datastoreKey;
    private _stateNames;
    constructor(constr: any);
    getStateNames(): string[];
    private registerProperties();
    private registerRoles();
    private registerRules();
    private registerRuleDeclaration(ruleDeclaration);
}
export declare class ModelMetadata {
    readonly classesByConstr: Map<any, ClassInfo>;
    private readonly typeSettings;
    getTypeSettings(name: string): any;
    mergeTypeSettings(settings: any[]): any;
    getClassInfo<T extends ModelObject>(constr: any): ClassInfo;
    registerClass(constr: any): void;
    registerClasses(...constructors: any[]): void;
    registerTypeSettings(name: string, settings: any): void;
}
