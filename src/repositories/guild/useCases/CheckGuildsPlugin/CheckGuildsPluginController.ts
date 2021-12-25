import { container } from 'tsyringe';
import { CheckGuildsPluginUseCase } from './CheckGuildsPluginUseCase';

const CheckGuildsPluginController = {
  async handle(guildIds: string[], pluginId: string): Promise<boolean> {
    const checkGuildsPluginUseCase = container.resolve(CheckGuildsPluginUseCase);
    const result = await checkGuildsPluginUseCase.execute(guildIds, pluginId);
    return result;
  },
};

export { CheckGuildsPluginController };
