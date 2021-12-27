import { OasisError } from '../../../error/OasisError';
import { ICommandHandler } from '../../commands/ICommandHandler';
import { AddCommandsFromFolder } from '../../commands/providers/AddCommands/implementations/AddCommandsFromFolder';
import { RemoveCommandsFromFolder } from '../../commands/providers/RemoveCommands/implementations/RemoveCommandsFromFolder';

abstract class AbstractPlugin {
  id: string | undefined;

  name: string;

  commandsFolder: string;

  constructor(commandsFolder: string) {
    this.name = this.constructor.name;
    this.commandsFolder = commandsFolder;
  }

  async setup(id: string): Promise<void> {
    this.id = id;
  }

  set(commands: ICommandHandler): void {
    if (this.id) {
      commands.edit(AddCommandsFromFolder, this.commandsFolder, this.id);
    } else throw new OasisError("Can't set a plugin before it's setup");
  }

  unset(commands: ICommandHandler): void {
    if (this.id) commands.edit(RemoveCommandsFromFolder, this.commandsFolder);
    else throw new OasisError("Can't unset a plugin before it's setup");
  }
}

export { AbstractPlugin };
