import { Guild } from '@prisma/client';
import { container } from 'tsyringe';
import { CreateGuildUseCase } from './CreateGuildUseCase';

const CreateGuildController = {
  async handle(data: Guild): Promise<Guild> {
    const saveGuildUseCase = container.resolve(CreateGuildUseCase);
    return saveGuildUseCase.execute(data);
  },
};

export { CreateGuildController };
