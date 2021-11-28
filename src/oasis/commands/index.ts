import { Collection, Message } from 'discord.js';

import { ICommand } from '../../interfaces/ICommand';
import { OasisError } from '../../log/OasisError';

import { CommandError } from './error/CommandError';
import { ICommandHandler } from '../../interfaces/ICommandHandler';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { AddCommandsFromFolder } from './providers/AddCommands/implementations/AddCommandsFromFolder';
import { IMicroHandler } from './handlers/IMicroHandler';
import { ArgsMicroHandler } from './handlers/implementations/ArgsMicroHandler';
import { GroupsMicroHandler } from './handlers/implementations/GroupsMicroHandler';
import { PermissionsMicroHandler } from './handlers/implementations/PermissionsMicroHandler';
import { RolesMicroHandler } from './handlers/implementations/RolesMicroHandler';
import { CooldownsMicroHandler } from './handlers/implementations/CooldownsMicroHandler';
import { IPluginsHandler } from '../../interfaces/IPluginsHandler';
import { CheckGuildsPluginController } from '../../repositories/guild/useCases/CheckGuildsPlugin/CheckGuildsPluginController';

export type IMicroHandlerExecutionMode = 'onBegin' | 'async' | 'onEnd';

class CommandHandler implements ICommandHandler {
  private _commands: Collection<string, ICommand> = new Collection<string, ICommand>();

  private readonly _global_prefix: string;

  private _on_begin_micro_handlers: IMicroHandler[];
  private _micro_handlers: IMicroHandler[];
  private _on_end_micro_handlers: IMicroHandler[];

  public get commands(): Array<ICommand> {
    return Array.from(this._commands.values());
  }

  public constructor(commands_folder: string, global_prefix: string) {
    this.edit(AddCommandsFromFolder, commands_folder);

    this._global_prefix = global_prefix;
    this._micro_handlers = [
      new ArgsMicroHandler(),
      new GroupsMicroHandler(),
      new PermissionsMicroHandler(),
      new RolesMicroHandler(),
      new CooldownsMicroHandler(),
    ];

    this._on_begin_micro_handlers = [];
    this._on_end_micro_handlers = [];
  }

  public addMicroHandler(handler: IMicroHandler, onBegin: IMicroHandlerExecutionMode = 'async') {
    switch (onBegin) {
      case 'onBegin':
        this._on_begin_micro_handlers.push(handler);
        break;
      case 'async':
        this._micro_handlers.push(handler);
        break;
      case 'onEnd':
        this._on_end_micro_handlers.push(handler);
        break;
    }
  }

  public edit(ConfType: new () => IAddCommands | IRemoveCommands, ...args: string[]) {
    const provider = new ConfType();
    provider.handle(this._commands, ...args);
  }

  public async handle(msg: Message, pluginsHandler: IPluginsHandler): Promise<void> {
    try {
      if (msg.author.bot) return;

      if (this._global_prefix && msg.content.startsWith(this._global_prefix)) {
        msg.prefix = this._global_prefix;
      }

      if (msg.guild?.prefix && msg.content.startsWith(msg.guild.prefix)) {
        msg.prefix = msg.guild.prefix; // guild prefix
      }

      if (!msg.prefix) return;

      msg.content = msg.content.slice(msg.prefix.length);
      msg.args = msg.content.trim().split(/\s+/);
      const command_msg = new Array<string>();

      // composed commands names
      while (!msg.command && msg.args.length > 0) {
        command_msg.push(msg.args.shift()?.toLowerCase() || '');

        const commandByName = this._commands.get(command_msg.join(' '));
        const commandByAliases = this._commands.find((cmd) => cmd.aliases?.includes(command_msg.join(' ')));

        msg.command = commandByName || commandByAliases || null;
      }
      if (!msg.command) return;

      const { plugin_id } = msg.command;
      if (msg.guild && plugin_id) {
        const hasPlugin = await CheckGuildsPluginController.handle([msg.guild?.id], plugin_id);
        if (!hasPlugin) return;
      }
      msg.manager = plugin_id ? pluginsHandler.plugins.get(plugin_id) || null : null;

      for (let handler of this._on_begin_micro_handlers) {
        await handler.handle(msg);
      }

      await Promise.all(this._micro_handlers.map(async (handler) => handler.handle(msg)));

      for (let handler of this._on_end_micro_handlers) {
        await handler.handle(msg);
      }

      await msg.command.execute(msg);
    } catch (err) {
      if (err instanceof CommandError) return await err.send();

      throw new OasisError('Error executing command', err, {
        message: msg,
      });
    }
  }
}
export default CommandHandler;
