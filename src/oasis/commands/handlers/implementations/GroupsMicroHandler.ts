import { CommandInteraction, Message } from 'discord.js';

import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class GroupsMicroHandler implements IMicroHandler {
  async handleMessage(message: Message) {
    // filter dmOnly handler
    if (message.command?.group !== 'dmOnly' || message.channel.type === 'DM') return;
    const reply = 'You can only use this command inside dms';
    throw new CommandError(reply, message.channel);
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { GroupsMicroHandler };
