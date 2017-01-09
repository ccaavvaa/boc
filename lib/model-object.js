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
const relation_1 = require("./relation");
class ModelObject {
    constructor(parentContainer) {
        this.container = parentContainer;
        let ci = this.container.modelMetadata.getClassInfo(this.constructor);
        this.createProperties(ci);
        this.createRoles(ci);
    }
    get oid() {
        return this.data.oid;
    }
    init(data, isNew) {
        this.data = data;
        this.container.store(this);
        let message = new message_1.Message(message_1.MessageType.ObjectInit, this, {
            isNew: isNew,
        });
        return this.container.messageRouter.sendMessage(message);
    }
    initNew(oid) {
        let data = {};
        data[ModelObject.oidProp] = oid;
        return this.init(data, true);
    }
    sendMessage(message) {
        return this.container.messageRouter.sendMessage(message);
    }
    getProp(propName) {
        let propObject = this.properties[propName];
        if (propObject) {
            return propObject.value;
        }
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }
    setProp(propName, value) {
        let oldValue = this.data[propName];
        let propObject = this.properties[propName];
        if (propObject) {
            propObject.value = value;
        }
        else {
            this.data[propName] = value;
        }
        let message = new message_1.Message(message_1.MessageType.PropChanged, this, {
            newValue: this.data[propName],
            oldValue: oldValue,
            propName: propName,
        });
        return this.sendMessage(message);
    }
    prop(propName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== undefined) {
                yield this.setProp(propName, value);
            }
            return this.getProp(propName);
        });
    }
    getRoleProp(roleName) {
        let role = this.roles[roleName];
        return role.getOpposite();
    }
    setRoleProp(roleName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = this.roles[roleName];
            if (value) {
                return role.link(value);
            }
            else {
                return role.unlink();
            }
        });
    }
    createRoles(ci) {
        this.roles = {};
        if (ci.roles) {
            for (let roleDeclaration of ci.roles) {
                let role = new roleDeclaration.constr(this, roleDeclaration.settings);
                if (role.constructor === relation_1.HasMany || role.constructor === relation_1.Many) {
                    let that = this;
                    that[roleDeclaration.settings.roleProp] = role;
                }
                else {
                    this.roles[roleDeclaration.settings.roleProp] = role;
                }
            }
        }
    }
    createProperties(ci) {
        this.properties = {};
        if (ci.properties) {
            for (let propertyDeclaration of ci.properties) {
                let typeSettings = this.container.modelMetadata.mergeTypeSettings(propertyDeclaration.typeSettings);
                this.properties[propertyDeclaration.propName] =
                    new typeSettings.constr(this, propertyDeclaration.propName, typeSettings);
            }
        }
    }
}
ModelObject.oidProp = 'oid';
exports.ModelObject = ModelObject;
//# sourceMappingURL=model-object.js.map