import '../repositories';

import { Client, Message, Guild, Interaction } from 'discord.js';
import { transport as TransportStream } from 'winston';
import { setDiscordRest } from '../services/rest';
import { prisma } from '../database';

import logger from '../services/logger';
import CommandHandler from './commands';
import PluginHandler from './plugins';

import { OasisError } from '../error/OasisError';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginHandler } from './plugins/IPluginHandler';
import { LoadGuildsController } from '../repositories/guild/useCases/LoadGuilds/LoadGuildsController';
import { CreateGuildController } from '../repositories/guild/useCases/CreateGuild/CreateGuildController';
import { ICommandHandler } from './commands/ICommandHandler';
import { SlashCommands } from '../services/slash';

class Oasis extends Client {
  readonly commandHandler: ICommandHandler;

  readonly pluginHandler: IPluginHandler;

  constructor(options: IOasisOptions) {
    super(options);
    const { plugins, commandsFolder, globalPrefix, loggerTransports } = options;

    this.commandHandler = new CommandHandler(commandsFolder, globalPrefix);
    this.pluginHandler = new PluginHandler(plugins ?? []);

    this.setDefaultCallbacks();
    this.setLogTransports(loggerTransports);
  }

  private setLogTransports(transports: TransportStream[] | undefined): void {
    transports?.forEach((transport) => {
      logger.add(transport);
    });
  }

  private async setupGuildsModels() {
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

  private async setupSlashCommands() {
    const { commands } = this.commandHandler;
    if (!this.application) {
      throw new OasisError('Application is invalid');
    }
    await SlashCommands.setCommands(this.application.id, commands);
  }

  private setDefaultCallbacks(): void {
    const { pluginHandler, commandHandler } = this;

    this.once('ready', async () => {
      if (!this.user || !this.application) {
        throw new OasisError('Client has not initialized properly');
      }

      await this.setupGuildsModels();
      await commandHandler.setup(this.application);
      await pluginHandler.setup(this.commandHandler);
      await this.setupSlashCommands();

      this.user.setActivity('Online!');
      logger.verbose('Ready!');
    });

    this.on('messageCreate', async (message: Message): Promise<void> => {
      await commandHandler.handle(message, pluginHandler);
    });

    this.on('interactionCreate', async (interaction: Interaction): Promise<void> => {
      await commandHandler.handle(interaction, pluginHandler);
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
      logger.debug(db);
    });
  }

  public async listen(token: string): Promise<void> {
    setDiscordRest(token);
    await prisma.$connect;
    this.login(token);
  }
}

export { Oasis };
