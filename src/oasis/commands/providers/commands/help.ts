import { ColorResolvable, Message, MessageEmbed } from 'discord.js';
import { get, groupBy } from 'lodash';
import { ICommand } from '../../../../interfaces/ICommand';
import { IPluginsHandler } from '../../../plugins/IPluginsHandler';
import { ICommandHandler } from '../../ICommandHandler';

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
    const commandHandler = get(msg.client, 'commandHandler') as ICommandHandler;
    const pluginsHandler = get(msg.client, 'pluginsHandler') as IPluginsHandler;

    const pluginGroupedCommands = groupBy(commandHandler.commands, (cmd) => {
      return get(cmd, 'pluginId', null);
    });

    const pluginsKeys = Object.keys(pluginGroupedCommands);

    const commandsEmbed = pluginsKeys.map((pluginId: string) => {
      const commands = pluginGroupedCommands[pluginId];

      let title = 'Default';
      let color = '#0099ff';

      const plugin = pluginsHandler.plugins.get(pluginId);
      if (plugin) {
        title = plugin.name;
        color = plugin.color;
      }

      const embed = new MessageEmbed()
        .setColor(color as ColorResolvable)
        .setTitle(title)
        .setDescription('List os commands');

      commands.forEach((commandMapper) => {
        const description = commandMapper.description.subCommand || commandMapper.description.command;
        embed.addField(commandMapper.name, description);
      });

      return embed;
    });

    if (msg.channel.type === 'DM') {
      await dmChannel.send({ embeds: [...commandsEmbed] });
    }
    if (msg.channel.type === 'GUILD_TEXT') {
      const filteredEmbeds = commandsEmbed.filter((embed) => {
        return (
          embed.title === 'Default' ||
          msg.client.guilds.cache.some((guild) => guild.plugins.some((plugin) => plugin.name === embed.title))
        );
      });
      await dmChannel.send({ embeds: [...filteredEmbeds] });
    } else {
      await dmChannel.send({ content: 'Channel not supported' });
    }
  },
};

export default command;
