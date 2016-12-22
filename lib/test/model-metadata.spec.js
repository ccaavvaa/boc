"use strict";
const message_1 = require("../message");
const model_metadata_1 = require("../model-metadata");
const decorators_sample_1 = require("./decorators.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('Model metadata', () => {
    it('should contains triggers for TestDecorator1', () => {
        let modelMetadata = new model_metadata_1.ModelMetadata();
        modelMetadata.registerClass(decorators_sample_1.TestDecorator1);
        let testDecorator1ClassInfo = modelMetadata.classesByConstr.get(decorators_sample_1.TestDecorator1);
        testDecorator1ClassInfo.registerRules();
        expect(testDecorator1ClassInfo.rulesByType.get(message_1.MessageType.ObjectInit).length).to.equal(2);
    });
});
//# sourceMappingURL=model-metadata.spec.js.map