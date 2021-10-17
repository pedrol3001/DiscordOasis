import { container } from 'tsyringe';
import { CheckGuildsPluginUseCase } from './CheckGuildsPluginUseCase';

const CheckGuildsPluginController = {
  async handle(guild_ids: string[], plugin_id: string): Promise<boolean> {
    const checkGuildsPluginUseCase = container.resolve(CheckGuildsPluginUseCase);

    const result = await checkGuildsPluginUseCase.execute(guild_ids, plugin_id);

    return result;
  },
};

export { CheckGuildsPluginController };
