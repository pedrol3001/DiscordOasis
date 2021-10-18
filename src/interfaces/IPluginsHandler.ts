import { AbstractPlugin } from 'oasis/plugins/class/AbstractPlugin';
import { ICommandHandler } from './ICommandHandler';

export interface IPluginsHanlder {
  setup(command_handler: ICommandHandler): void;
  get plugins(): Map<string, AbstractPlugin | undefined>;
}
