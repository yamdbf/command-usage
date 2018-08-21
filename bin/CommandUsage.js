"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yamdbf/core");
const discord_js_1 = require("discord.js");
const commandUsageFactory_1 = require("./commandUsageFactory");
const StorageKeys_1 = require("./StorageKeys");
const UsageStats_1 = require("./commands/UsageStats");
const path = require("path");
const { on, registerListeners } = core_1.ListenerUtil;
class CommandUsage extends core_1.Plugin {
    constructor(client, channel = '') {
        super();
        this.name = 'CommandUsage';
        this.sessionUsages = [];
        this.sessionUsed = {};
        this._client = client;
        this._channelID = channel;
    }
    async init(storage) {
        this._storage = storage;
        if (this._channelID) {
            this._channel = this._client.channels.get(this._channelID);
            if (!this._channel)
                throw new Error(`CommandUsage: Failed to find channel with ID '${this._channelID}'`);
        }
        this.commandsUsed = await this._storage.get(StorageKeys_1.StorageKeys.USAGE) || {};
        this._client.commands.registerExternal(new UsageStats_1.default(this));
        registerListeners(this._client, this);
        core_1.Lang.loadGroupLocalizationsFrom(path.resolve(__dirname, './locale'));
    }
    async _onCommand(name, args, exec, message) {
        if (this._channel)
            this.logCommand(name, args, exec, message);
        if (name !== 'usagestats')
            this._incrementCommand(name);
    }
    /**
     * Increment command usages for the given command,
     * filter out the old usages. Used internally by the
     * plugin and the `usagestats` command
     */
    _incrementCommand(name) {
        this.sessionUsages.push([name, Date.now()]);
        this.sessionUsages = this.sessionUsages.filter(u => (Date.now() - u[1]) < (1e3 * 60 * 60 * 24));
        this.commandsUsed[name] = (this.commandsUsed[name] || 0) + 1;
        this.sessionUsed[name] = (this.sessionUsed[name] || 0) + 1;
        this._storage.set(StorageKeys_1.StorageKeys.USAGE, this.commandsUsed);
    }
    /**
     * The total number of commands used since tracking began
     */
    get totalUsed() {
        return Object.keys(this.commandsUsed).map(a => this.commandsUsed[a]).reduce((a, b) => a + b);
    }
    /**
     * The total number of commands used this session
     */
    get totalSessionUsed() {
        return Object.keys(this.sessionUsed).map(a => this.sessionUsed[a]).reduce((a, b) => a + b);
    }
    /**
     * Log command usage to the log channel
     */
    async logCommand(name, args, exec, message) {
        const logChannel = this._channel;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(11854048)
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL());
        if (message.guild)
            embed.addField('Guild', message.guild.name, true);
        embed.addField('Exec time', `${exec.toFixed(2)}ms`, true)
            .addField('Command content', message.content)
            .setFooter(message.channel.type.toUpperCase(), this._client.user.avatarURL())
            .setTimestamp();
        logChannel.send({ embed });
    }
}
CommandUsage.default = commandUsageFactory_1.commandUsageFactory;
CommandUsage.commandUsage = commandUsageFactory_1.commandUsageFactory;
CommandUsage.CommandUsage = CommandUsage;
__decorate([
    on('command')
], CommandUsage.prototype, "_onCommand", null);
exports.CommandUsage = CommandUsage;

//# sourceMappingURL=CommandUsage.js.map
