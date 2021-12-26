import { CommandInteraction, Message } from 'discord.js';
import { has, get } from 'lodash';
import { CheckGuildsPluginController } from '../../../../repositories/guild/useCases/CheckGuildsPlugin/CheckGuildsPluginController';
import { CommandError } from '../../error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class PluginsMicroHandler implements IMicroHandler {
  async handleMessage(message: Message) {
    // plugins handler
    if (!message.guild || !has(message.command, 'pluginId')) return;
    const pluginId = get(message.command, 'pluginId');
    const hasPlugin = await CheckGuildsPluginController.handle([message.guild?.id], pluginId);

    if (!hasPlugin) {
      const reply = `Your guild does not have this plugin enabled`;
      throw new CommandError(reply, message.channel);
    }
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { PluginsMicroHandler };
