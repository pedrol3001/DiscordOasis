
import { prisma } from '@database/index';
import { Plugin, Prisma } from '@prisma/client';
import { ConditionalArray } from 'utils/types';
import { includePlugin, IPluginsRepository } from './IPluginsRepository';

class PluginsRepository implements IPluginsRepository {
  private repository: Prisma.PluginDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;

  constructor() {
    this.repository = prisma.plugin;
  }

  async create(data: Plugin): Promise<Plugin> {
    return await this.repository.create({data});
  }

  async findById<T extends string | Array<string>>(id: T, include?: includePlugin ): Promise<ConditionalArray<Plugin, T>> {
    const plugins = await this.repository.findMany({where: {id: {in: id }}, include});
    return (id instanceof Array ? plugins : plugins[0]) as ConditionalArray<Plugin & any, T>;
  }

  async findByName(name: string): Promise<Plugin | undefined> {
    return await this.repository.findUnique({where:{ name }}) || undefined;
  }
}

export { PluginsRepository };
