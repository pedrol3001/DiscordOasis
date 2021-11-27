
import { Message } from 'discord.js';
import { IAddCommands } from '../oasis/commands/providers/AddCommands/IAddCommands';
import { IRemoveCommands } from '../oasis/commands/providers/RemoveCommands/IRemoveCommands';
import { IPluginsHandler } from './IPluginsHandler';

export interface ICommandHandler {
  handle(msg: Message, pluginsHandler: IPluginsHandler): void;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args : string[]) : void;
}
