import Discord from 'discord.js';
import {ICommand} from 'interfaces/ICommand';

interface IRemoveCommands {
  handle(collection: Discord.Collection<string, ICommand>, ...args:string[]): void;
}

export { IRemoveCommands };
