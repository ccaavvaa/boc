"use strict";
const relation_sample_1 = require("./relation.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe("Composition AB", () => {
    it("added B should exists in A", () => {
        let a = new relation_sample_1.A({
            id: "A1",
        });
        let b = new relation_sample_1.B({
            id: "B1",
        });
        a.listB.Add(b);
        expect(a.listB.items.length).to.be.equal(1);
        expect(a.listB.items[0]).to.be.equal(b);
        expect(a.dataObject.listB).to.be.not.null;
        expect(a.dataObject.listB[0].id).to.be.equal("B1");
    });
    it("loaded B should exists in A", () => {
        let a = new relation_sample_1.A({
            id: "A1",
            listB: [
                {
                    id: "B1",
                    idA: "A1",
                },
                {
                    id: "B2",
                    idA: "A1",
                },
            ],
        });
        expect(a.listB.items.length).to.be.equal(2);
        expect(a.listB.items[0].id).to.be.equal("B1");
        expect(a.listB.items[1].id).to.be.equal("B2");
        expect(a.dataObject.listB[1].id).to.be.equal("B2");
    });
});
//# sourceMappingURL=relation.spec.js.map