"use strict";
class PropertyType {
    constructor(owner, propName, settings) {
        this.owner = owner;
        this.propName = propName;
        this.settings = settings;
    }
}
exports.PropertyType = PropertyType;
class SimpleValue extends PropertyType {
    constructor(owner, propName, settings) {
        super(owner, propName, settings);
        if (settings) {
            this.adapter = settings.adapter;
        }
    }
    get value() {
        let value = this.owner.data[this.propName];
        return value;
    }
    set value(value) {
        this.owner.data[this.propName] = this.adapter ? this.adapter.adapt(value, this.settings) : value;
    }
}
exports.SimpleValue = SimpleValue;
exports.propertyDeclarations = [];
function DataType(...typeSettings) {
    return (target, propertyKey, descriptor) => {
        let propertyDeclaration = {
            constr: target.constructor,
            propName: propertyKey,
            typeSettings: typeSettings,
        };
        exports.propertyDeclarations.push(propertyDeclaration);
    };
}
exports.DataType = DataType;
//# sourceMappingURL=type.js.map