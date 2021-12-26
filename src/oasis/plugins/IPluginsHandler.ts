import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';

export interface IPluginsHandler {
  setup(commandHandler: ICommandHandler): void;
  get plugins(): Map<string, AbstractPlugin>;
}
