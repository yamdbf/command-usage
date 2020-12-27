import { CommandUsage } from './CommandUsage';
import { PluginConstructor } from '@yamdbf/core';

const commandUsage: (channel: string) => PluginConstructor = CommandUsage.commandUsage;
export { commandUsage };
export { CommandUsage };
export default commandUsage;
module.exports = CommandUsage;
