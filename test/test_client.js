"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yamdbf_1 = require("yamdbf");
const _1 = require("../bin/");
const config = require('./config.json');
const logger = yamdbf_1.Logger.instance();
class Test extends yamdbf_1.Client {
    constructor() {
        super({
            token: config.token,
            owner: config.owner,
            readyText: 'Test client ready',
            plugins: [_1.commandUsage(config.logChannel)]
        });
    }
}
const test = new Test();
test.start();
process.on('unhandledRejection', (err) => console.error(err));
