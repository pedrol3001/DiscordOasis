import '@repositories/index';

import CommandHandler from 'oasis/commands/index';
import PluginsHandler from 'oasis/plugins/index';
import {OasisError} from 'error/OasisError';
import { Client, Guild, Message } from 'discord.js';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginsHanlder } from 'interfaces/IPluginsHandler';
import { GenericObject } from 'utils/types';

class Oasis {
  readonly client: Client;

  readonly plugins_handler: IPluginsHanlder;

  private _guildLoader : ((guild_id:string) => Promise<GenericObject>) | undefined;
  private _guildCreator : ((guild: GenericObject) => Promise<GenericObject>) | undefined;

  constructor(options: IOasisOptions) {
    const { plugins, commands_folder, shard_count, global_prefix } = options;

    this.client = new Client({ shardCount: shard_count });
    this.client.command_handler = new CommandHandler(commands_folder, global_prefix);

    this.plugins_handler = new PluginsHandler(plugins);

    this._guildLoader = undefined;

    this.setDefaultCallbacks();
  }

  public set guildLoader(loader: (guild_id:string) => Promise<GenericObject>) {
    this._guildLoader = loader;
  }

  public set guildCreator(creator: (guild: GenericObject) => Promise<GenericObject>) {
    this._guildCreator = creator;
  }

  set pluginLoader(pluginLoader: (plugin_id:string) => Promise<GenericObject>) {
    this.plugins_handler.pluginLoader = pluginLoader;
  }

  set pluginCreator(pluginCreator: (plugin: GenericObject) => Promise<GenericObject>) {
    this.plugins_handler.pluginCreator = pluginCreator;
  }

  private setDefaultCallbacks(): void {
    const PluginsHandler = this.plugins_handler;
    const CommandHandler = this.client.command_handler;
    const client = this.client;

    client.once('ready', async () => {

      await Promise.all(

        this.client.guilds.cache.map(async (guild) => {
          const defaultGuild: any = new Object(guild.id);
          const guildFromDb = this._guildLoader ? await this._guildLoader(guild.id) : undefined;

          if (guildFromDb) {
            Object.assign(guild, guildFromDb);
          } else {
            Object.assign(guild, defaultGuild);
          }
        }),
      );

      PluginsHandler.setup(this.client.command_handler);
      client.user?.setActivity('Online!');
      console.log('Ready!');
    });

    client.on('message', async (msg: Message): Promise<void> => {
      msg.manager = PluginsHandler.plugins.get(msg.command?.plugin_id || 'default');
      await CommandHandler.handle(msg);
    });

    client.on('guildCreate', async (guild: Guild): Promise<void> => {
      const guildFromDb = this._guildCreator ? await this._guildCreator(guild) : undefined;
      console.log(`Joinned guild ${guildFromDb?.id} called ${guild.name}`);
      guild.systemChannel?.send('Welcome to oasisBot!');
    });

    client.on('error', (err) => {
      if (err instanceof OasisError) err.log();
      else console.error(err);
    });

    client.on('debug', (db) => console.info(db));
  }

  public listen(token: string) {
      this.client.login(token);
  }
}

export { Oasis };
