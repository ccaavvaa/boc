"use strict";
const greeter_1 = require("../greeter");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe("greeter", () => {
    it("should greet with message", () => {
        const greeter = new greeter_1.Greeter("friend");
        expect(greeter.greet()).to.equal("Bonjour, friend!");
    });
});
//# sourceMappingURL=greeter-spec.js.map