import { ClientApplication, Interaction, Message } from 'discord.js';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { IPluginsHandler } from '../plugins/IPluginsHandler';
import { ICommand } from '../../interfaces/ICommand';

export interface ICommandHandler {
  get commands(): Array<ICommand>;
  setup(application: ClientApplication): Promise<void>;
  handle(message: Message | Interaction, pluginsHandler: IPluginsHandler): Promise<void>;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args: string[]): void;
}
