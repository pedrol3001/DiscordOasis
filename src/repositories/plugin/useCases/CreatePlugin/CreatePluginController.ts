import { Plugin } from '@prisma/client';
import { container } from 'tsyringe';
import { CreateGuildUseCase, NewPlugin } from './CreatePluginUseCase';

const CreatePluginController = {
  async handle(data: NewPlugin): Promise<Plugin> {
    const saveGuildUseCase = container.resolve(CreateGuildUseCase);
    return saveGuildUseCase.execute(data);
  },
};

export { CreatePluginController };
