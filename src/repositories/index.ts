import { container } from 'tsyringe';

import { GuildsRepository } from '../repositories/guild/prisma/GuildsRepository';
import { IGuildsRepository } from '../repositories/guild/prisma/IGuildsRepository';
import { IPluginsRepository } from '../repositories/plugin/prisma/IPluginsRepository';
import { PluginsRepository } from '../repositories/plugin/prisma/PluginsRepository';


container.registerSingleton<IGuildsRepository>('GuildsRepository', GuildsRepository);
container.registerSingleton<IPluginsRepository>('PluginsRepository', PluginsRepository);




