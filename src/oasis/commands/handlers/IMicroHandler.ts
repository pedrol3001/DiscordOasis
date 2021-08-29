import Discord from 'discord.js';
import { IMicroHandlerExecutionMode } from '@commands/index';

interface IMicroHandler {
  handle(msg: Discord.Message): Promise<void>;
}

export { IMicroHandler };
