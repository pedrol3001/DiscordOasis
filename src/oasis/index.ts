import '../repositories';

import { Client, Message, Guild, Interaction } from 'discord.js';
import { transport as TransportStream } from 'winston';
import { prisma } from '../database';

import logger from '../services/logger';
import CommandHandler from './commands';
import PluginsHandler from './plugins';

import { OasisError } from '../error/OasisError';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginsHandler } from './plugins/IPluginsHandler';
import { LoadGuildsController } from '../repositories/guild/useCases/LoadGuilds/LoadGuildsController';
import { CreateGuildController } from '../repositories/guild/useCases/CreateGuild/CreateGuildController';

class Oasis extends Client {
  readonly pluginsHandler: IPluginsHandler;

  constructor(options: IOasisOptions) {
    super(options);
    const { plugins, commandsFolder, globalPrefix, loggerTransports } = options;

    this.commandHandler = new CommandHandler(commandsFolder, globalPrefix);
    this.pluginsHandler = new PluginsHandler(plugins || []);

    this.setDefaultCallbacks();
    this.setLogTransports(loggerTransports);
  }

  private setLogTransports(transports: TransportStream[] | undefined): void {
    transports?.forEach((transport) => {
      logger.add(transport);
    });
  }

  private async setupGuilds() {
    const guilds = this.guilds.cache;

    await Promise.all(
      guilds.map(async (guild) => {
        try {
          await CreateGuildController.handle({ id: guild.id, prefix: null });
          logger.info(`Created guild ${guild.name}. ${guild.id}`);
        } catch (err) {
          logger.warn(`Guild ${guild.id} already exists. Skipping.`);
        }
      }),
    );

    await LoadGuildsController.handle(this);
    logger.verbose('Server configured !!');
  }

  private setDefaultCallbacks(): void {
    const { pluginsHandler, commandHandler } = this;

    this.once('ready', async () => {
      await this.setupGuilds();
      await LoadGuildsController.handle(this);
      pluginsHandler.setup(this.commandHandler);

      this.user?.setActivity('Online!');
      logger.verbose('Ready!');
    });

    this.on('messageCreate', async (message: Message): Promise<void> => {
      await commandHandler.handleMessage(message, pluginsHandler);
    });

    this.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
      await commandHandler.handleInteraction(interaction, pluginsHandler);
    });

    this.on('guildCreate', async (guild: Guild): Promise<void> => {
      const newGuild = await CreateGuildController.handle(guild);
      logger.info(`Joined guild ${newGuild.id} called ${guild.name}`);
    });

    this.on('error', (err) => {
      if (err instanceof OasisError) err.log();
      else logger.error('Unknown Error', err);
    });

    this.on('debug', (db) => {
      logger.info(db);
    });
  }

  public async listen(token: string): Promise<void> {
    await prisma.$connect;
    this.login(token);
  }
}

export { Oasis };
