import { Command, Message } from '@yamdbf/core';
import { CommandUsage } from '../CommandUsage';
import { MessageEmbed } from 'discord.js';

export default class extends Command
{
	private _plugin: CommandUsage;

	public constructor(plugin: CommandUsage)
	{
		super({
			name: 'usagestats',
			desc: 'Display command usage stats',
			usage: '<prefix>usagestats',
			ownerOnly: true,
			group: 'commandusage'
		});

		this._plugin = plugin;
	}

	public async action(message: Message, [all]: [string]): Promise<void>
	{
		this._plugin.incrementCommand(this.name);

		const oldest: number = this._plugin.sessionUsages[0][1] || Date.now();
		const diff: number = Date.now() - oldest < 6e4 ? 6e4 : Date.now() - oldest;
		const mins: number = Math.round(diff / 1e3 / 60);
		const perMin: number = this._plugin.totalSessionUsed / mins;

		let topFiveAllTime: [string, number][] = Object.keys(this._plugin.commandsUsed)
			.map(a => [a, this._plugin.commandsUsed[a]] as [string, number])
			.sort((a, b) => b[1] - a[1]);

		let topFiveSession: [string, number][] = Object.keys(this._plugin.sessionUsed)
			.map(a => [a, this._plugin.sessionUsed[a]] as [string, number])
			.sort((a, b) => b[1] - a[1]);

		if (all !== 'all')
		{
			topFiveSession = topFiveSession.slice(0, 5);
			topFiveAllTime = topFiveAllTime.slice(0, 5);
		}

		const xl: (str: string) => string = str => `\`\`\`xl\n${str}\n\`\`\``;
		const embed: MessageEmbed = new MessageEmbed()
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.addField('Per minute (session)', xl(perMin.toFixed(2)), true)
			.addField('Total (session)', xl(this._plugin.totalSessionUsed.toString()), true)
			.addField('Total (last hour)', xl(this._plugin.sessionUsages
				.filter(u => Date.now() - u[1] < 1e3 * 60 * 60).length.toString()), true)
			.addField(
				all === 'all' ? 'All time usages' : 'Top five (All time)',
				xl(topFiveAllTime.map(a => `${a[0]}:\n${a[1]}`).join('\n')),
				true
			)
			.addField(
				all === 'all' ? 'Session usages' : 'Top five (session)',
				xl(topFiveSession.map(a => `${a[0]}:\n${a[1]}`).join('\n')),
				true
			)
			.addField('Total (all time)', xl(this._plugin.totalUsed.toString()), true)
			.setFooter('Command usage')
			.setTimestamp();

		message.channel.send({ embed });
	}
}
