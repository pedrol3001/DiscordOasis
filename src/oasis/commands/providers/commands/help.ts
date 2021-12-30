import { Message } from 'discord.js';
import { ICommand } from '../../../../interfaces/ICommand';

const command: ICommand = {
  name: 'help',
  aliases: ['h'],
  options: [{ type: 'STRING', name: 'plugin', description: 'Name of the plugin', required: false }],
  description: {
    command: 'Show all server or plugin specific commands',
  },
  group: 'global',

  async execute(msg: Message): Promise<void> {
    const dmChannel = await msg.author.createDM();
    await dmChannel.send('This is a test');
  },
};

export default command;
