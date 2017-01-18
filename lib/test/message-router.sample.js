"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const decorators_1 = require("../decorators");
const message_1 = require("../message");
class Base {
    constructor(router) {
        this.router = router;
        this.data = {};
        this.errors = {};
    }
    setError(error, path) {
        if (!path) {
            path = '.';
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
            this.data[propName] = value;
            let message = new message_1.Message(message_1.MessageType.PropChanged, this, {
                propName: propName,
            }, {
                oldValue: oldValue,
            });
            let propagationOK = yield this.router.sendMessage(message);
            return propagationOK;
        });
    }
}
exports.Base = Base;
class A extends Base {
    constructor(router) {
        super(router);
    }
    get_a() {
        return Promise.resolve(this.data.a);
    }
    set_a(value) {
        return this.setProp('a', value);
    }
    get_b() {
        return Promise.resolve(this.data.b);
    }
    set_b(value) {
        return this.setProp('b', value);
    }
    get_c() {
        return Promise.resolve(this.data.c);
    }
    set_c(value) {
        return this.setProp('c', value);
    }
    init(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.set_a('initial a');
            return result;
        });
    }
    calculateC(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let aa = yield this.get_a();
            let bb = yield this.get_b();
            let x = [aa, bb];
            let newValue = x.reduce((p, v) => {
                if (v) {
                    if (p) {
                        p = p + ' ';
                    }
                    p = p + v;
                }
                return p;
            }, '');
            yield this.set_c(newValue);
        });
    }
}
__decorate([
    decorators_1.Rule({
        description: 'A:initialisation',
        id: 'A.0',
        level: 0,
        triggers: [{ kind: message_1.MessageType.ObjectInit }],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message]),
    __metadata("design:returntype", Promise)
], A.prototype, "init", null);
__decorate([
    decorators_1.Rule({
        description: 'A:c=a+b',
        id: 'A.1',
        level: 0,
        triggers: [
            {
                body: { propName: 'a' },
                kind: message_1.MessageType.PropChanged,
            },
            {
                body: { propName: 'b' },
                kind: message_1.MessageType.PropChanged,
            },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_1.Message]),
    __metadata("design:returntype", Promise)
], A.prototype, "calculateC", null);
exports.A = A;
//# sourceMappingURL=message-router.sample.js.map