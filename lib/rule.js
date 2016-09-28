"use strict";
class RuleDeclaration {
    getTriggersByClass(constr) {
        return this.triggers.filter(t => t.constr === constr);
    }
}
exports.RuleDeclaration = RuleDeclaration;
exports.ruleDeclarations = [];
//# sourceMappingURL=rule.js.map