import Discord from 'discord.js';
import {ICommand } from 'interfaces/ICommand';

interface IAddCommands {
  handle(collection: Discord.Collection<string, ICommand>, ...args : string[]): void;
}

export { IAddCommands };
