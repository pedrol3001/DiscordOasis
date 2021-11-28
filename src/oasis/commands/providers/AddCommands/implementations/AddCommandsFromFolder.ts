import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { ICommand } from '../../../../../interfaces/ICommand';
import { OasisError } from '../../../../../log/OasisError';
import { IAddCommands } from '../IAddCommands';

class AddCommandsFromFolder implements IAddCommands {
  public handle(collection: Collection<string, ICommand>, ...args: string[]): void {
    const [folderPath, plugin] = args;

    try {
      const commandFiles = readdirSync(folderPath)
        .filter((file) => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'));

      for (const file of commandFiles) {
        delete require.cache[require.resolve(`${folderPath}/${file}`)];

        const command: ICommand = require(`${folderPath}/${file}`).default;

        command.plugin_id = plugin || undefined;

        const already_exists = collection.get(command.name);

        if (already_exists) {
          throw new OasisError(`Error adding command ${command.name} from folder, this commands already exists.`);
        }

        collection.set(command.name, command); // Add command to collection
      }
    } catch (err) {
      throw new OasisError('Error adding commands from folder', err, {
        folder: folderPath[0],
      });
    }
  }
}

export { AddCommandsFromFolder };
