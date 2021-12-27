/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { parseCommand, registerCommands } from '../../../../../services/slash';
import { ICommand } from '../../../../../interfaces/ICommand';
import { OasisError } from '../../../../../error/OasisError';
import { IAddCommands } from '../IAddCommands';
import { GetPluginGuildsController } from '../../../../../repositories/plugin/useCases/GetPluginGuilds/GetPluginGuildsController';

class AddCommandsFromFolder implements IAddCommands {
  public handle(collection: Collection<string, ICommand>, ...args: string[]): void {
    const [folderPath, applicationId, pluginId] = args;

    try {
      const commandFiles = readdirSync(folderPath).filter((file) =>
        file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'),
      );

      const slashCommandsJSON: Array<unknown> = [];

      for (const file of commandFiles) {
        delete require.cache[require.resolve(`${folderPath}/${file}`)];

        const command: ICommand = require(`${folderPath}/${file}`).default;

        Object.assign(command, { pluginId });

        const alreadyExists = collection.get(command.name);

        if (alreadyExists) {
          throw new OasisError(`Error adding command ${command.name} from folder, this commands already exists.`);
        }

        collection.set(command.name, command); // Add command to collection
        slashCommandsJSON.push(parseCommand(command)); // Add command to slash commands json
      }

      if (pluginId === undefined) {
        registerCommands(applicationId, slashCommandsJSON); // Register commands in slash commands json
      } else {
        GetPluginGuildsController.handle(pluginId).then((guilds) => {
          guilds.forEach((guild) => {
            registerCommands(applicationId, slashCommandsJSON, guild.id); // Register commands in slash commands json
          });
        });
      }
    } catch (err) {
      throw new OasisError('Error adding commands from folder', {
        folder: folderPath,
      });
    }
  }
}
export { AddCommandsFromFolder };
