import { Guild, Plugin } from '@prisma/client';
import { ConditionalArray } from '../../../utils/types';

interface includeGuild {
  plugins: boolean;
}
interface IGuildsRepository {
  create: (data: Guild) => Promise<Guild>;
  findById: <T extends string | Array<string>>(
    id: T,
    includes?: includeGuild,
  ) => Promise<ConditionalArray<Guild & { plugins: Plugin[] }, T>>;
  update: (data: Guild) => Promise<void>;
}

export { IGuildsRepository, includeGuild };
