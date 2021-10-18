import { Plugin } from '@prisma/client';
import { container } from 'tsyringe';
import { OasisError } from 'log/OasisError';
import { GetPluginByNameUseCase } from './GetPluginByNameUseCase';

const GetPluginByNameController = {
  async handle(name: string): Promise<Plugin | never> {
    const getByNameUseCase = container.resolve(GetPluginByNameUseCase);
    const plugin = await getByNameUseCase.execute(name);
    if(plugin) return plugin;
    throw new OasisError("Can't find a plugin with this name");
  },
};

export { GetPluginByNameController };
