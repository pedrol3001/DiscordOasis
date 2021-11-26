import { Collection, Guild } from 'discord.js';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class LoadGuildsUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  public async execute(guilds: Collection<string, Guild>): Promise<void> {
    await Promise.all(
      guilds.map(async (guild) => {

        const guildFromDb = await this.guildRepository.findById(guild.id);

        if (guildFromDb) {
          Object.assign(guild, guildFromDb);
        } else {
          Object.assign(guild, {id: guild.id});
        }
      }),
    );
  }
}

export { LoadGuildsUseCase };
