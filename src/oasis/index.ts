import '@repositories/index';

import { prisma } from '@database/index';

import CommandHandler from 'oasis/commands/index';
import PluginsHandler from 'oasis/plugins/index';

import { Client } from 'discord.js'
import { OasisError } from 'log/OasisError';
import { IOasisOptions } from '@interfaces/IOasisOptions';
import { IPluginsHanlder } from '@interfaces/IPluginsHandler';
import { Message } from 'discord.js';
import { Guild } from 'discord.js';
import { LoadGuildsController } from '@guild/useCases/LoadGuilds/LoadGuildsController';
import { CreateGuildController } from '@guild/useCases/CreateGuild/CreateGuildController';


class Oasis extends Client {
  readonly plugins_handler: IPluginsHanlder;

  constructor(options: IOasisOptions) {

    super(options);
    const { plugins, commands_folder, global_prefix} = options;

    this.command_handler = new CommandHandler(commands_folder, global_prefix);
    this.plugins_handler = new PluginsHandler(plugins);

    this.setDefaultCallbacks();

  }

  private setDefaultCallbacks(): void {
    const PluginsHandler = this.plugins_handler;
    const CommandHandler = this.command_handler;

    this.once('ready', async () => {

      await LoadGuildsController.handle(this);
    
      PluginsHandler.setup(this.command_handler);
      this.user?.setActivity('Online!');
      console.log('Ready!');
    });

    this.on('message', async (msg: Message): Promise<void> => {
      msg.manager = PluginsHandler.plugins.get(msg.command?.plugin_id || 'default');
      await CommandHandler.handle(msg);
    });

    this.on('guildCreate', async (guild: Guild): Promise<void> => {
      const newGuild = await CreateGuildController.handle(guild);
      console.log(`Joinned guild ${newGuild.id} called ${guild.name}`);
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
