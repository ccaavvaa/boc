import { ModelObject } from './model-object';
import { SimpleType } from './type-adapter';
export interface ITypeOptions {
    constr?: any;
}
export declare abstract class PropertyType<T> {
    protected owner: ModelObject;
    protected propName: string;
    protected settings: any;
    abstract value: T;
    constructor(owner: ModelObject, propName: string, settings: any);
}
export declare class SimpleValue<T extends SimpleType> extends PropertyType<T> {
    protected adapter: any;
    value: T;
    constructor(owner: ModelObject, propName: string, settings: any);
}
export interface IPropertyDeclaration {
    constr: any;
    propName: string;
    typeSettings: any[];
}
export declare var propertyDeclarations: IPropertyDeclaration[];
export declare function DataType(...typeSettings: any[]): MethodDecorator;
