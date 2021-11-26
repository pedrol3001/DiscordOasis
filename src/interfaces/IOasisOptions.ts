import { ClientOptions } from 'discord.js';
import { AbstractPlugin } from '../oasis/plugins/class/AbstractPlugin';

export interface IOasisOptions extends ClientOptions {
  plugins?: AbstractPlugin[];
  commands_folder: string;
  global_prefix: string;
}
