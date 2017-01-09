"use strict";
const type_test_sample_1 = require("./type-test.sample");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('IntegerAdapter', () => {
    it('should respect min', () => {
        let adapter = new type_test_sample_1.IntegerAdapter({ min: 1 });
        let adapted;
        expect(() => {
            adapted = adapter.adapt(0);
        }).to.throw();
    });
    it('should respect max', () => {
        let adapter = new type_test_sample_1.IntegerAdapter({ max: 1 });
        let adapted;
        expect(() => {
            adapted = adapter.adapt(2);
        }).to.throw();
    });
    it('should respect min max integer', () => {
        let adapter = new type_test_sample_1.IntegerAdapter();
        let max = adapter.max;
        let min = adapter.min;
        expect(max).to.equal(Number.MAX_SAFE_INTEGER);
        expect(min).to.equal(Number.MIN_SAFE_INTEGER);
    });
    it('should adapt 1.5 to 2', () => {
        let adapter = new type_test_sample_1.IntegerAdapter();
        let adapted = adapter.adapt(1.5);
        expect(adapted).to.equal(2);
    });
    it('should adapt 1.5 to 2', () => {
        let adapter = new type_test_sample_1.IntegerAdapter();
        let adapted = adapter.adapt(1.5);
        expect(adapted).to.equal(2);
    });
});
describe('DecimalAdapter', () => {
    it('should round', () => {
        let adapter = new type_test_sample_1.DecimalAdapter({ decimals: 2, min: 0 });
        let adapted = adapter.adapt(0.225);
        expect(adapted).to.equal(0.23);
    });
    it('should round', () => {
        let adapter = new type_test_sample_1.DecimalAdapter({ decimals: 1 });
        let adapted = adapter.adapt(0.1 + 0.2);
        expect(adapted).to.equal(0.3);
    });
    it('should respect max', () => {
        let adapter = new type_test_sample_1.DecimalAdapter({ decimals: 2, max: 1 });
        let adapted;
        expect(() => {
            adapted = adapter.adapt(2.5);
        }).to.throw();
    });
    it('should respect min ', () => {
        let adapter = new type_test_sample_1.DecimalAdapter({ decimals: 2, min: 1 });
        let adapted;
        expect(() => {
            adapted = adapter.adapt(-2.5);
        }).to.throw();
    });
});
//# sourceMappingURL=type-test.spec.js.map