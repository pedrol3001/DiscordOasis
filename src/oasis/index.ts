import '@repositories/index';

import CommandHandler from 'oasis/commands/index';
import PluginsHandler from 'oasis/plugins/index';
import {OasisError} from '@error/OasisError';
import { Client, Guild, Message, Snowflake } from 'discord.js';
import { IOasisOptions } from '../interfaces/IOasisOptions';
import { IPluginsHanlder } from '@interfaces/IPluginsHandler';
import { GenericObject } from 'utils/types';

class Oasis {
  readonly client: Client;

  readonly plugins_handler: IPluginsHanlder;

  private guildLoader : (guild_id) => Promise<GenericObject>;
  private guildCreator: (guild: GenericObject) => Promise<GenericObject> ;

  constructor(options: IOasisOptions) {
    const { plugins, commands_folder, shard_count, global_prefix, command_file_extension } = options;

    this.client = new Client({ shardCount: shard_count });
    this.client.command_handler = new CommandHandler(commands_folder, command_file_extension, global_prefix);
    this.plugins_handler = new PluginsHandler(plugins);

    this.setDefaultCallbacks();
  }

  public setGuildsLoader(guildGetter : (guild_id : Snowflake) => Promise<GenericObject>) : void{
    this.guildLoader = guildGetter;
  }

  public setGuildCreator(guildSetter: (guild: GenericObject) => Promise<GenericObject>): void{
    this.guildCreator = guildSetter;
  }

  private setDefaultCallbacks(): void {
    const PluginsHandler = this.plugins_handler;
    const CommandHandler = this.client.command_handler;
    const client = this.client;

    client.once('ready', async () => {

      await Promise.all(

        this.client.guilds.cache.map(async (guild) => {
          const defaultGuild: any = new Object(guild.id);
          const guildFromDb = await this.guildLoader(guild.id);

          if (guildFromDb) {
            Object.assign(guild, guildFromDb);
          } else {
            Object.assign(guild, defaultGuild);
          }
        }),
      );

      PluginsHandler.setup(this.client.command_handler);
      client.user.setActivity('Online!');
      console.log('Ready!');
    });

    client.on('message', async (msg: Message): Promise<void> => {
      msg.manager = PluginsHandler.plugins[msg.command.plugin_id || 'default'];
      await CommandHandler.handle(msg);
    });

    client.on('guildCreate', async (guild: Guild): Promise<void> => {
      const guildFromDb = await this.guildCreator(guild);
      console.log(`Joinned guild ${guildFromDb.id} called ${guild.name}`);
      guild.systemChannel.send('Welcome to oasisBot!');
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
