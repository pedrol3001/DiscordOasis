import { Plugin } from '@prisma/client';
import { IPluginsRepository } from '../../../plugin/prisma/IPluginsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetPluginByNameUseCase {
  constructor(
    @inject('PluginsRepository')
    private pluginRepository: IPluginsRepository,
  ) {}
  public async execute(name: string): Promise<Plugin | null> {
    return await this.pluginRepository.findByName(name);
  }
}

export { GetPluginByNameUseCase };
