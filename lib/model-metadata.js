"use strict";
const message_1 = require("./message");
const rule_1 = require("./rule");
class ClassInfo {
    constructor(constr) {
        this.rulesByType = new Map();
        this.constr = constr;
    }
    registerRules() {
        rule_1.ruleDeclarations.forEach(rd => this.registerRuleDeclaration(rd));
    }
    registerRuleDeclaration(ruleDeclaration) {
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
                    trigger: new message_1.Trigger(t),
                };
                triggersRules.push(triggerRules);
            }
            else {
                if (triggerRules.ruleDeclarations.find(rd => rd === ruleDeclaration) !== undefined) {
                    triggerRules.ruleDeclarations.push(ruleDeclaration);
                }
            }
        });
    }
}
exports.ClassInfo = ClassInfo;
class ModelMetadata {
    constructor() {
        this.classesByConstr = new Map();
    }
    getClassInfo(constr) {
        let classInfo = this.classesByConstr.get(constr);
        if (classInfo == null) {
            throw new Error('Class not registered');
        }
        return classInfo;
    }
    registerClass(constr) {
        let classInfo = this.classesByConstr.get(constr);
        if (classInfo !== undefined) {
            return;
        }
        classInfo = new ClassInfo(constr);
        this.classesByConstr.set(constr, classInfo);
    }
    registerClasses(...constructors) {
        for (let constr of constructors) {
            this.registerClass(constr);
        }
    }
}
exports.ModelMetadata = ModelMetadata;
//# sourceMappingURL=model-metadata.js.map