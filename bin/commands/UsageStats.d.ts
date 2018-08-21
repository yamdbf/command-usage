import { Command, Message } from '@yamdbf/core';
import { CommandUsage } from '../CommandUsage';
export default class extends Command {
    private plugin;
    constructor(plugin: CommandUsage);
    action(message: Message, [all]: [string]): Promise<void>;
}
