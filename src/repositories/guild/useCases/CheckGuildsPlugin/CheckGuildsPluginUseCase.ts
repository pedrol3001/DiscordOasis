import { Guild, Plugin } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';

@injectable()
class CheckGuildsPluginUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  async execute(guild_ids: string[], plugin_id: string): Promise<boolean> {
    const guilds = await this.guildRepository.findById(guild_ids, { plugins: true });
    const pluginEnabledGuilds = guilds.some((guild) => this.hasPlugin(guild, plugin_id));

    if (pluginEnabledGuilds) return true;
    return false;
  }

  private hasPlugin(guild: Guild & { plugins: Plugin[]; }, plugin_id: string) {
    return guild.plugins.some((plugin: Plugin) => {
      return plugin.id === plugin_id;
    });
  }
}

export { CheckGuildsPluginUseCase };
