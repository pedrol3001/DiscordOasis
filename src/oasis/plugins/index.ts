import { ICommandHandler } from '@interfaces/ICommandHandler';
import { IPluginsHanlder } from '@interfaces/IPluginsHandler';
import { GenericObject } from 'utils/types';
import { AbstractPlugin } from './class/AbstractPlugin';

class PluginsHandler implements IPluginsHanlder {
  private _plugins: Map<string, AbstractPlugin>;

  private pluginLoader : (plugin_id) => Promise<GenericObject>;
  private pluginCreator: (plugin: GenericObject) => Promise<GenericObject>;

  constructor(plugins_managers: AbstractPlugin[]) {
    this._plugins = new Map();
    this._plugins['default'] = undefined;

    plugins_managers.forEach((plugin) => {
      this._plugins.set(plugin.name, plugin);
    });
  }

  get plugins(): Map<string, AbstractPlugin> {
    return this._plugins;
  }

  setup(command_handler: ICommandHandler) {
    this._plugins.forEach(async (plugin: AbstractPlugin, key: string) => {

      await plugin.setup(
        (await this.pluginLoader(plugin.id))?.id ||
        (await this.pluginCreator({ name: this.constructor.name }))?.id
      );
      await plugin.set(command_handler);
      key = plugin.id;
    });
  }
}

export default PluginsHandler;
