import { MessageRouter } from "./message-router";
import { ModelMetadata } from "./model-metadata";
export declare class Container {
    readonly modelMetadata: ModelMetadata;
    readonly messageRouter: MessageRouter;
    constructor(modelMetadata: ModelMetadata);
}
