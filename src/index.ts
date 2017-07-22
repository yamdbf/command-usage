import { PluginConstructor } from 'yamdbf';
import { CommandUsage } from './CommandUsage';

const commandUsage: (channel: string) => PluginConstructor = CommandUsage.commandUsage;
export { commandUsage };
export { CommandUsage };
export default commandUsage;
module.exports = CommandUsage;
