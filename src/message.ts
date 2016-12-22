import * as _ from 'lodash';

export enum MessageType {
    Unknown = 0,
    ObjectInit = 1 << 0,
    PropChanged = 1 << 1,
    Link = 1 << 2,
    Unlink = 1 << 3,
    Saving = 1 << 5,
    Saved = 1 << 6,
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
