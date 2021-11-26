import { Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class ArgsMicroHandler implements IMicroHandler {

  async handle(msg: Message): Promise<void> {
    // filter args handler
    if ((msg.command?.args && msg.args.length === 0) || (!msg.command?.args && msg.args.length !== 0)) {
      const reply =
        `You didn't provide any arguments, ${msg.author}!\n` +
        `The proper usage would be: ` +
        `\`${msg.guild?.prefix }${msg.command?.name} ${msg.command?.usage ? msg.command.usage : ''}\``;
      throw new CommandError(reply, msg.channel);
    }
  }
}

export { ArgsMicroHandler };
