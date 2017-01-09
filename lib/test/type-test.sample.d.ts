export interface ITypeAdapter<T extends number | Date | string> {
    adapt(value: T): T;
}
export declare class IntegerAdapter implements ITypeAdapter<number> {
    private integerSettings;
    constructor(integerSettings?: any);
    readonly max: number;
    readonly min: number;
    adapt(value: number): number;
}
export declare class DecimalAdapter implements ITypeAdapter<number> {
    private static decimalsValueAdapter;
    private settings;
    constructor(decimalSettings?: any);
    readonly max: number;
    readonly min: number;
    readonly decimals: number;
    adapt(value: number): number;
    private storeAdaptedDecimals();
}
