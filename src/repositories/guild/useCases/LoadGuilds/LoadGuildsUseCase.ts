import { Collection, Guild } from 'discord.js';
import { inject, injectable } from 'tsyringe';
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const guildFromDb: any = await this.guildRepository.findById(guild.id, { plugins: true });
        if (guildFromDb) {
          Object.assign(guild, ...guildFromDb);
        }
      }),
    );
  }
}

export { LoadGuildsUseCase };
