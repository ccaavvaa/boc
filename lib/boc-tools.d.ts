import { IRuleExecutionResult } from './message';
export declare class BocTools {
    static thrownErrors(rulesExecutionResults: IRuleExecutionResult[]): Error[];
    static hasThrownError(rulesExecutionResults: IRuleExecutionResult[]): boolean;
}
