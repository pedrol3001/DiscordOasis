import { Collection } from 'discord.js';
import { AbstractPlugin } from './class/AbstractPlugin';
import { ICommandHandler } from '../commands/ICommandHandler';
import { IPluginsHandler } from './IPluginsHandler';
import { OasisError } from '../../error/OasisError';

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

        await plugin.setup();
        await plugin.set(commandHandler);

        if (plugin.id) this.pluginsNameToId(plugin.id, pluginName, plugin);
        else throw new OasisError(`Failed to load plugin ${pluginName}, it has no id`);
      }),
    );
  }

  private pluginsNameToId(id: string, name: string, plugin: AbstractPlugin) {
    this._plugins.set(id, plugin);
    this._plugins.delete(name);
  }
}

export default PluginsHandler;
