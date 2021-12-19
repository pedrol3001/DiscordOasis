import { Guild, Plugin } from '@prisma/client';
import { ConditionalArray } from '../../../utils/types';

interface includePlugin {
  guilds: boolean;
}

interface IPluginsRepository {
  create: (plugin: Plugin) => Promise<Plugin>;
  findById: <T extends string | Array<string>>(id: T, include?: includePlugin) => Promise<ConditionalArray<Plugin & { guilds: Guild[]; }, T>>;
  findByName: (name: string) => Promise<Plugin | null>;
}

export { IPluginsRepository, includePlugin };
