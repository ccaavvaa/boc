"use strict";
const message_router_1 = require("./message-router");
class Container {
    constructor(modelMetadata) {
        this.modelMetadata = modelMetadata;
        this.messageRouter = new message_router_1.MessageRouter(modelMetadata);
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map