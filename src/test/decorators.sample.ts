import { Rule } from "../decorators";
import { MessageType } from "../rule";
export class TestDecorator1 {
    @Rule({
        id: "TestDecorator1.rule1",
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
        id: "TestDecorator2.rule2",
        triggers: [
            { constr: TestDecorator1, kind: MessageType.ObjectInit },
            ],
    })
    public static rule2(target: any): Promise<void> {
        return Promise.resolve();
    }
}
