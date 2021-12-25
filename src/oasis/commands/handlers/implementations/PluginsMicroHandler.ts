import { Message } from 'discord.js';
import { CheckGuildsPluginController } from '../../../../repositories/guild/useCases/CheckGuildsPlugin/CheckGuildsPluginController';
import { CommandError } from '../../error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class PluginsMicroHandler implements IMicroHandler {
  async handle(msg: Message): Promise<void> {
    // plugins handler
    if (!msg.guild || !msg.command?.pluginId) return;
    const { pluginId } = msg.command;
    const hasPlugin = await CheckGuildsPluginController.handle([msg.guild?.id], pluginId);

    if (!hasPlugin) {
      const reply = `Your guild does not have this plugin enabled`;
      throw new CommandError(reply, msg.channel);
    }
  }
}

export { PluginsMicroHandler };
