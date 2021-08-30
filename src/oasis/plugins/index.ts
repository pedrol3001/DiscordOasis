import { ICommandHandler } from 'interfaces/ICommandHandler';
import { IPluginsHanlder } from 'interfaces/IPluginsHandler';
import { GenericObject } from 'utils/types';
import { AbstractPlugin } from './class/AbstractPlugin';

class PluginsHandler implements IPluginsHanlder {
  private _plugins: Map<string, AbstractPlugin | undefined>;

  private _pluginLoader : ((plugin_id: string) => Promise<GenericObject>) | undefined;
  private _pluginCreator: ((plugin: GenericObject) => Promise<GenericObject>) | undefined;

  constructor(plugins_managers: AbstractPlugin[] | undefined) {
    this._plugins = new Map();
    this._plugins.set('default', undefined);

    plugins_managers?.forEach((plugin) => {
      this._plugins.set(plugin.name, plugin);
    });
  }

  public set pluginLoader(pluginLoader: (plugin_id: string) => Promise<GenericObject>) {
    this._pluginLoader = pluginLoader;
  }

  public set pluginCreator(pluginCreator: (plugin: GenericObject) => Promise<GenericObject>) {
    this._pluginCreator = pluginCreator;
  }

  get plugins(): Map<string, AbstractPlugin | undefined> {
    return this._plugins;
  }

  setup(command_handler: ICommandHandler) {
    this._plugins.forEach(async (plugin: AbstractPlugin | undefined, key: string) => {
      await plugin?.setup(
        (this._pluginLoader ? (await this._pluginLoader(plugin.id)).id : "undefined" ) ||
        (this._pluginCreator ? (await this._pluginCreator({ name: this.constructor.name })).id : "undefined")
      );
      await plugin?.set(command_handler);
      key = plugin?.id || key;
    });
  }
}

export default PluginsHandler;
