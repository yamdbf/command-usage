import { Client, PluginConstructor } from '@yamdbf/core';
import { CommandUsage } from './CommandUsage';

export function commandUsageFactory(channel: string): PluginConstructor
{
	return class extends CommandUsage
	{
		public constructor(client: Client)
		{
			super(client, channel);
		}
	};
}
