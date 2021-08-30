import { ICommandHandler } from 'interfaces/ICommandHandler';

import { v4 as uuidv4 } from 'uuid';
import { AddCommandsFromFolder } from 'oasis/commands/providers/AddCommands/implementations/AddCommandsFromFolder';
import { RemoveCommandsFromPlugin } from 'oasis/commands/providers/RemoveCommands/implementations/RemoveCommandsFromPlugin';



abstract class AbstractPlugin {
  id: string;
  name: string;
  commands_folder: string;

  constructor(id: string, commands_folder: string) {
    this.id = id;
    this.name = this.constructor.name;
    this.commands_folder = commands_folder;

  }

  async setup(id: string): Promise<void> {
    this.id = id || uuidv4();
  }

  set(commands: ICommandHandler): void {
    commands.edit(AddCommandsFromFolder, this.commands_folder ,this.id);
  }

  unset(commands: ICommandHandler): void {
    // TODO
    commands.edit(RemoveCommandsFromPlugin);
  }
}

export { AbstractPlugin };
