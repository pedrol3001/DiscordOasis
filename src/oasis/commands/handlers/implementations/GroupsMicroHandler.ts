import { CommandInteraction, Message } from 'discord.js';

import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class GroupsMicroHandler implements IMicroHandler {
  async handle(cmd: Message | CommandInteraction) {
    // filter dmOnly handler
    let reply;
    if (cmd.commandHolder?.group === 'dmOnly' && cmd.channel?.type !== 'DM') {
      reply = 'You can only use this command inside dms';
    }

    if (cmd.commandHolder?.group === 'guildOnly' && cmd.channel?.type !== 'GUILD_TEXT') {
      reply = 'You can only use this command inside dms';
    }

    if (!reply) return;
    throw new CommandError(reply, cmd.channel);
  }
}

export { GroupsMicroHandler };
