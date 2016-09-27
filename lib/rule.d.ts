export declare enum MessageType {
    Unknown = 0,
    ObjectInit = 1,
    PropChanged = 2,
    Saving = 32,
    Saved = 64,
}
export interface ITrigger {
    kind: MessageType;
    constr?: Function;
    body?: any;
}
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
}
export declare var ruleDeclarations: RuleDeclaration[];
