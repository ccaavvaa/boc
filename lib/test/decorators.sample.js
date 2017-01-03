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
const decorators_1 = require("../decorators");
const message_1 = require("../message");
class TestDecorator1 {
    rule1(target) {
        return Promise.resolve();
    }
}
__decorate([
    decorators_1.Rule({
        id: 'TestDecorator1.rule1',
        triggers: [
            { kind: message_1.MessageType.ObjectInit },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestDecorator1.prototype, "rule1", null);
exports.TestDecorator1 = TestDecorator1;
class TestDecorator2 {
    static rule2(target) {
        return Promise.resolve();
    }
}
__decorate([
    decorators_1.Rule({
        id: 'TestDecorator2.rule2',
        triggers: [
            { constr: TestDecorator1, kind: message_1.MessageType.ObjectInit },
            { constr: TestDecorator2, kind: message_1.MessageType.PropChanged },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestDecorator1]),
    __metadata("design:returntype", Promise)
], TestDecorator2, "rule2", null);
exports.TestDecorator2 = TestDecorator2;
//# sourceMappingURL=decorators.sample.js.map