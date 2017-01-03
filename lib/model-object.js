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
class ModelObject {
    constructor(parentContainer) {
        this.container = parentContainer;
        this.createRoles();
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
        if (!this.data) {
            return undefined;
        }
        return this.data[propName];
    }
    setProp(propName, value) {
        let oldValue = this.data[propName];
        this.data[propName] = value;
        let message = new message_1.Message(message_1.MessageType.PropChanged, this, {
            oldValue: oldValue,
            propName: propName,
        });
        return this.sendMessage(message);
    }
    roleProp(roleName, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = this.roles[roleName];
            if (value === null) {
                yield role.unlink();
            }
            else if (value) {
                yield role.link(value);
            }
            return role.getOpposite();
        });
    }
    createRoles() {
        this.roles = {};
        let ci = this.container.modelMetadata.getClassInfo(this.constructor);
        if (ci.roles) {
            for (let roleDeclaration of ci.roles) {
                this.roles[roleDeclaration.settings.roleProp] =
                    new roleDeclaration.constr(this, roleDeclaration.settings);
            }
        }
    }
}
ModelObject.oidProp = 'oid';
exports.ModelObject = ModelObject;
//# sourceMappingURL=model-object.js.map