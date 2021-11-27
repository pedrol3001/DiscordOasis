import { AbstractPlugin } from '../oasis/plugins/class/AbstractPlugin';
import { ICommandHandler } from './ICommandHandler';

export interface IPluginsHandler {
  setup(command_handler: ICommandHandler): void;
  get plugins(): Map<string, AbstractPlugin>;
}
