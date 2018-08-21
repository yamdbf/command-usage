"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandUsage_1 = require("./CommandUsage");
function commandUsageFactory(channel) {
    return class extends CommandUsage_1.CommandUsage {
        constructor(client) {
            super(client, channel);
        }
    };
}
exports.commandUsageFactory = commandUsageFactory;

//# sourceMappingURL=commandUsageFactory.js.map
