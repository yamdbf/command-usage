import { Client, Plugin, IPlugin, PluginConstructor, ListenerUtil, Lang, SharedProviderStorage } from '@yamdbf/core';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import { commandUsageFactory } from './commandUsageFactory';
import { StorageKeys } from './StorageKeys';
import UsageStats from './commands/UsageStats';
import * as path from 'path';

const { on, registerListeners } = ListenerUtil;

export class CommandUsage extends Plugin implements IPlugin
{
	public static readonly default: (channel: string) => PluginConstructor = commandUsageFactory;
	public static readonly commandUsage: (channel: string) => PluginConstructor = commandUsageFactory;
	public static readonly CommandUsage: PluginConstructor = CommandUsage;

	public readonly name: string = 'CommandUsage';

	public commandsUsed: { [command: string]: number };
	public sessionUsages: [string, number][] = [];
	public sessionUsed: { [command: string]: number } = {};

	private readonly _client: Client;
	private readonly _channelID: string;
	private _storage: SharedProviderStorage;
	private _channel: TextChannel;

	public constructor(client: Client, channel: string = '')
	{
		super();
		this._client = client;
		this._channelID = channel;
	}

	public async init(storage: SharedProviderStorage): Promise<void>
	{
		this._storage = storage;

		if (this._channelID)
		{
			this._channel = <TextChannel> this._client.channels.get(this._channelID);
			if (!this._channel) throw new Error(`CommandUsage: Failed to find channel with ID '${this._channelID}'`);
		}

		this.commandsUsed = await this._storage.get(StorageKeys.USAGE) || {};

		this._client.commands.registerExternal(new UsageStats(this));
		registerListeners(this._client, this);

		Lang.loadGroupLocalizationsFrom(path.resolve(__dirname, './locale'));
	}

	@on('command')
	private async _onCommand(name: string, args: any[], exec: number, message: Message): Promise<void>
	{
		if (this._channel) this.logCommand(name, args, exec, message);
		if (name !== 'usagestats') this._incrementCommand(name);
	}

	/**
	 * Increment command usages for the given command,
	 * filter out the old usages. Used internally by the
	 * plugin and the `usagestats` command
	 */
	public _incrementCommand(name: string): void
	{
		this.sessionUsages.push([name, Date.now()]);
		this.sessionUsages = this.sessionUsages.filter(u => (Date.now() - u[1]) < (1e3 * 60 * 60 * 24));
		this.commandsUsed[name] = (this.commandsUsed[name] || 0) + 1;
		this.sessionUsed[name] = (this.sessionUsed[name] || 0) + 1;

		this._storage.set(StorageKeys.USAGE, this.commandsUsed);
	}

	/**
	 * The total number of commands used since tracking began
	 */
	public get totalUsed(): number
	{
		return Object.keys(this.commandsUsed).map(a => this.commandsUsed[a]).reduce((a, b) => a + b);
	}

	/**
	 * The total number of commands used this session
	 */
	public get totalSessionUsed(): number
	{
		return Object.keys(this.sessionUsed).map(a => this.sessionUsed[a]).reduce((a, b) => a + b);
	}

	/**
	 * Log command usage to the log channel
	 */
	private async logCommand(name: string, args: any[], exec: number, message: Message): Promise<void>
	{
		const logChannel: TextChannel = <TextChannel> this._channel;
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(11854048)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.avatarURL());

		if (message.guild) embed.addField('Guild', message.guild.name, true);

		embed.addField('Exec time', `${exec.toFixed(2)}ms`, true)
			.addField('Command content', message.content)
			.setFooter(message.channel.type.toUpperCase(), this._client.user.avatarURL())
			.setTimestamp();

		logChannel.send({ embed });
	}
}
