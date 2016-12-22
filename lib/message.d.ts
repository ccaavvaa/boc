export declare enum MessageType {
    Unknown = 0,
    ObjectInit = 1,
    PropChanged = 2,
    Link = 4,
    Unlink = 8,
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
    readonly target: any;
    readonly body: any;
    readonly constr: Function;
    constructor(kind: MessageType, target: any, body?: any, constr?: Function);
    match(trigger: ITrigger): boolean;
}
