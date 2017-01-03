import { Message, MessageType } from '../message';
import { MessageRouter } from '../message-router';
import { ModelMetadata } from '../model-metadata';
import { A } from './message-router.sample';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;

describe('Message router', () => {
    let router: MessageRouter;
    before(() => {
        let metadata: ModelMetadata = new ModelMetadata();
        metadata.registerClass(A);
        router = new MessageRouter(metadata);
    });
    it('should route :-)', () => {
        let test = async (): Promise<boolean> => {
            let instance = new A(router);
            let ret = await router.sendMessage(new Message(MessageType.ObjectInit, instance));
            expect(ret.length).equals(1);
            expect(await instance.get_a()).to.be.equal('initial a');
            expect(await instance.get_b()).to.be.equal(undefined);
            await instance.set_b('b');
            expect(await instance.get_c()).to.be.equal('initial a b');
            return true;
        };
        return test();
    });
});
