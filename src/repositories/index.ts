import { container } from 'tsyringe';

import { GuildsRepository } from '@guild/prisma/GuildsRepository';
import { IGuildsRepository } from '@guild/prisma/IGuildsRepository';
import { IPluginsRepository } from '@plugin/prisma/IPluginsRepository';
import { PluginsRepository } from '@plugin/prisma/PluginsRepository';

container.registerSingleton<IGuildsRepository>('GuildsRepository', GuildsRepository);
container.registerSingleton<IPluginsRepository>('PluginsRepository', PluginsRepository);
