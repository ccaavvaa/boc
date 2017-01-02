"use strict";
const sift = require("sift");
class ObjectFilter {
    static forKey(propKey, keyValue) {
        let filter = {};
        filter[propKey] = keyValue;
        return filter;
    }
    ;
    static getPredicate(expression) {
        return sift(expression);
    }
    static filter(expression, target) {
        let predicate = this.getPredicate(expression);
        let result = [];
        for (let item of target) {
            if (predicate(item)) {
                result.push(item);
            }
        }
        return result;
    }
    static first(expression, target) {
        let predicate = this.getPredicate(expression);
        for (let item of target) {
            if (predicate(item)) {
                return item;
            }
        }
        return null;
    }
}
exports.ObjectFilter = ObjectFilter;
//# sourceMappingURL=object-filter.js.map