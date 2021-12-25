import { Collection, Message } from 'discord.js';

import { ICommand } from '../../interfaces/ICommand';
import { OasisError } from '../../logs/OasisError';

import { CommandError } from './error/CommandError';
import { ICommandHandler } from './ICommandHandler';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { AddCommandsFromFolder } from './providers/AddCommands/implementations/AddCommandsFromFolder';
import { IMicroHandler } from './handlers/IMicroHandler';
import { ArgsMicroHandler } from './handlers/implementations/ArgsMicroHandler';
import { GroupsMicroHandler } from './handlers/implementations/GroupsMicroHandler';
import { PermissionsMicroHandler } from './handlers/implementations/PermissionsMicroHandler';
import { RolesMicroHandler } from './handlers/implementations/RolesMicroHandler';
import { CooldownsMicroHandler } from './handlers/implementations/CooldownsMicroHandler';
import { IPluginsHandler } from '../plugins/IPluginsHandler';
import { PluginsMicroHandler } from './handlers/implementations/PluginsMicroHandler';

export type IMicroHandlerExecutionMode = 'onBegin' | 'async' | 'onEnd';

class CommandHandler implements ICommandHandler {
  private _commands: Collection<string, ICommand> = new Collection<string, ICommand>();

  private readonly _globalPrefix: string;

  private _on_begin_micro_handlers: IMicroHandler[];

  private _micro_handlers: IMicroHandler[];

  private _on_end_micro_handlers: IMicroHandler[];

  public get commands(): Array<ICommand> {
    return Array.from(this._commands.values());
  }

  public constructor(commandsFolder: string, globalPrefix: string) {
    this.edit(AddCommandsFromFolder, commandsFolder);

    this._globalPrefix = globalPrefix;
    this._micro_handlers = [
      new ArgsMicroHandler(),
      new GroupsMicroHandler(),
      new PermissionsMicroHandler(),
      new RolesMicroHandler(),
    ];

    this._on_begin_micro_handlers = [new PluginsMicroHandler(), new CooldownsMicroHandler()];
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

  public async edit(ConfType: new () => IAddCommands | IRemoveCommands, ...args: string[]) {
    const provider = new ConfType();
    await provider.handle(this._commands, ...args);
  }

  public async handle(msg: Message, pluginsHandler: IPluginsHandler): Promise<void> {
    this.setPrefix(msg);
    if (!msg.prefix) return;

    this.setArgs(msg);

    this.setCommand(msg);
    if (!msg.command) return;

    this.setManager(msg, pluginsHandler);

    try {
      for (const handler of this._on_begin_micro_handlers) {
        await handler.handle(msg);
      }

      await Promise.all(this._micro_handlers.map(async (handler) => handler.handle(msg)));

      for (const handler of this._on_end_micro_handlers) {
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

  private setPrefix(msg: Message) {
    if (msg.author.bot) return;

    if (this._globalPrefix && msg.content.startsWith(this._globalPrefix)) {
      msg.prefix = this._globalPrefix;
    }

    if (msg.guild?.prefix && msg.content.startsWith(msg.guild.prefix)) {
      msg.prefix = msg.guild.prefix; // guild prefix
    }
  }

  private setArgs(msg: Message) {
    msg.content = msg.content.slice(msg.prefix.length);
    msg.args = msg.content.trim().split(/\s+/);
  }

  private setCommand(msg: Message) {
    const command_msg = new Array<string>();
    while (!msg.command && msg.args.length > 0) {
      command_msg.push(msg.args.shift()?.toLowerCase() || '');
      const commandByName = this._commands.get(command_msg.join(' '));
      const commandByAliases = this._commands.find((cmd) => cmd.aliases?.includes(command_msg.join(' ')));

      msg.command = commandByName || commandByAliases || null;
    }
  }

  private setManager(msg: Message, pluginsHandler: IPluginsHandler) {
    const plugin_id = msg.command?.plugin_id;
    msg.manager = plugin_id ? pluginsHandler.plugins.get(plugin_id) || null : null;
  }
}
export default CommandHandler;
