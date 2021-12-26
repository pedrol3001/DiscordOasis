import { Guild } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IPluginsRepository } from '../../prisma/IPluginsRepository';

@injectable()
class GetPluginGuildsUseCase {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('PluginsRepository')
    private pluginRepository: IPluginsRepository,
  ) {}

  public async execute(pluginId: string): Promise<Guild[]> {
    return (await this.pluginRepository.findById(pluginId)).guilds;
  }
}

export { GetPluginGuildsUseCase };
