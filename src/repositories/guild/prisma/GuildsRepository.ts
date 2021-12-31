import { Guild, Plugin, Prisma } from '@prisma/client';
import { prisma } from '../../../database/index';

import { ConditionalArray } from '../../../utils/types';
import { IGuildsRepository, includeGuild } from './IGuildsRepository';

class GuildsRepository implements IGuildsRepository {
  private repository: Prisma.GuildDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

  constructor() {
    this.repository = prisma.guild;
  }

  async create(guild: Guild) {
    return this.repository.create({ data: guild });
  }

  async update(guild: Guild) {
    await this.repository.update({ where: { id: guild.id }, data: guild });
  }

  async findById<T extends string | Array<string>>(id: T, include?: includeGuild) {
    const guilds = await this.repository.findMany({ where: { id: { in: id } }, include });
    return (guilds.length === 1 ? guilds : guilds[0]) as ConditionalArray<Guild & { plugins: Plugin[] }, T>;
  }
}

export { GuildsRepository };
