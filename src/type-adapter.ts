import { BocTools } from './boc-tools';

export type SimpleType = number | Date | string | boolean;

export class IntegerAdapter {
    public static getMax(settings: any): number {

        let definedMax = typeof (settings) === 'object' ? settings.max : undefined;
        if (definedMax === undefined) {
            return Number.MAX_SAFE_INTEGER;
        }
        if (typeof definedMax === 'number') {
            if (Number.isSafeInteger(definedMax)) {
                return definedMax;
            }
        }
        throw new Error(`Incorrect max integer value: ${definedMax}`);
    }

    public static getMin(settings: any): number {
        let definedMin = typeof (settings) === 'object' ? settings.min : undefined;
        if (definedMin === undefined) {
            return Number.MIN_SAFE_INTEGER;
        }
        if (typeof definedMin === 'number') {
            if (Number.isSafeInteger(definedMin)) {
                return definedMin;
            }
        }
        throw new Error(`Incorrect min integer value: ${definedMin}`);
    }

    public static adapt(value: number, settings?: any): number {
        let intValue = Number.parseInt(value.toFixed(0));
        let min = IntegerAdapter.getMin(settings);
        let max = IntegerAdapter.getMax(settings);
        if (intValue >= min && intValue <= max) {
            return intValue;
        }
        throw new Error(`La valeur $intvalue n'est pas dans l'intervalle ${min} .. ${max}`);
    }
}

export class DecimalAdapter {
    public static getMax(settings: any): number {
        let definedMax = settings ? settings.max : undefined;
        if (definedMax === undefined) {
            return Number.MAX_VALUE;
        }
        if (typeof definedMax === 'number') {
            return definedMax;
        }
        throw new Error(`Incorrect max decimal value: ${definedMax}`);
    }

    public static getMin(settings: any): number {
        let definedMin = settings ? settings.min : undefined;
        if (definedMin === undefined) {
            return -Number.MAX_VALUE;
        }
        if (typeof definedMin === 'number') {
            return definedMin;
        }
        throw new Error(`Incorrect min decimal value: ${definedMin}`);
    }

    public static getDecimals(settings: any): number {
        let decimals = settings ? settings.decimals : 0 ;
        return decimals || 0;
    }

    public static adapt(value: number, settings: any): number {
        let decimals = DecimalAdapter.getDecimals(settings);
        let decimalValue = Number.parseFloat(value.toFixed(decimals));
        let min = DecimalAdapter.getMin(settings);
        let max = DecimalAdapter.getMax(settings);

        if (decimalValue >= min && decimalValue <= max) {
            return decimalValue;
        }
        throw new Error(`La valeur ${decimalValue} n'est pas dans l'intervalle ${min} .. ${max}`);
    }
}

export class DateAdapter {
    public adapt(value: Date, settings: any): Date {
        return BocTools.extractDate(value);
    }
}
