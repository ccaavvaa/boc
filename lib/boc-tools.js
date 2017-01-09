"use strict";
const _ = require("lodash");
class BocTools {
    static thrownErrors(rulesExecutionResults) {
        let result = rulesExecutionResults.reduce((previousValue, currentValue, currentIndex, array) => {
            if (currentValue.error) {
                previousValue.push(currentValue.error);
            }
            return previousValue;
        }, []);
        return result;
    }
    static hasThrownError(rulesExecutionResults) {
        return BocTools.thrownErrors(rulesExecutionResults).length !== 0;
    }
    static today() {
        return BocTools.extractDate(new Date());
    }
    static extractDate(aDate) {
        return aDate ? new Date(aDate.getFullYear(), aDate.getMonth(), aDate.getDay()) : undefined;
    }
    static mergeSettings(settings) {
        let result = {};
        for (let setting of settings) {
            _.assign(result, setting);
        }
        return result;
    }
}
exports.BocTools = BocTools;
//# sourceMappingURL=boc-tools.js.map