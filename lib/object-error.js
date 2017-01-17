"use strict";
const model_metadata_1 = require("./model-metadata");
const _ = require("lodash");
class ErrorInfos {
    constructor(owner) {
        this.errors = new Map();
        this.owner = owner;
    }
    get hasErrors() {
        for (let key of this.errors.keys()) {
            let errors = this.errors.get(key);
            if (errors && errors.length > 0) {
                return true;
            }
        }
        return false;
    }
    getAllErrors() {
        let result = [];
        for (let entry of this.errors.entries()) {
            result = result.concat(entry[1]);
        }
        return result;
    }
    clearErrors(key) {
        key = this.getPropOrObjectKey(key);
        let errors = this.errors.get(key);
        if (errors) {
            for (let error of errors) {
                this.clearError(error);
            }
        }
    }
    clearError(errorInfo) {
        let errors = this.errors.get(errorInfo.key);
        if (errors) {
            _.remove(errors, v => v === errorInfo);
        }
        this.owner.container.messageRouter.clearError(errorInfo);
        if (errors.length === 0) {
            this.errors.delete(errorInfo.key);
        }
    }
    clear() {
        for (let key of this.errors.keys()) {
            this.clearErrors(key);
        }
    }
    addError(error, key) {
        key = this.getPropOrObjectKey(key);
        let stackElement = this.owner.container.messageRouter.currentStackElement;
        let errorInfo = {
            error: error,
            raisedBy: stackElement,
            target: this.owner,
            key: key,
        };
        if (stackElement) {
            this.owner.container.messageRouter.addError(errorInfo);
        }
        let errors = this.errors.get(key);
        if (!errors) {
            this.errors.set(key, [errorInfo]);
        }
        else {
            errors.push(errorInfo);
        }
    }
    getPropOrObjectKey(key) {
        if (key === undefined || key === null) {
            key = model_metadata_1.ClassInfo.objectTargetName;
        }
        return key;
    }
}
exports.ErrorInfos = ErrorInfos;
//# sourceMappingURL=object-error.js.map