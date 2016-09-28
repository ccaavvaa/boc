import { ITrigger } from "./message";
export interface IRuleDeclarationOptions {
    id: string;
    description?: string;
    level?: number;
    triggers: ITrigger[];
}
export declare class RuleDeclaration {
    id: string;
    description: string;
    constr: any;
    triggers: ITrigger[];
    rule: any;
    level: number;
    isStatic: boolean;
    getTriggersByClass(constr: any): ITrigger[];
}
export declare var ruleDeclarations: RuleDeclaration[];
