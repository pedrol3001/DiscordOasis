import { CommandInteraction, Message } from 'discord.js';
import { has, get } from 'lodash';
import { CheckGuildsPluginController } from '../../../../repositories/guild/useCases/CheckGuildsPlugin/CheckGuildsPluginController';
import { CommandError } from '../../error/CommandError';
import { IValidator } from '../IValidator';

class PluginsValidator implements IValidator {
  async validate(cmd: Message | CommandInteraction) {
    // plugins handler
    if (!cmd.guild || !has(cmd.commandHolder, 'pluginId')) return;
    const pluginId = get(cmd.commandHolder, 'pluginId');
    const hasPlugin = await CheckGuildsPluginController.handle([cmd.guild?.id], pluginId);

    if (!hasPlugin && pluginId) {
      const reply = `Your guild does not have this plugin enabled`;
      throw new CommandError(reply, cmd.channel);
    }
  }
}

export { PluginsValidator };
