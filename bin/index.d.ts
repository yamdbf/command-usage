import { PluginConstructor } from '@yamdbf/core';
import { CommandUsage } from './CommandUsage';
declare const commandUsage: (channel: string) => PluginConstructor;
export { commandUsage };
export { CommandUsage };
export default commandUsage;
