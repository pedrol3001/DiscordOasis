import { CommandInteraction, Message } from 'discord.js';

import { CommandError } from '../../error/CommandError';
import { IValidator } from '../IValidator';

class GroupsValidator implements IValidator {
  async validate(cmd: Message | CommandInteraction) {
    // filter dmOnly validators
    if (cmd.commandHolder?.group === 'dmOnly' && cmd.channel?.type !== 'DM') {
      throw new CommandError('You can only use this command inside dms', cmd.channel);
    }

    if (cmd.commandHolder?.group === 'guildOnly' && cmd.channel?.type !== 'GUILD_TEXT') {
      throw new CommandError('You can only use this command inside a server', cmd.channel);
    }
  }
}

export { GroupsValidator };
