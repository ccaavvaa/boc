import { Greeter } from "../greeter";
import * as chai from "chai";
import "mocha";

const expect = chai.expect;

describe("greeter", () => {
  it("should greet with message", () => {
    const greeter = new Greeter("friend");
    expect(greeter.greet()).to.equal("Bonjour, friend!");
  });
});
