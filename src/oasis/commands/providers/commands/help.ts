import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { get, groupBy } from 'lodash';
import { ICommand } from '../../../../interfaces/ICommand';
import { IPluginHandler } from '../../../plugins/IPluginHandler';
import { ICommandHandler } from '../../ICommandHandler';

const command: ICommand = {
  name: 'help',
  aliases: ['h'],
  options: [{ type: 'STRING', name: 'plugin', description: 'Name of the plugin', required: false }],
  description: {
    command: 'Show server or plugin specific commands',
  },
  group: 'global',

  async execute(msg: Message | CommandInteraction): Promise<void> {
    const author = msg instanceof CommandInteraction ? msg.user : msg.author;
    const dmChannel = await author.createDM();

    const commandHandler = get(msg.client, 'commandHandler') as ICommandHandler;
    const pluginHandler = get(msg.client, 'pluginHandler') as IPluginHandler;

    const pluginGroupedCommands = groupBy(commandHandler.commands, (cmd) => {
      return get(cmd, 'pluginId', null);
    });

    const pluginsKeys = Object.keys(pluginGroupedCommands);

    const commandsEmbed = pluginsKeys.map((pluginId: string) => {
      const commands = pluginGroupedCommands[pluginId];

      let title = 'Default';
      let color = '#0099ff';

      const plugin = pluginHandler.plugins.get(pluginId);
      if (plugin) {
        title = plugin.name;
        color = plugin.color;
      }

      const embed = new MessageEmbed()
        .setColor(color as ColorResolvable)
        .setTitle(title)
        .setDescription('List os commands');

      commands.forEach((commandMapper) => {
        const description = commandMapper.description.subCommand ?? commandMapper.description.command;
        embed.addField(commandMapper.name, description);
      });

      return embed;
    });

    if (msg.channel?.type === 'DM') {
      await dmChannel.send({ embeds: [...commandsEmbed] });
    } else if (msg.channel?.type === 'GUILD_TEXT') {
      const filteredEmbeds = commandsEmbed.filter((embed) => {
        return (
          embed.title === 'Default' ||
          msg.client.guilds.cache.some((guild) => guild.plugins.some((plugin) => plugin.name === embed.title))
        );
      });
      await dmChannel.send({ embeds: [...filteredEmbeds] });
    } else {
      await dmChannel.send({ content: `Channel not supported: ${msg.channel?.type}` });
    }

    msg.reply({ content: 'Help commands sent to your dm' });
  },
};

export default command;
