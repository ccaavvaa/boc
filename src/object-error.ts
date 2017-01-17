import { MessageRouterStackElement } from './message-router';
import { ClassInfo } from './model-metadata';
import { ModelObject } from './model-object';

import * as _ from 'lodash';

export interface IErrorInfo {
    error: Error;
    raisedBy?: MessageRouterStackElement;
    target: ModelObject;
    key: string;
}

export class ErrorInfos {
    public owner: ModelObject;

    public readonly errors: Map<string, IErrorInfo[]> = new Map<string, IErrorInfo[]>();

    public constructor(owner: ModelObject) {
        this.owner = owner;
    }

    public get hasErrors(): boolean {
        for (let key of this.errors.keys()) {
            let errors = this.errors.get(key);
            if (errors && errors.length > 0) {
                return true;
            }
        }
        return false;
    }

    public getAllErrors(): IErrorInfo[] {
        let result: IErrorInfo[] = [];
        for (let entry of this.errors.entries()) {
            result = result.concat(entry[1]);
        }
        return result;
    }

    public clearErrors(key?: string): void {
        key = this.getPropOrObjectKey(key);

        let errors = this.errors.get(key);
        if (errors) {
            for (let error of errors) {
                this.clearError(error);
            }
        }
    }

    public clearError(errorInfo: IErrorInfo) {
        let errors = this.errors.get(errorInfo.key);
        if (errors) {
            _.remove(errors, v => v === errorInfo);
        }

        this.owner.container.messageRouter.clearError(errorInfo);
        if (errors.length === 0) {
            this.errors.delete(errorInfo.key);
        }
    }

    public clear(): void {
        for (let key of this.errors.keys()) {
            this.clearErrors(key);
        }
    }

    public addError(error: Error, key?: string) {
        key = this.getPropOrObjectKey(key);
        let stackElement = this.owner.container.messageRouter.currentStackElement;
        let errorInfo = {
            error: error,
            raisedBy: stackElement,
            target: this.owner,
            key: key,
        };
        if (stackElement) {
            this.owner.container.messageRouter.addError(errorInfo);
        }

        let errors = this.errors.get(key);
        if (!errors) {
            this.errors.set(key, [errorInfo]);
        } else {
            errors.push(errorInfo);
        }
    }

    private getPropOrObjectKey(key: string): string {
        if (key === undefined || key === null) {
            key = ClassInfo.objectTargetName;
        }
        return key;
    }
}
