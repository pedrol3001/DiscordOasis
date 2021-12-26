import { transport as TransportStream } from 'winston';

import { ClientOptions } from 'discord.js';
import { AbstractPlugin } from '../oasis/plugins/class/AbstractPlugin';

export interface IOasisOptions extends ClientOptions {
  commandsFolder: string;
  globalPrefix: string;
  plugins?: AbstractPlugin[];
  loggerTransports?: TransportStream[];
}
