// import {Container} from './container';
import { ModelObject } from './model-object';
import { SimpleType } from './type-adapter';

export interface ITypeOptions {
    constr?: any;
}

export abstract class PropertyType<T> {
    public abstract get value(): T;
    public abstract set value(value: T);
    constructor(protected owner: ModelObject, protected propName: string, protected settings: any) {
    }
}

export class SimpleValue<T extends SimpleType> extends PropertyType<T> {
    protected adapter: any;
    public get value(): T {
        let value = this.owner.data[this.propName];
        return value;
    }

    public set value(value: T) {
        this.owner.data[this.propName] = this.adapter ? this.adapter.adapt(value, this.settings) : value;
    }

    constructor(owner: ModelObject, propName: string, settings: any) {
        super(owner, propName, settings);
        if (settings) {
            this.adapter = settings.adapter;
        }
    }
}

export interface IPropertyDeclaration {
    constr: any;
    propName: string;
    typeSettings: any[];
}

export var propertyDeclarations: IPropertyDeclaration[] = [];

export function DataType(...typeSettings: any[]): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        let propertyDeclaration: IPropertyDeclaration = {
            constr: target.constructor,
            propName: propertyKey,
            typeSettings: typeSettings,
        };
        propertyDeclarations.push(propertyDeclaration);
    };
}
