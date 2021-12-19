import { prisma } from '../../../database/index';
import { Guild, Plugin, Prisma } from '@prisma/client';
import { ConditionalArray } from '../../../utils/types';
import { includePlugin, IPluginsRepository } from './IPluginsRepository';

class PluginsRepository implements IPluginsRepository {
  private repository: Prisma.PluginDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

  constructor() {
    this.repository = prisma.plugin;
  }

  async create(plugin: Plugin){
    return await this.repository.create({ data: plugin });
  }

  async findById<T extends string | Array<string>>(id: T, include?: includePlugin){
    const plugins = await this.repository.findMany({ where: { id: { in: id } }, include });
    return (id instanceof Array ? plugins : plugins[0]) as ConditionalArray<Plugin & {guilds: Guild[]; }, T>;
  }

  async findByName(name: string){
    return await this.repository.findUnique({ where: { name } });
  }
}

export { PluginsRepository };
