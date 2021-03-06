import { Guild, Plugin, Prisma } from '@prisma/client';

import { prisma } from '../../../database/index';
import { ConditionalArray } from '../../../utils/types';
import { includePlugin, IPluginsRepository } from './IPluginsRepository';

class PluginsRepository implements IPluginsRepository {
  private repository: Prisma.PluginDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

  constructor() {
    this.repository = prisma.plugin;
  }

  async create(plugin: Plugin) {
    return this.repository.create({ data: plugin });
  }

  async findById<T extends string | Array<string>>(id: T, include?: includePlugin) {
    const plugins = await this.repository.findMany({ where: { id: { in: id } }, include });
    return (id instanceof Array ? plugins : plugins[0]) as ConditionalArray<Plugin & { guilds: Guild[] }, T>;
  }

  async findByName(name: string) {
    return this.repository.findUnique({ where: { name } });
  }
}

export { PluginsRepository };
