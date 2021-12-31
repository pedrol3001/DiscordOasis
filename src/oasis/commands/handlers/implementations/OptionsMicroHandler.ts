import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class OptionsMicroHandler implements IMicroHandler {
  async handle(cmd: Message | CommandInteraction) {
    const requiredArguments =
      cmd.commandHolder?.options.filter((option) => {
        return option.required === true;
      }) ?? [];

    if (cmd.args.length >= requiredArguments.length) return;
    const reply = 'Invalid arguments';
    throw new CommandError(reply, cmd.channel);
  }
}

export { OptionsMicroHandler };
