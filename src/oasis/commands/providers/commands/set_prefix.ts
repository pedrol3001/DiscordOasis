import { CommandInteraction, Message } from 'discord.js';
import { OasisError } from '../../../../error/OasisError';
import { ICommand } from '../../../../interfaces/ICommand';
import { SetGuildPrefixController } from '../../../../repositories/guild/useCases/SetGuildPrefix/SetGuildPrefixController';

const command: ICommand = {
  name: 'set prefix',
  aliases: [],
  options: [{ type: 'STRING', name: 'prefix', description: 'Desired server prefix', required: true }],
  description: {
    command: 'Set something',
    subCommand: 'Set the prefix for the server',
  },
  group: 'guildOnly',

  async execute(msg: Message | CommandInteraction): Promise<void> {
    const prefix = msg.args[0];
    if (!msg.guildId) throw new OasisError('Guild only command has no guildId');
    await SetGuildPrefixController.handle(msg.guildId, prefix);
    msg.reply(`Server prefix set to ${prefix}`);
  },
};

export default command;
