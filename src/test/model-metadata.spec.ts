import { MessageType } from "../message";
import { ModelMetadata } from "../model-metadata";
import { TestDecorator1 } from "./decorators.sample";
import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe("Model metadata", () => {
    it("should contains triggers for TestDecorator1", () => {
        let modelMetadata = new ModelMetadata();
        modelMetadata.registerClass(TestDecorator1);
        let testDecorator1ClassInfo = modelMetadata.classesByConstr.get(TestDecorator1);
        testDecorator1ClassInfo.registerRules();
        expect(testDecorator1ClassInfo.rulesByType.get(MessageType.ObjectInit).length).to.equal(2);
    });
});
