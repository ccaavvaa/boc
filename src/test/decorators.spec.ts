import {ruleDeclarations} from "../rule";
import {TestDecorator1, TestDecorator2} from "./decorators.sample";
import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe("Rule decorator", () => {
    it("rule declarations must contains TestDecorator1.rule1", () => {
        let decl = ruleDeclarations.find(d => d.id === "TestDecorator1.rule1");
        expect(decl).to.be.an("object", "Declaration not found");
        expect(decl.constr).to.be.equal(TestDecorator1, "Constructor does not match");
        expect(decl.isStatic).to.be.equal(false);
        expect(decl.rule).to.be.equal(TestDecorator1.prototype.rule1, "Method does not match");
    });
    it("rule declarations must contains TestDecorator2.rule2", () => {
        let decl = ruleDeclarations.find(d => d.id === "TestDecorator2.rule2");
        expect(decl).to.be.an("object", "Declaration not found");
        expect(decl.constr).to.be.equal(TestDecorator2);
        expect(decl.isStatic).to.be.equal(true);
        expect(decl.rule).to.be.equal(TestDecorator2.rule2);
    });
});
