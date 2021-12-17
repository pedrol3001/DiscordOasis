import '../repositories';

import { prisma } from '../database';

import CommandHandler from './commands';
import PluginsHandler from './plugins';

import { Client } from 'discord.js'
import { OasisError } from '../logs/OasisError';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginsHandler } from '../interfaces/IPluginsHandler';
import { Message } from 'discord.js';
import { Guild } from 'discord.js';
import { LoadGuildsController } from '../repositories/guild/useCases/LoadGuilds/LoadGuildsController';
import { CreateGuildController } from '../repositories/guild/useCases/CreateGuild/CreateGuildController';


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
          console.log(`Created guild ${guild.name}. ${guild.id}`);
        }catch(err){
          console.warn(`Guild ${guild.id} already exists. Skipping.`);
        }
      }),
    );

    await LoadGuildsController.handle(this);
    console.log('Server configured !!');
  }

  private setDefaultCallbacks(): void {
    const pluginsHandler = this.plugins_handler;
    const commandHandler = this.command_handler;

    this.once('ready', async () => {

      await this.setupGuilds();
      await LoadGuildsController.handle(this);
      pluginsHandler.setup(this.command_handler);
      
      this.user?.setActivity('Online!');
      console.log('Ready!');
    });

    this.on('message', async (msg: Message): Promise<void> => {
      await commandHandler.handle(msg, pluginsHandler);
    });

    this.on('guildCreate', async (guild: Guild): Promise<void> => {
      const newGuild = await CreateGuildController.handle(guild);
      console.log(`Joined guild ${newGuild.id} called ${guild.name}`);
    });

    this.on('error', (err) => {
      if (err instanceof OasisError) err.log();
      else console.error(err);
    });

    this.on('debug', (db) => console.info(db));
  }

  public async listen(token: string): Promise<void> {
    await prisma.$connect;
    this.login(token);
  }
}

export { Oasis };
