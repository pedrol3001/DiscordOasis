import { Collection } from 'discord.js';
import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';

export interface IPluginsHandler {
  setup(commandHandler: ICommandHandler): Promise<void>;
  get plugins(): Collection<string, AbstractPlugin>;
}
