import { OasisError } from '../../../log/OasisError';
import { ICommandHandler } from '../../../interfaces/ICommandHandler';
import { AddCommandsFromFolder } from '../../commands/providers/AddCommands/implementations/AddCommandsFromFolder';
import { RemoveCommandsFromPlugin } from '../../commands/providers/RemoveCommands/implementations/RemoveCommandsFromPlugin';



abstract class AbstractPlugin {
  id: string | undefined;
  name: string;
  commands_folder: string;

  constructor(commands_folder: string) {
    this.name = this.constructor.name;
    this.commands_folder = commands_folder;
  }

  async setup(id: string): Promise<void> {
    this.id = id;
  }

  set(commands: ICommandHandler): void {
    if(this.id) commands.edit(AddCommandsFromFolder, this.commands_folder ,this.id);
    else throw new OasisError("Can't set a plugin before it's setup");
  }

  unset(commands: ICommandHandler): void {
    // TODO
    commands.edit(RemoveCommandsFromPlugin);
  }
}

export { AbstractPlugin };
