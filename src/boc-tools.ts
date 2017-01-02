import { IRuleExecutionResult } from './message';
export class BocTools {
    public static thrownErrors(rulesExecutionResults: IRuleExecutionResult[]): Error[] {
        let result: Error[] =
            rulesExecutionResults.reduce<Error[]>((previousValue, currentValue, currentIndex, array) => {
                if (currentValue.error) {
                    previousValue.push(currentValue.error);
                }
                return previousValue;
            }, []);
        return result;
    }

    public static hasThrownError(rulesExecutionResults: IRuleExecutionResult[]): boolean {
        return BocTools.thrownErrors(rulesExecutionResults).length !== 0;
    }
}
