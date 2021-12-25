import { ClientOptions } from 'discord.js';
import { AbstractPlugin } from '../oasis/plugins/class/AbstractPlugin';

export interface IOasisOptions extends ClientOptions {
  plugins?: AbstractPlugin[];
  commandsFolder: string;
  globalPrefix: string;
}
