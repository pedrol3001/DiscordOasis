import { AbstractPlugin } from 'oasis/plugins/class/AbstractPlugin';
import { ICommandHandler } from './ICommandHandler';
import { GenericObject } from '../utils/types';

export interface IPluginsHanlder {
  setup(command_handler: ICommandHandler): void;
  set pluginLoader(pluginLoader: (plugin_id:string) => Promise<GenericObject>);
  set pluginCreator(pluginCreator: (plugin: GenericObject) => Promise<GenericObject>);
  get plugins(): Map<string, AbstractPlugin | undefined>;
}
