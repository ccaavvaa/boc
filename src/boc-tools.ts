import { IRuleExecutionResult } from './message';
import * as _ from 'lodash';

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

    public static today(): Date {
        return BocTools.extractDate(new Date());
    }

    public static extractDate(aDate: Date) {
        return aDate ? new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDay()) : undefined;
    }

    public static mergeSettings(settings: any[]): any {
        let result: any = {};
        for (let setting of settings) {
            _.assign(result, setting);
        }
        return result;
    }
}
