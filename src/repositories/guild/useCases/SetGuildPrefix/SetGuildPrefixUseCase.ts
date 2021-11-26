import { IGuildsRepository } from '../../prisma/IGuildsRepository';
import { inject, injectable } from 'tsyringe';

interface IPrefixChange {
  id: string;
  prefix: string;
}

@injectable()
class SetGuildPrefixUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  public async execute({ id, prefix }: IPrefixChange): Promise<void> {
    const guild = await this.guildRepository.findById(id);

    guild.prefix = prefix;

    await this.guildRepository.update(guild);
  }
}

export { SetGuildPrefixUseCase };
