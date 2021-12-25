import { Guild, Plugin } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';

@injectable()
class CheckGuildsPluginUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  async execute(guildIds: string[], pluginId: string): Promise<boolean> {
    const guilds = await this.guildRepository.findById(guildIds, { plugins: true });
    const pluginEnabledGuilds = guilds.some((guild) => this.hasPlugin(guild, pluginId));

    if (pluginEnabledGuilds) return true;
    return false;
  }

  private hasPlugin(guild: Guild & { plugins: Plugin[] }, pluginId: string) {
    return guild.plugins.some((plugin: Plugin) => {
      return plugin.id === pluginId;
    });
  }
}

export { CheckGuildsPluginUseCase };
