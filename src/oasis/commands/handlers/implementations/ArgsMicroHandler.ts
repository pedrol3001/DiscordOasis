import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class ArgsMicroHandler implements IMicroHandler {
  async handleMessage(message: Message) {
    // filter args handler
    const validArgs = message.command?.args && message.args?.length !== 0;
    const withoutArgs = !message.command?.args && message.args?.length === 0;
    if (validArgs || withoutArgs) return;
    const reply =
      `You didn't provide any arguments, ${message.author}!\n` +
      `The proper usage would be: ` +
      `\`${message.guild?.prefix}${message.command?.name} ${message.command?.usage ? message.command.usage : ''}\``;
    throw new CommandError(reply, message.channel);
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { ArgsMicroHandler };
