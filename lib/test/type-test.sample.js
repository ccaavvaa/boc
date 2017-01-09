"use strict";
class IntegerAdapter {
    constructor(integerSettings) {
        this.integerSettings = integerSettings;
    }
    get max() {
        let definedMax = typeof this.integerSettings === 'object' ? this.integerSettings.max : undefined;
        if (definedMax === undefined) {
            return Number.MAX_SAFE_INTEGER;
        }
        if (typeof definedMax === 'number') {
            if (Number.isSafeInteger(definedMax)) {
                return definedMax;
            }
        }
        throw new Error(`Incorrect max integer value: $definedMin`);
    }
    get min() {
        let definedMin = typeof this.integerSettings === 'object' ? this.integerSettings.min : undefined;
        if (definedMin === undefined) {
            return Number.MIN_SAFE_INTEGER;
        }
        if (typeof definedMin === 'number') {
            if (Number.isSafeInteger(definedMin)) {
                return definedMin;
            }
        }
        throw new Error(`Incorrect min integer value: $definedMin`);
    }
    adapt(value) {
        let intValue = Number.parseInt(value.toFixed(0));
        if (intValue >= this.min && intValue <= this.max) {
            return intValue;
        }
        throw new Error(`La valeur $intvalue n'est pas dans l'intervalle $this.min .. $this.max`);
    }
}
exports.IntegerAdapter = IntegerAdapter;
class DecimalAdapter {
    constructor(decimalSettings) {
        this.settings = decimalSettings || {};
        this.storeAdaptedDecimals();
    }
    get max() {
        let definedMax = this.settings.max;
        if (definedMax === undefined) {
            return Number.MAX_VALUE;
        }
        if (typeof definedMax === 'number') {
            return definedMax;
        }
        throw new Error(`Incorrect max decimal value: $definedMax`);
    }
    get min() {
        let definedMin = this.settings.min;
        if (definedMin === undefined) {
            return Number.MIN_VALUE;
        }
        if (typeof definedMin === 'number') {
            return definedMin;
        }
        throw new Error(`Incorrect min decimal value: $definedMin`);
    }
    get decimals() {
        return this.settings.decimals;
    }
    adapt(value) {
        let decimalValue = Number.parseFloat(value.toFixed(this.decimals));
        if (decimalValue >= this.min && decimalValue <= this.max) {
            return decimalValue;
        }
        throw new Error(`La valeur $decimalValue n'est pas dans l'intervalle $this.min .. $this.max`);
    }
    storeAdaptedDecimals() {
        let definedDecimals = this.settings.decimals === undefined ?
            0 :
            DecimalAdapter.decimalsValueAdapter.adapt(this.settings.decimals);
        this.settings.decimals = definedDecimals;
    }
}
DecimalAdapter.decimalsValueAdapter = new IntegerAdapter({ max: 9, min: 0 });
exports.DecimalAdapter = DecimalAdapter;
//# sourceMappingURL=type-test.sample.js.map