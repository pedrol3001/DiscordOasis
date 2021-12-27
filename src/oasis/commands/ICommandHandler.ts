import { ClientApplication, Interaction, Message } from 'discord.js';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { IPluginsHandler } from '../plugins/IPluginsHandler';

export interface ICommandHandler {
  application: ClientApplication | undefined;
  setup(application: ClientApplication): void;
  handle(message: Message | Interaction, pluginsHandler: IPluginsHandler): Promise<void>;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args: string[]): void;
}
