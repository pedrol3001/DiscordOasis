import { Plugin } from '@prisma/client';
import { ConditionalArray } from 'utils/types';

interface includePlugin {
  guilds: boolean;
}



interface IPluginsRepository {
  create: (data: Plugin) => Promise<Plugin>;
  findById: <T extends string | Array<string>>(id: T, include?: includePlugin) => Promise<ConditionalArray<Plugin & any, T>>;
  findByName: (name: string) => Promise<Plugin | undefined>;
}

export { IPluginsRepository, includePlugin };
