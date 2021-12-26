import { Interaction, Message } from 'discord.js';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { IPluginsHandler } from '../plugins/IPluginsHandler';

export interface ICommandHandler {
  handleMessage(message: Message, pluginsHandler: IPluginsHandler): Promise<void>;
  handleInteraction(interaction: Interaction, pluginsHandler: IPluginsHandler): Promise<void>;
  edit(AddType: new () => IAddCommands | IRemoveCommands, ...args: string[]): void;
}
