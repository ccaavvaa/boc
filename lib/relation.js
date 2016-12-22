"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const message_1 = require("./message");
const model_object_1 = require("./model-object");
const object_filter_1 = require("./object-filter");
class Relation {
    constructor(owner, settings) {
        this.settings = settings;
        this.owner = owner;
    }
    getOppositeRole(opposite) {
        if (opposite) {
            let role = opposite[this.settings.oppositeRoleProp];
            return role;
        }
        return null;
    }
}
exports.Relation = Relation;
class OneBase extends Relation {
    constructor(owner, settings) {
        super(owner, settings);
    }
    getOpposite() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.oppositeValue) {
                yield this.load();
            }
            return this.oppositeValue;
        });
    }
    link(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentOpposite = this.loaded ? this.oppositeValue : yield this.getOpposite();
            if (currentOpposite === opposite) {
                return true;
            }
            if (currentOpposite) {
                throw new Error('Opposite is allready set');
            }
            return this.internalLink(opposite);
        });
    }
    unlink() {
        return __awaiter(this, void 0, void 0, function* () {
            let opposite = this.loaded ? this.oppositeValue : yield this.getOpposite();
            let oppositeRole = this.getOppositeRole(opposite);
            if (opposite) {
                this.doUnlink(opposite);
                if (oppositeRole) {
                    oppositeRole.doUnlink(this.owner);
                }
            }
            let notify = () => __awaiter(this, void 0, void 0, function* () {
                return this.notifyUnlink(opposite);
            });
            let oppositeNotify = () => __awaiter(this, void 0, void 0, function* () {
                if (oppositeRole) {
                    return oppositeRole.notifyUnlink(this.owner);
                }
                else {
                    return true;
                }
            });
            let notifications = this.settings.isSlave ?
                [oppositeNotify, notify] :
                [notify, oppositeNotify];
            let result = true;
            for (let notification of notifications) {
                result = result && (yield notification());
            }
            return result;
        });
    }
    internalLink(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            this.doLink(opposite);
            let oppositeRole = this.getOppositeRole(opposite);
            if (oppositeRole) {
                oppositeRole.doLink(this.owner);
            }
            let oppositeNotify = () => __awaiter(this, void 0, void 0, function* () {
                if (oppositeRole) {
                    return oppositeRole.notifyLink(this.owner);
                }
                else {
                    return true;
                }
            });
            let notify = () => __awaiter(this, void 0, void 0, function* () {
                return this.notifyLink(opposite);
            });
            let notifications = this.settings.isSlave ?
                [oppositeNotify, notify] :
                [notify, oppositeNotify];
            let result = true;
            for (let notification of notifications) {
                result = result && (yield notification());
            }
            return result;
        });
    }
}
exports.OneBase = OneBase;
class Reference extends OneBase {
    doLink(opposite) {
        this.loaded = true;
        this.oppositeValue = opposite;
        if (this.settings.key) {
            this.owner.data[this.settings.key] = opposite ? opposite.oid : null;
        }
    }
    doUnlink(opposite) {
        this.loaded = true;
        this.oppositeValue = null;
        if (this.settings.key) {
            this.owner.data[this.settings.key] = null;
        }
    }
    notifyUnlink(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = new message_1.Message(message_1.MessageType.Unlink, this.owner, {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
            let propagationOK = yield this.owner.container.messageRouter.sendMessage(message);
            return propagationOK;
        });
    }
    notifyLink(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = new message_1.Message(message_1.MessageType.Link, this.owner, {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
            let propagationOK = yield this.owner.container.messageRouter.sendMessage(message);
            return propagationOK;
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                let referenceId = this.owner.data[this.settings.key];
                if (referenceId == null) {
                    this.oppositeValue = null;
                }
                else {
                    let filter = object_filter_1.ObjectFilter.forKey(model_object_1.ModelObject.oidProp, referenceId);
                    this.oppositeValue = yield this.owner.container.objectStore.getOne(filter);
                }
                this.loaded = true;
            }
            return this.loaded;
        });
    }
}
exports.Reference = Reference;
class HasOne extends Reference {
    doLink(opposite) {
        this.loaded = true;
        this.oppositeValue = opposite;
        if (opposite) {
            this.owner.data[this.settings.roleProp] = opposite.data;
        }
    }
    doUnlink(opposite) {
        this.loaded = true;
        this.oppositeValue = null;
        this.owner.data[this.settings.roleProp] = null;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                let oppositeData = this.owner.data[this.settings.roleProp];
                if (oppositeData == null) {
                    this.oppositeValue = null;
                    this.loaded = true;
                }
                else {
                    let oppositeId = oppositeData[model_object_1.ModelObject.oidProp];
                    let opposite = this.owner.container.objectStore.getInMemById(oppositeId);
                    if (opposite == null) {
                        opposite = new this.settings.oppositeConstr(oppositeData);
                    }
                    this.oppositeValue = opposite;
                    this.loaded = true;
                }
            }
            return this.loaded;
        });
    }
}
exports.HasOne = HasOne;
//# sourceMappingURL=relation.js.map