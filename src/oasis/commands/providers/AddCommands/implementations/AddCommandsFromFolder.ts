/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { ICommand } from '../../../../../interfaces/ICommand';
import { OasisError } from '../../../../../error/OasisError';
import { IAddCommands } from '../IAddCommands';

class AddCommandsFromFolder implements IAddCommands {
  public handle(collection: Collection<string, ICommand>, ...args: string[]): void {
    const [folderPath, plugin] = args;

    try {
      const commandFiles = readdirSync(folderPath).filter((file) =>
        file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'),
      );

      for (const file of commandFiles) {
        delete require.cache[require.resolve(`${folderPath}/${file}`)];

        const command: ICommand = require(`${folderPath}/${file}`).default;

        command.pluginId = plugin || undefined;

        const alreadyExists = collection.get(command.name);

        if (alreadyExists) {
          throw new OasisError(`Error adding command ${command.name} from folder, this commands already exists.`);
        }

        collection.set(command.name, command); // Add command to collection
      }
    } catch (err) {
      throw new OasisError('Error adding commands from folder', {
        folder: folderPath[0],
      });
    }
  }
}
export { AddCommandsFromFolder };
