import { MessageRouterStackElement } from './message-router';
import { ModelObject } from './model-object';
export interface IErrorInfo {
    error: Error;
    raisedBy?: MessageRouterStackElement;
    target: ModelObject;
    key: string;
}
export declare class ErrorInfos {
    owner: ModelObject;
    readonly errors: Map<string, IErrorInfo[]>;
    constructor(owner: ModelObject);
    readonly hasErrors: boolean;
    getAllErrors(): IErrorInfo[];
    clearErrors(key?: string): void;
    clearError(errorInfo: IErrorInfo): void;
    clear(): void;
    addError(error: Error, key?: string): void;
    private getPropOrObjectKey(key);
}
