import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../../interfaces/ICommandHandler';
import { IPluginsHandler } from '../../interfaces/IPluginsHandler';
import { GetPluginByNameController } from '../../repositories/plugin/useCases/GetPluginByName/GetPluginByNameController';
import { CreatePluginController } from '../../repositories/plugin/useCases/CreatePlugin/CreatePluginController';

class PluginsHandler implements IPluginsHandler {
  private _plugins: Map<string, AbstractPlugin>;
  
  constructor(plugins_managers: AbstractPlugin[] | undefined) {
    this._plugins = new Map();

    plugins_managers?.forEach((plugin) => {
      this._plugins.set(plugin.name, plugin);
    });
  }

  get plugins(): Map<string, AbstractPlugin> {
    return this._plugins;
  }

  setup(command_handler: ICommandHandler) {
    this._plugins.forEach(async (plugin: AbstractPlugin, key: string) => {
      const name = this.constructor.name;
      const pluginDb = (await GetPluginByNameController.handle(name)) || (await CreatePluginController.handle({name})); 
      
      await plugin.setup(pluginDb.id);
      await plugin.set(command_handler);
      key = plugin?.id || key;
    });
  }
}

export default PluginsHandler;
