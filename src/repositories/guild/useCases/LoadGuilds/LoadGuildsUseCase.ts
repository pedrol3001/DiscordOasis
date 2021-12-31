import { Collection, Guild } from 'discord.js';
import { inject, injectable } from 'tsyringe';
import { Guild as GuildDb } from '@prisma/client';
import { assign } from 'lodash';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';

@injectable()
class LoadGuildsUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  public async execute(guilds: Collection<string, Guild>): Promise<void> {
    await Promise.all(
      guilds.map(async (guild) => {
        const guildFromDb: GuildDb = await this.guildRepository.findById(guild.id, {
          plugins: true,
        });
        if (guildFromDb) {
          assign(guild, guildFromDb);
        }
      }),
    );
  }
}

export { LoadGuildsUseCase };
