import { inject, injectable } from 'tsyringe';
import { Plugin } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IPluginsRepository } from '../../../plugin/prisma/IPluginsRepository';

interface NewPlugin extends Omit<Plugin, 'id'> {
  id?: string;
}

@injectable()
class CreateGuildUseCase {
  constructor(
    @inject('PluginsRepository')
    private pluginRepository: IPluginsRepository,
  ) {}
  public async execute(data: NewPlugin): Promise<Plugin> {
    if (!data.id) data.id = uuidv4();
    return await this.pluginRepository.create(data as Plugin);
  }
}

export { CreateGuildUseCase, NewPlugin };
