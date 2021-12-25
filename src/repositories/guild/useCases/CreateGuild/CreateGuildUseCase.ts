import { Guild } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';

@injectable()
class CreateGuildUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  public async execute(data: Guild): Promise<Guild> {
    return this.guildRepository.create(data);
  }
}

export { CreateGuildUseCase };
