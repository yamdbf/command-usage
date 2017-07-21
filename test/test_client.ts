import { Client, Logger } from 'yamdbf';
import { commandUsage } from '../bin/';
const config: any = require('./config.json');
const logger: Logger = Logger.instance();

class Test extends Client
{
	public constructor()
	{
		super({
			token: config.token,
			owner: config.owner,
			readyText: 'Test client ready',
			plugins: [commandUsage(config.logChannel)]
		});
	}
}
const test: Test = new Test();
test.start();

process.on('unhandledRejection', (err: any) => console.error(err));
