import { Plugin } from '@prisma/client';
import { OasisError } from '../../../error/OasisError';
import { CreatePluginController } from '../../../repositories/plugin/useCases/CreatePlugin/CreatePluginController';
import { GetPluginByNameController } from '../../../repositories/plugin/useCases/GetPluginByName/GetPluginByNameController';
import { ICommandHandler } from '../../commands/ICommandHandler';
import { AddCommandsFromFolder } from '../../commands/providers/AddCommands/implementations/AddCommandsFromFolder';
import { RemoveCommandsFromFolder } from '../../commands/providers/RemoveCommands/implementations/RemoveCommandsFromFolder';

abstract class AbstractPlugin implements Plugin {
  id: string;

  name: string;

  color: string;

  commandsFolder: string;

  constructor(commandsFolder: string) {
    this.id = 'null';
    this.color = '#ffffff';
    this.name = this.constructor.name;
    this.commandsFolder = commandsFolder;
  }

  async setup(): Promise<void> {
    const oldPlugin = await GetPluginByNameController.handle(this.name);
    const pluginDb = oldPlugin ?? (await CreatePluginController.handle(this));
    this.id = pluginDb.id;
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
