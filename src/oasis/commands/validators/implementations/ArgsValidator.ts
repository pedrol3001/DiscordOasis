import { CommandInteraction, Message } from 'discord.js';
import { OasisError } from '../../../../error/OasisError';
import { CommandError } from '../../error/CommandError';
import { IValidator } from '../IValidator';

class ArgsValidator implements IValidator {
  async validate(cmd: Message | CommandInteraction) {
    if (!cmd.commandHolder) throw new OasisError('Missing commandHolder for validation');

    if (cmd.args.length > cmd.commandHolder.options.length) {
      throw new CommandError(`More arguments than needed`, cmd.channel);
    }

    const requiredArguments =
      cmd.commandHolder.options.filter((option) => {
        return option.required === true;
      }) ?? [];

    if (cmd.args.length < requiredArguments.length) {
      throw new CommandError(`Missing required argument`, cmd.channel);
    }
  }
}

export { ArgsValidator };
