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
        this.isComposition = false;
        this.isMany = false;
        this.isComposition = false;
        this.settings = settings;
        this.owner = owner;
        this.loaded = false;
    }
    get isLoaded() {
        return this.loaded;
    }
    getOppositeRole(opposite) {
        if (opposite && this.settings.oppositeRoleProp) {
            let role = opposite[this.settings.oppositeRoleProp];
            return role;
        }
        return null;
    }
    unload() {
        this.loaded = false;
    }
    notifyRelationChange(messageType, opposite, oldOpposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let oppositeRole = this.getOppositeRole(opposite);
            let oldOppositeRole = this.getOppositeRole(oldOpposite);
            let oldOppositeNotifier = oldOppositeRole ? () => oppositeRole.notifyRoleChange(message_1.MessageType.Unlink, this.owner) : null;
            let oppositeNotifier = oppositeRole ? () => oppositeRole.notifyRoleChange(messageType, this.owner) : null;
            let selfNotifier = () => this.notifyRoleChange(messageType, opposite);
            let roleNotifiers = this.settings.isSlave ?
                [oldOppositeNotifier, oppositeNotifier, selfNotifier] :
                [oldOppositeNotifier, selfNotifier, oppositeNotifier];
            let result = [];
            for (let notifier of roleNotifiers) {
                if (notifier) {
                    let executionsResult = yield notifier();
                    if (executionsResult) {
                        result = result.concat(executionsResult);
                    }
                }
            }
            return result;
        });
    }
    notifyRoleChange(messageType, opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = new message_1.Message(messageType, this.owner, {
                opposite: opposite,
                propName: this.settings.roleProp,
            });
            let propagationOK = yield this.owner.container.messageRouter.sendMessage(message);
            return propagationOK;
        });
    }
    internalLink(opposite, oldOpposite) {
        this.doLink(opposite);
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole) {
            oppositeRole.doLink(this.owner);
        }
        return this.notifyRelationChange(message_1.MessageType.Link, opposite, oldOpposite);
    }
    internalUnlink(opposite) {
        this.doUnlink(opposite);
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole) {
            oppositeRole.doUnlink(this.owner);
        }
        return this.notifyRelationChange(message_1.MessageType.Link, opposite);
    }
}
exports.Relation = Relation;
class OneBase extends Relation {
    constructor(owner, settings) {
        super(owner, settings);
    }
    unload() {
        super.unload();
        this.oppositeValue = null;
    }
    getOpposite() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            return this.oppositeValue;
        });
    }
    link(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentOpposite = this.loaded ? this.oppositeValue : yield this.getOpposite();
            if (currentOpposite === opposite) {
                return null;
            }
            let oppositeRole = this.getOppositeRole(opposite);
            if (oppositeRole && !oppositeRole.isMany) {
                let oppositeKey = opposite[oppositeRole.key];
                if (oppositeKey && oppositeKey !== this.owner[model_object_1.ModelObject.oidProp]) {
                    throw new Error('Opposite is linked to another object');
                }
            }
            if (currentOpposite) {
                if (this.isComposition) {
                    throw new Error('Opposite is set');
                }
                let currentOppositeRole = this.getOppositeRole(currentOpposite);
                if (currentOppositeRole) {
                    currentOppositeRole.doUnlink(this.owner);
                }
            }
            return this.internalLink(opposite, currentOpposite);
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
            return this.notifyRelationChange(message_1.MessageType.Unlink, opposite);
        });
    }
}
exports.OneBase = OneBase;
class Reference extends OneBase {
    get key() {
        if (this.loaded) {
            return this.oppositeValue.oid;
        }
        else if (this.settings.key) {
            return this.owner.data[this.settings.key];
        }
        else {
            return null;
        }
    }
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
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                let referenceId = this.owner.data[this.settings.key];
                if (referenceId == null) {
                    this.oppositeValue = null;
                }
                else {
                    let filter = object_filter_1.ObjectFilter.forKey(model_object_1.ModelObject.oidProp, referenceId);
                    this.oppositeValue = yield this.owner.container.getOne(this.settings.oppositeConstr, filter);
                }
                this.loaded = true;
            }
            return this.oppositeValue;
        });
    }
}
exports.Reference = Reference;
class HasOne extends Reference {
    constructor(owner, settings) {
        settings.isSlave = false;
        super(owner, settings);
        this.isComposition = true;
    }
    doLink(opposite) {
        this.loaded = true;
        this.oppositeValue = opposite;
        this.owner.data[this.settings.roleProp] = opposite ? opposite.data : null;
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
                    let opposite = yield this.owner.container.getObject(this.settings.oppositeConstr, oppositeData);
                    this.oppositeValue = opposite;
                    this.loaded = true;
                }
            }
            return this.oppositeValue;
        });
    }
}
exports.HasOne = HasOne;
class ManyBase extends Relation {
    constructor(owner, settings) {
        super(owner, settings);
        this.isMany = true;
        this.unload();
    }
    unload() {
        this.items = new Array();
        this.loaded = false;
    }
    toArray() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                yield this.load();
            }
            return this.items.slice(0);
        });
    }
    link(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.contains(opposite)) {
                return null;
            }
            let oppositeRole = this.getOppositeRole(opposite);
            if (oppositeRole && oppositeRole.key !== this.owner.oid) {
                throw new Error('Opposite is linked to another object');
            }
            return this.internalLink(opposite);
        });
    }
    unlink(opposite) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.contains(opposite)) {
                return null;
            }
            return this.internalUnlink(opposite);
        });
    }
    doLink(opposite) {
        if (this.contains(opposite)) {
            return;
        }
        if (this.loaded) {
            this.items.push(opposite);
        }
    }
    doUnlink(opposite) {
        if (this.contains(opposite)) {
            return;
        }
        if (this.loaded) {
            let index = this.items.indexOf(opposite);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
        }
    }
    contains(opposite) {
        if (opposite == null) {
            return false;
        }
        let oppositeRole = this.getOppositeRole(opposite);
        if (oppositeRole.key === this.owner.oid) {
            return true;
        }
        return false;
    }
}
exports.ManyBase = ManyBase;
class Many extends ManyBase {
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                let filter = object_filter_1.ObjectFilter.forKey(this.settings.oppositeKey, this.owner.oid);
                this.items = yield this.owner.container.getMany(this.settings.oppositeConstr, filter);
                this.loaded = true;
            }
        });
    }
}
exports.Many = Many;
class HasMany extends ManyBase {
    constructor(owner, settings) {
        super(owner, settings);
        this.isMany = true;
        this.isComposition = true;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                let relationData = this.owner.data[this.settings.roleProp];
                if (!relationData) {
                    this.items = [];
                }
                else {
                    for (let item of relationData) {
                        let opposite = yield this.owner.container.getObject(this.settings.oppositeConstr, item);
                        this.items.push(opposite);
                    }
                }
                this.loaded = true;
            }
        });
    }
    doLink(opposite) {
        super.doLink(opposite);
        let relationData = this.owner.data[this.settings.roleProp];
        if (!relationData) {
            this.owner.data[this.settings.roleProp] = [opposite.data];
        }
        else {
            relationData.push(opposite.data);
        }
    }
    doUnlink(opposite) {
        super.doUnlink(opposite);
        let relationData = this.owner.data[this.settings.roleProp];
        if (relationData) {
            let index = relationData.indexOf(opposite);
            if (index >= 0) {
                relationData.splice(index, 1);
            }
        }
    }
}
exports.HasMany = HasMany;
//# sourceMappingURL=relation.js.map