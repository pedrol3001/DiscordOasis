/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { Collection } from 'discord.js';
import { ICommand } from '../../../../../interfaces/ICommand';
import help from '../../commands/help';
import { IAddCommands } from '../IAddCommands';
import { OasisError } from '../../../../../error/OasisError';

class AddDefaultCommands implements IAddCommands {
  public handle(collection: Collection<string, ICommand>): void {
    const commands = [help];

    try {
      commands.forEach((command) => {
        const alreadyExists = collection.get(command.name);

        if (alreadyExists) {
          throw new OasisError(`Error adding command ${command.name} from folder, this commands already exists.`);
        }

        collection.set(command.name, command); // Add command to collection
      });
    } catch (err) {
      throw new OasisError('Error adding default commands', {
        error: err,
      });
    }
  }
}
export { AddDefaultCommands };
