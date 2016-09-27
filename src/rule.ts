export enum MessageType {
    Unknown = 0,
    ObjectInit = 1 << 0,
    PropChanged = 1 << 1,
    Saving = 1 << 5,
    Saved = 1 << 6,
}

export interface ITrigger {
    kind: MessageType;
    constr?: Function;
    body?: any;
};

export interface IRuleDeclarationOptions {
    id: string;
    description?: string;
    level?: number;
    triggers: ITrigger[];
}

export class RuleDeclaration {
    public id: string;
    public description: string;
    public constr: any;
    public triggers: ITrigger[];
    public rule: any;
    public level: number;
    public isStatic: boolean;
}

export var ruleDeclarations: RuleDeclaration[] = [];
