import { inject, injectable } from 'tsyringe';
import { IGuildsRepository } from '@guild/prisma/IGuildsRepository';

@injectable()
class CheckGuildsPluginUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  async execute(guild_ids: string[], plugin_id: string): Promise<boolean> {
    const guilds = await this.guildRepository.findById(guild_ids, {plugins: true});

    if (
      guilds.some((guild) => {
        return guild.plugins.some((plugin: any) => {
          return plugin.id === plugin_id;
        });
      })
    ) {
      return true;
    }
    return false;
  }
}

export { CheckGuildsPluginUseCase };
