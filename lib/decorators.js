"use strict";
const rule_1 = require("./rule");
function checkRuleDeclaration(ruleOptions) {
    if (!ruleOptions.id) {
        throw new Error("Rule id is mandatory");
    }
    if (!ruleOptions.triggers || ruleOptions.triggers.length === 0) {
        throw new Error("Rules must declare triggers");
    }
}
function Rule(ruleOptions) {
    return (target, propertyKey, descriptor) => {
        checkRuleDeclaration(ruleOptions);
        let ruleDeclaration = new rule_1.RuleDeclaration();
        ruleDeclaration.id = ruleOptions.id;
        ruleDeclaration.description = ruleOptions.description || "";
        ruleDeclaration.isStatic = typeof target !== "object";
        ruleDeclaration.constr = ruleDeclaration.isStatic ? target : target.constructor;
        ruleDeclaration.rule = descriptor.value;
        ruleDeclaration.level = ruleOptions.level || 0;
        ruleDeclaration.triggers = ruleOptions.triggers;
        ruleDeclaration.triggers.forEach(t => {
            if (!t.constr) {
                t.constr = ruleDeclaration.constr;
            }
        });
        rule_1.ruleDeclarations.push(ruleDeclaration);
    };
}
exports.Rule = Rule;
//# sourceMappingURL=decorators.js.map