import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';
import { IPluginsHandler } from './IPluginsHandler';
import { GetPluginByNameController } from '../../repositories/plugin/useCases/GetPluginByName/GetPluginByNameController';
import { CreatePluginController } from '../../repositories/plugin/useCases/CreatePlugin/CreatePluginController';

class PluginsHandler implements IPluginsHandler {
  private _plugins: Map<string, AbstractPlugin>;

  constructor(pluginsManagers: AbstractPlugin[]) {
    this._plugins = new Map();

    pluginsManagers.forEach((plugin) => {
      this._plugins.set(plugin.name, plugin);
    });
  }

  get plugins(): Map<string, AbstractPlugin> {
    return this._plugins;
  }

  setup(commandHandler: ICommandHandler) {
    this._plugins.forEach(async (plugin: AbstractPlugin, pluginName: string) => {
      if (!plugin) return;
      const oldPlugin = await GetPluginByNameController.handle(pluginName);
      const pluginDb = oldPlugin || (await CreatePluginController.handle({ name: pluginName }));
      await plugin.setup(pluginDb.id);
      await plugin.set(commandHandler);
      this._plugins.set(pluginDb.id, plugin);
      this._plugins.delete(pluginName);
    });
  }
}

export default PluginsHandler;
