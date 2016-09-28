import { ITrigger } from "./message";

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

    public getTriggersByClass(constr: any): ITrigger[] {
        return this.triggers.filter(t => t.constr === constr);
    }
}

export var ruleDeclarations: RuleDeclaration[] = [];
