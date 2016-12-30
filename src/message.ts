import { RuleDeclaration } from './rule';
import * as _ from 'lodash';

export enum MessageType {
    Unknown = 0,
    ObjectInit = 1,
    PropChanged = 2,
    Link = 4,
    Unlink = 8,
    Saving = 16,
    Saved = 32,
}

export const messageTypes: Set<MessageType> = new Set<MessageType>([
    MessageType.ObjectInit,
    MessageType.PropChanged,
    MessageType.Saving,
    MessageType.Saved,
]);

export interface ITrigger {
    kind: MessageType;
    constr?: Function;
    body?: any;
};

export class Trigger implements ITrigger {
    public kind: MessageType;
    public constr: Function;
    public body?: any;

    public constructor(source: ITrigger) {
        if (source) {
            _.assign(this, source);
        }
    }

    public equals(other: ITrigger): boolean {
        return _.isEqual(this, other);
    }
}

export interface IRuleExecutionResult {
    error?: Error;
    message: Message;
    result?: any;
    rule: RuleDeclaration;
}

export class Message {
    public constructor(
        public readonly kind: MessageType,
        public readonly target: any,
        public readonly body: any = undefined,
        public readonly constr: Function = undefined) {
        if (constr === undefined) {
            this.constr = target.constructor;
        }
    }

    public match(trigger: ITrigger) {
        let m = _.isMatch(this, trigger);
        return m;
    }
}
