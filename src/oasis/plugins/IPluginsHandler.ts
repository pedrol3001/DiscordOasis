import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';

export interface IPluginsHandler {
  setup(command_handler: ICommandHandler): void;
  get plugins(): Map<string, AbstractPlugin>;
}
