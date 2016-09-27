"use strict";
const rule_1 = require("../rule");
const decorators_sample_1 = require("./decorators.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe("Rule decorator", () => {
    it("rule declarations must contains TestDecorator1.rule1", () => {
        let decl = rule_1.ruleDeclarations.find(d => d.id === "TestDecorator1.rule1");
        expect(decl).to.be.an("object", "Declaration not found");
        expect(decl.constr).to.be.equal(decorators_sample_1.TestDecorator1, "Constructor does not match");
        expect(decl.isStatic).to.be.equal(false);
        expect(decl.rule).to.be.equal(decorators_sample_1.TestDecorator1.prototype.rule1, "Method does not match");
    });
    it("rule declarations must contains TestDecorator2.rule2", () => {
        let decl = rule_1.ruleDeclarations.find(d => d.id === "TestDecorator2.rule2");
        expect(decl).to.be.an("object", "Declaration not found");
        expect(decl.constr).to.be.equal(decorators_sample_1.TestDecorator2);
        expect(decl.isStatic).to.be.equal(true);
        expect(decl.rule).to.be.equal(decorators_sample_1.TestDecorator2.rule2);
    });
});
//# sourceMappingURL=decorators.spec.js.map