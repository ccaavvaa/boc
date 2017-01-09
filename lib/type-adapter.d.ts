export declare type SimpleType = number | Date | string | boolean;
export declare class IntegerAdapter {
    static getMax(settings: any): number;
    static getMin(settings: any): number;
    static adapt(value: number, settings?: any): number;
}
export declare class DecimalAdapter {
    static getMax(settings: any): number;
    static getMin(settings: any): number;
    static getDecimals(settings: any): number;
    static adapt(value: number, settings: any): number;
}
export declare class DateAdapter {
    adapt(value: Date, settings: any): Date;
}
