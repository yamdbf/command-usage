import { MessageEmbed } from 'discord.js';
import { Command, Message } from '@yamdbf/core';
import { CommandUsage } from '../CommandUsage';

export default class extends Command
{
	private plugin: CommandUsage;
	public constructor(plugin: CommandUsage)
	{
		super({
			name: 'usagestats',
			desc: 'Display command usage stats',
			usage: '<prefix>usagestats',
			ownerOnly: true,
			group: 'commandusage'
		});

		this.plugin = plugin;
	}

	public async action(message: Message, [all]: [string]): Promise<void>
	{
		this.plugin._incrementCommand(this.name);

		const oldest: number = this.plugin.sessionUsages[0][1] || Date.now();
		const diff: number = Date.now() - oldest < 6e4 ? 6e4 : Date.now() - oldest;
		const mins: number = Math.round(diff / 1e3 / 60);
		const perMin: number = this.plugin.totalSessionUsed / mins;

		let topFiveAllTime: [string, number][] = Object.keys(this.plugin.commandsUsed)
			.map(a => <[string, number]> [a, this.plugin.commandsUsed[a]])
			.sort((a, b) => b[1] - a[1]);

		let topFiveSession: [string, number][] = Object.keys(this.plugin.sessionUsed)
			.map(a => <[string, number]> [a, this.plugin.sessionUsed[a]])
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
			.addField('Total (session)', xl(this.plugin.totalSessionUsed.toString()), true)
			.addField('Total (last hour)', xl(this.plugin.sessionUsages
				.filter(u => (Date.now() - u[1]) < (1e3 * 60 * 60)).length.toString()), true)
			.addField(all === 'all' ? 'All time usages' : 'Top five (All time)',
				xl(topFiveAllTime.map(a => `${a[0]}:\n${a[1]}`).join('\n')), true)
			.addField(all === 'all' ? 'Session usages' : 'Top five (session)',
				xl(topFiveSession.map(a => `${a[0]}:\n${a[1]}`).join('\n')), true)
			.addField('Total (all time)', xl(this.plugin.totalUsed.toString()), true)
			.setFooter('Command usage')
			.setTimestamp();

		message.channel.send({ embed });
	}
}
