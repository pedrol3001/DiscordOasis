import { CommandInteraction, Message } from 'discord.js';

import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class GroupsMicroHandler implements IMicroHandler {
  async handle(cmd: Message | CommandInteraction) {
    // filter dmOnly handler
    if (cmd.commandHolder?.group !== 'dmOnly' || cmd.channel?.type === 'DM') return;
    const reply = 'You can only use this command inside dms';
    throw new CommandError(reply, cmd.channel);
  }
}

export { GroupsMicroHandler };
