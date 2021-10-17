import Discord from 'discord.js';

import { CommandError } from 'oasis/commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class GroupsMicroHandler implements IMicroHandler {
  async handle(msg: Discord.Message): Promise<void> {
    // filter dmOnly handler
    if (msg.command?.group === 'dmOnly' && msg.channel.type !== 'dm') {
      const reply = 'You can only use this command inside dms';
      throw new CommandError(reply, msg.channel);
    }
  }
}

export { GroupsMicroHandler };
