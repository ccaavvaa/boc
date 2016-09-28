"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const message_1 = require("../message");
class Base {
    constructor(router) {
        this.router = router;
        this.data = {};
        this.lastValidData = {};
        this.errors = {};
    }
    setError(error, path) {
        if (!path) {
            path = ".";
        }
        let errors = this.errors[path];
        if (!errors) {
            errors = [error];
            this.errors[path] = errors;
        }
        else {
            errors.push(error);
        }
    }
    setProp(propName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let oldValue = this.data[propName];
            let oldValidValue = this.lastValidData[propName];
            if (value !== oldValue || value !== oldValidValue) {
                this.errors[propName] = [];
                this.data[propName] = value;
                let message = new message_1.Message(message_1.MessageType.PropChanged, this.constructor, this, {
                    oldValidValue: oldValidValue,
                    oldValue: oldValue,
                    propName: propName,
                });
                let propagationOK = yield this.router.sendMessage(message);
                if (propagationOK) {
                    this.lastValidData[propName] = value;
                }
                return propagationOK;
            }
            return true;
        });
    }
}
class A extends Base {
    constructor(router) {
        super(router);
    }
    get_a() {
        return Promise.resolve(this.data.a);
    }
    set_a(value) {
        return this.setProp("a", value);
    }
}
//# sourceMappingURL=message-router.sample.js.map