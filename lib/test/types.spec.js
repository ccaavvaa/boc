"use strict";
const type_adapter_1 = require("../type-adapter");
const chai = require("chai");
require("mocha");
const expect = chai.expect;
describe('IntegerAdapter', () => {
    it('should respect min', () => {
        let adapter = type_adapter_1.IntegerAdapter;
        let settings = { min: 1 };
        let adapted;
        expect(() => {
            adapted = adapter.adapt(0, settings);
        }).to.throw();
    });
    it('should respect max', () => {
        let adapter = type_adapter_1.IntegerAdapter;
        let settings = { max: 1 };
        let adapted;
        expect(() => {
            adapted = adapter.adapt(2, settings);
        }).to.throw();
    });
    it('should respect min max integer', () => {
        let adapter = type_adapter_1.IntegerAdapter;
        let max = adapter.getMax(undefined);
        let min = adapter.getMin(undefined);
        expect(max).to.equal(Number.MAX_SAFE_INTEGER);
        expect(min).to.equal(Number.MIN_SAFE_INTEGER);
    });
    it('should adapt 1.5 to 2', () => {
        let adapter = type_adapter_1.IntegerAdapter;
        let adapted = adapter.adapt(1.5);
        expect(adapted).to.equal(2);
    });
    it('should adapt 1.5 to 2', () => {
        let adapter = type_adapter_1.IntegerAdapter;
        let adapted = adapter.adapt(1.5);
        expect(adapted).to.equal(2);
    });
});
describe('DecimalAdapter', () => {
    it('should round', () => {
        let adapter = type_adapter_1.DecimalAdapter;
        let settings = { decimals: 2, min: 0 };
        let adapted = adapter.adapt(0.225, settings);
        expect(adapted).to.equal(0.23);
    });
    it('should round', () => {
        let adapter = type_adapter_1.DecimalAdapter;
        let settings = { decimals: 1 };
        let adapted = adapter.adapt(0.1 + 0.2, settings);
        expect(adapted).to.equal(0.3);
    });
    it('should respect max', () => {
        let adapter = type_adapter_1.DecimalAdapter;
        let settings = { decimals: 2, max: 1 };
        expect(() => {
            adapter.adapt(2.5, settings);
        }).to.throw();
    });
    it('should respect min ', () => {
        let adapter = type_adapter_1.DecimalAdapter;
        let settings = { decimals: 2, min: 1 };
        expect(() => {
            adapter.adapt(-2.5, settings);
        }).to.throw();
    });
});
//# sourceMappingURL=types.spec.js.map