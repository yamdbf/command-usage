import { Client, Plugin, IPlugin, PluginConstructor, SharedProviderStorage } from '@yamdbf/core';
export declare class CommandUsage extends Plugin implements IPlugin {
    static readonly default: (channel: string) => PluginConstructor;
    static readonly commandUsage: (channel: string) => PluginConstructor;
    static readonly CommandUsage: PluginConstructor;
    readonly name: string;
    commandsUsed: {
        [command: string]: number;
    };
    sessionUsages: [string, number][];
    sessionUsed: {
        [command: string]: number;
    };
    private readonly _client;
    private readonly _channelID;
    private _storage;
    private _channel;
    constructor(client: Client, channel?: string);
    init(storage: SharedProviderStorage): Promise<void>;
    private _onCommand;
    /**
     * Increment command usages for the given command,
     * filter out the old usages. Used internally by the
     * plugin and the `usagestats` command
     */
    _incrementCommand(name: string): void;
    /**
     * The total number of commands used since tracking began
     */
    readonly totalUsed: number;
    /**
     * The total number of commands used this session
     */
    readonly totalSessionUsed: number;
    /**
     * Log command usage to the log channel
     */
    private logCommand;
}
