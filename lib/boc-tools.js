"use strict";
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
        return BocTools.thrownErrors(rulesExecutionResults).length === 0;
    }
}
exports.BocTools = BocTools;
//# sourceMappingURL=boc-tools.js.map