import { Collection } from 'discord.js';
import { ICommand } from '../../../../../interfaces/ICommand';
import { OasisError } from '../../../../../logs/OasisError';
import { readdirSync } from 'fs';
import { IRemoveCommands } from '../IRemoveCommands';

class RemoveCommandsFromFolder implements IRemoveCommands {
  public handle(collection: Collection<string, ICommand>, ...args: string[]): void {
    const [folderPath] = args;

    try {
      const commandFiles = readdirSync(folderPath)
        .filter((file) => file.endsWith(process.env.NODE_ENV === 'production' ? '.js' : '.ts'));

      for (const file of commandFiles) {
        delete require.cache[require.resolve(`${folderPath}/${file}`)];

        const command: ICommand = require(`${folderPath}/${file}`).default;

        collection.delete(command.name);
      }
    } catch (err) {
      throw new OasisError('Error deleting commands from folder', err, {
        folder: folderPath,
      });
    }
  }
}

export { RemoveCommandsFromFolder };
