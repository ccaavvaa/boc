"use strict";
const boc_tools_1 = require("./boc-tools");
const message_1 = require("./message");
const rule_1 = require("./rule");
const type_1 = require("./type");
class ClassInfo {
    constructor(constr) {
        this.rulesByType = new Map();
        this.constr = constr;
        this.registerProperties();
        this.registerRules();
        this.registerRoles();
    }
    get dataStoreKey() {
        return this._datastoreKey ? this._datastoreKey : this.constr.name;
    }
    set dataStoreKey(value) {
        this._datastoreKey = value;
    }
    registerProperties() {
        this.properties = type_1.propertyDeclarations.filter((v, i, a) => {
            return v.constr === this.constr;
        });
    }
    registerRoles() {
        if (this.constr.defineRoles) {
            this.roles = this.constr.defineRoles();
        }
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
        this.typeSettings = {};
    }
    getTypeSettings(name) {
        return this.typeSettings[name];
    }
    mergeTypeSettings(settings) {
        let result = [];
        for (let setting of settings) {
            if (typeof (setting) === 'string') {
                result.push(this.getTypeSettings(setting));
            }
            else if (typeof (setting) === 'object') {
                result.push(setting);
            }
        }
        return boc_tools_1.BocTools.mergeSettings(result);
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
    registerTypeSettings(name, settings) {
        this.typeSettings[name] = settings;
    }
}
exports.ModelMetadata = ModelMetadata;
//# sourceMappingURL=model-metadata.js.map