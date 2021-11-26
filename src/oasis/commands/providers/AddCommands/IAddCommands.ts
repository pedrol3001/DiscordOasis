import { Collection } from 'discord.js';
import {ICommand } from '../../../../interfaces/ICommand';

interface IAddCommands {
  handle(collection: Collection<string, ICommand>, ...args : string[]): void;
}

export { IAddCommands };
