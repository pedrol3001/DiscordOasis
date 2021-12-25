import { Plugin } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IPluginsRepository } from '../../../plugin/prisma/IPluginsRepository';

@injectable()
class GetPluginByNameUseCase {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @inject('PluginsRepository')
    private pluginRepository: IPluginsRepository,
  ) {}

  public async execute(name: string): Promise<Plugin | null> {
    return this.pluginRepository.findByName(name);
  }
}

export { GetPluginByNameUseCase };
