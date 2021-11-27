import { Plugin } from '@prisma/client';
import { container } from 'tsyringe';
import { GetPluginByNameUseCase } from './GetPluginByNameUseCase';

const GetPluginByNameController = {
  async handle(name: string): Promise<Plugin | null> {
    const getByNameUseCase = container.resolve(GetPluginByNameUseCase);
    return await getByNameUseCase.execute(name);
  },
};

export { GetPluginByNameController };
