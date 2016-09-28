import { MessageType, Trigger } from "./message";
import { RuleDeclaration, ruleDeclarations } from "./rule";

export interface IRulesForTrigger {
    trigger: Trigger;
    ruleDeclarations: RuleDeclaration[];
}

export class ClassInfo {
    public readonly constr: any;
    public readonly rulesByType: Map<MessageType, IRulesForTrigger[]> = new Map<MessageType, IRulesForTrigger[]>();

    constructor(constr: any) {
        this.constr = constr;
    }

    public registerRules(): void {
        ruleDeclarations.forEach(rd => this.registerRuleDeclaration(rd));
    }

    private registerRuleDeclaration(ruleDeclaration: RuleDeclaration): void {
        let triggers = ruleDeclaration.getTriggersByClass(this.constr);
        triggers.forEach(t => {
            let triggersRules = this.rulesByType.get(t.kind);
            if (triggersRules === undefined) {
                triggersRules = [];
                this.rulesByType.set(t.kind, triggersRules);
            }
            let triggerRules = triggersRules.find(rft => rft.trigger.equals(t));
            if (triggerRules === undefined) {
                triggerRules = {
                    ruleDeclarations: [
                        ruleDeclaration,
                    ],
                    trigger: new Trigger(t),
                };
                triggersRules.push(triggerRules);
            } else {
                if (triggerRules.ruleDeclarations.find(rd => rd === ruleDeclaration) !== undefined) {
                    triggerRules.ruleDeclarations.push(ruleDeclaration);
                }
            }
        });
    }
}

export class ModelMetadata {
    public classesByConstr: Map<any, ClassInfo> = new Map<any, ClassInfo>();

    public registerClass(constr: any) {
        let classInfo = this.classesByConstr.get(constr);
        if (classInfo !== undefined) {
            return;
        }
        classInfo = new ClassInfo(constr);
        this.classesByConstr.set(constr, classInfo);
    }
}
