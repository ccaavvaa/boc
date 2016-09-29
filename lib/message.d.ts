/// <reference types="lodash" />
export declare enum MessageType {
    Unknown = 0,
    ObjectInit = 1,
    PropChanged = 2,
    Saving = 32,
    Saved = 64,
}
export declare const messageTypes: Set<MessageType>;
export interface ITrigger {
    kind: MessageType;
    constr?: Function;
    body?: any;
}
export declare class Trigger implements ITrigger {
    kind: MessageType;
    constr: Function;
    body?: any;
    constructor(source: ITrigger);
    equals(other: ITrigger): boolean;
}
export declare class Message {
    readonly kind: MessageType;
    readonly constr: Function;
    readonly target: any;
    readonly body: any;
    constructor(kind: MessageType, constr: Function, target: any, body?: any);
    match(trigger: ITrigger): boolean;
}
