import { Collection } from 'discord.js';
import {ICommand} from '../../../../interfaces/ICommand';

interface IRemoveCommands {
  handle(collection: Collection<string, ICommand>, ...args:string[]): void;
}

export { IRemoveCommands };
