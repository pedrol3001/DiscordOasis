import { CommandInteraction, Message, User } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class ArgsMicroHandler implements IMicroHandler {
  async handle(cmd: Message | CommandInteraction) {
    // filter args handler
    const validArgs = cmd.command?.args && cmd.args?.length !== 0;
    const withoutArgs = !cmd.command?.args && cmd.args?.length === 0;
    if (validArgs || withoutArgs) return;

    const sender: User = cmd instanceof Message ? cmd.author : cmd.user;

    const reply =
      `You didn't provide any arguments, ${sender}!\n` +
      `The proper usage would be: ` +
      `\`${cmd.guild?.prefix}${cmd.command?.name} ${cmd.command?.usage ? cmd.command.usage : ''}\``;
    throw new CommandError(reply, cmd.channel);
  }
}

export { ArgsMicroHandler };
