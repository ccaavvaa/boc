import { IRuleExecutionResult } from './message';
export declare class BocTools {
    static thrownErrors(rulesExecutionResults: IRuleExecutionResult[]): Error[];
    static hasThrownError(rulesExecutionResults: IRuleExecutionResult[]): boolean;
    static today(): Date;
    static extractDate(aDate: Date): Date;
    static mergeSettings(settings: any[]): any;
}
