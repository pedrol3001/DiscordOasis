import { Collection } from 'discord.js';
import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';
import { IPluginsHandler } from './IPluginsHandler';
import { GetPluginByNameController } from '../../repositories/plugin/useCases/GetPluginByName/GetPluginByNameController';
import { CreatePluginController } from '../../repositories/plugin/useCases/CreatePlugin/CreatePluginController';

class PluginsHandler implements IPluginsHandler {
  private _plugins: Collection<string, AbstractPlugin> = new Collection<string, AbstractPlugin>();

  constructor(pluginsManagers: AbstractPlugin[]) {
    pluginsManagers.forEach((plugin) => {
      this._plugins.set(plugin.name, plugin);
    });
  }

  public get plugins(): Collection<string, AbstractPlugin> {
    return this._plugins;
  }

  async setup(commandHandler: ICommandHandler) {
    await Promise.all(
      this._plugins.map(async (plugin: AbstractPlugin, pluginName: string) => {
        if (!plugin) return;
        const oldPlugin = await GetPluginByNameController.handle(pluginName);
        const pluginDb = oldPlugin || (await CreatePluginController.handle({ name: pluginName }));
        await plugin.setup(pluginDb.id);
        await plugin.set(commandHandler);

        this.pluginsNameToId(pluginDb.id, pluginName, plugin);
      }),
    );
  }

  private pluginsNameToId(id: string, name: string, plugin: AbstractPlugin) {
    this._plugins.set(id, plugin);
    this._plugins.delete(name);
  }
}

export default PluginsHandler;
