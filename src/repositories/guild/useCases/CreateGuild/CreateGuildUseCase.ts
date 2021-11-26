import { Guild } from '@prisma/client';
import { IGuildsRepository } from '../../prisma/IGuildsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateGuildUseCase {
  constructor(
    @inject('GuildsRepository')
    private guildRepository: IGuildsRepository,
  ) {}

  public async execute(data: Guild): Promise<Guild> {
    return await this.guildRepository.create(data);
  }
}

export { CreateGuildUseCase };
