"use strict";
const object_filter_1 = require("../object-filter");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('Filter expressions', () => {
    let objects = [
        { oid: 'o1', x: 1 },
        { oid: 'o2', x: 1 },
        { oid: 'o3', x: 2 },
    ];
    it('should filter by oid', () => {
        let predicate = object_filter_1.ObjectFilter.getPredicate({ oid: 'o1' });
        let filtered = objects.filter(predicate);
        expect(filtered.length).to.be.equal(1);
        expect(filtered[0].oid).to.be.equal('o1');
    });
    it('should filter by prop', () => {
        let filtered = object_filter_1.ObjectFilter.filter({ x: 1 }, objects);
        expect(filtered.length).to.be.equal(2);
        expect(object_filter_1.ObjectFilter.filter({
            oid: { $in: ['o1', 'o2'] },
        }, filtered).length).to.be.equal(2);
    });
});
//# sourceMappingURL=object-filter.spec.js.map