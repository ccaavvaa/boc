import { MessageType, Trigger } from './message';
import { ModelObject, ModelObjectConstructor } from './model-object';
import { RuleDeclaration, ruleDeclarations } from './rule';

export interface IRulesForTrigger {
    trigger: Trigger;
    ruleDeclarations: RuleDeclaration[];
}

export class ClassInfo {
    public readonly constr: any;
    public get dataStoreKey(): any {
        return this._datastoreKey ? this._datastoreKey : this.constr.name;
    }
    public set dataStoreKey(value: any) {
        this._datastoreKey = value;
    }

    public readonly rulesByType: Map<MessageType, IRulesForTrigger[]> = new Map<MessageType, IRulesForTrigger[]>();

    private _datastoreKey: any;
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
    public readonly classesByConstr: Map<any, ClassInfo> = new Map<any, ClassInfo>();

    public getClassInfo<T extends ModelObject>(constr: ModelObjectConstructor<T>): ClassInfo {
        let classInfo = this.classesByConstr.get(constr);
        if (classInfo == null) {
            throw new Error('Class not registered');
        }
        return classInfo;
    }

    public registerClass(constr: any): void {
        let classInfo = this.classesByConstr.get(constr);
        if (classInfo !== undefined) {
            return;
        }
        classInfo = new ClassInfo(constr);
        this.classesByConstr.set(constr, classInfo);
    }

    public registerClasses(...constructors: any[]) {
        for (let constr of constructors) {
            this.registerClass(constr);
        }
    }
}
