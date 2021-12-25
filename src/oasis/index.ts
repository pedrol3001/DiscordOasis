import '../repositories';

import { prisma } from '../database';

import CommandHandler from './commands';
import PluginsHandler from './plugins';

import { Client } from 'discord.js'
import { OasisError } from '../logs/OasisError';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginsHandler } from './plugins/IPluginsHandler';
import { Message } from 'discord.js';
import { Guild } from 'discord.js';
import { LoadGuildsController } from '../repositories/guild/useCases/LoadGuilds/LoadGuildsController';
import { CreateGuildController } from '../repositories/guild/useCases/CreateGuild/CreateGuildController';
import { OasisLog } from '../logs/OasisLog';

class Oasis extends Client {
  readonly plugins_handler: IPluginsHandler;

  constructor(options: IOasisOptions) {

    super(options);
    const { plugins, commands_folder, global_prefix} = options;

    this.command_handler = new CommandHandler(commands_folder, global_prefix);
    this.plugins_handler = new PluginsHandler(plugins || []);

    this.setDefaultCallbacks();
  }

  private async setupGuilds(){
    const guilds = this.guilds.cache;

    await Promise.all(
      guilds.map(async (guild) => {
        try{
          await CreateGuildController.handle({ id: guild.id, prefix: null });
          new OasisLog(`Created guild ${guild.name}. ${guild.id}`).log();
        }catch(err){
          new OasisLog(`Guild ${guild.id} already exists. Skipping.`).warn();
        }
      }),
    );

    await LoadGuildsController.handle(this);
    new OasisLog('Server configured !!').log();
  }

  private setDefaultCallbacks(): void {
    const pluginsHandler = this.plugins_handler;
    const commandHandler = this.command_handler;

    this.once('ready', async () => {

      await this.setupGuilds();
      await LoadGuildsController.handle(this);
      pluginsHandler.setup(this.command_handler);
      
      this.user?.setActivity('Online!');
      new OasisLog('Ready!').log();
    });

    this.on('messageCreate', async (msg: Message): Promise<void> => {
      await commandHandler.handle(msg, pluginsHandler);
    });

    this.on('guildCreate', async (guild: Guild): Promise<void> => {
      const newGuild = await CreateGuildController.handle(guild);
      new OasisLog(`Joined guild ${newGuild.id} called ${guild.name}`).log();
    });

    this.on('error', (err) => {
      if (err instanceof OasisError) err.log();
      else new OasisError('Unknown Error', err).log();
    });

    this.on('debug', (db) => console.info(db));
  }

  public async listen(token: string): Promise<void> {
    await prisma.$connect;
    this.login(token);
  }
}

export { Oasis };
