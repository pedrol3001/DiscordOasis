import { inject, injectable } from 'tsyringe';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';

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
    await this.guildRepository.update({ ...guild, prefix });
  }
}

export { SetGuildPrefixUseCase };
