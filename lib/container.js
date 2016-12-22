"use strict";
const message_router_1 = require("./message-router");
class Container {
    constructor(settings) {
        this.modelMetadata = settings.modelMetadata;
        this.messageRouter = new message_router_1.MessageRouter(this.modelMetadata);
        this.objectStore = settings.objectStore;
    }
}
exports.Container = Container;
//# sourceMappingURL=container.js.map