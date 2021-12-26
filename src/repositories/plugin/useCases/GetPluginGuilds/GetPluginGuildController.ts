import { Guild } from '@prisma/client';
import { container } from 'tsyringe';
import { GetPluginGuildsUseCase } from './GetPluginGuildsUseCase';

const GetPluginGuildController = {
  async handle(pluginId: string): Promise<Guild[]> {
    const getPluginGuildsUseCase = container.resolve(GetPluginGuildsUseCase);
    return getPluginGuildsUseCase.execute(pluginId);
  },
};

export { GetPluginGuildController };
