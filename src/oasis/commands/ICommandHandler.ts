import { Message } from 'discord.js';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { IPluginsHandler } from '../plugins/IPluginsHandler';

export interface ICommandHandler {
  handle(msg: Message, pluginsHandler: IPluginsHandler): Promise<void>;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args: string[]): void;
}
