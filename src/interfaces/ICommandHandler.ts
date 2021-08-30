import Discord from 'discord.js';
import { IAddCommands } from 'oasis/commands/providers/AddCommands/IAddCommands';
import { IRemoveCommands } from 'oasis/commands/providers/RemoveCommands/IRemoveCommands';

export interface ICommandHandler {
  handle(msg: Discord.Message) : void;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args : string[]) : void;
}
