"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const message_1 = require("../message");
const message_router_1 = require("../message-router");
const model_metadata_1 = require("../model-metadata");
const message_router_sample_1 = require("./message-router.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe("Message router", () => {
    let router;
    before(() => {
        let metadata = new model_metadata_1.ModelMetadata();
        metadata.registerClass(message_router_sample_1.A);
        let ci = metadata.classesByConstr.get(message_router_sample_1.A);
        ci.registerRules();
        router = new message_router_1.MessageRouter(metadata);
    });
    it("should route :-)", () => {
        let test = () => __awaiter(this, void 0, void 0, function* () {
            let instance = new message_router_sample_1.A(router);
            let ret = yield router.sendMessage(new message_1.Message(message_1.MessageType.ObjectInit, instance));
            expect(ret).to.be.equal(true);
            expect(yield instance.get_a()).to.be.equal("initial a");
            expect(yield instance.get_b()).to.be.equal(undefined);
            yield instance.set_b("b");
            expect(yield instance.get_c()).to.be.equal("initial a b");
            return true;
        });
        return test();
    });
});
//# sourceMappingURL=message-router.spec.js.map