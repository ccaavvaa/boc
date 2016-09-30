import { MessageRouter } from "./message-router";
import { ModelMetadata } from "./model-metadata";

export class Container {
    public readonly messageRouter: MessageRouter;
    public constructor(public readonly modelMetadata: ModelMetadata) {
        this.messageRouter = new MessageRouter(modelMetadata);
    }
}
