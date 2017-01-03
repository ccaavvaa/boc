import { Rule } from '../decorators';
import { MessageType } from '../message';
export class TestDecorator1 {
    @Rule({
        id: 'TestDecorator1.rule1',
        triggers: [
            { kind: MessageType.ObjectInit },
        ],
    })
    public rule1(target: any): Promise<void> {
        return Promise.resolve();
    }
}

export class TestDecorator2 {
    @Rule({
        id: 'TestDecorator2.rule2',
        triggers: [
            { constr: TestDecorator1, kind: MessageType.ObjectInit },
            { constr: TestDecorator2, kind: MessageType.PropChanged },
        ],
    })
    public static rule2(target: TestDecorator1): Promise<void> {
        return Promise.resolve();
    }
}
