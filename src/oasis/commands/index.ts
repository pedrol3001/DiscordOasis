import { Collection, CommandInteraction, Interaction, Message } from 'discord.js';

import { get } from 'lodash';
import { ICommand } from '../../interfaces/ICommand';
import { OasisError } from '../../error/OasisError';

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

  private _on_begin_microHandlers: IMicroHandler[];

  private _microHandlers: IMicroHandler[];

  private _on_end_microHandlers: IMicroHandler[];

  public get commands(): Array<ICommand> {
    return Array.from(this._commands.values());
  }

  public constructor(commandsFolder: string, globalPrefix: string) {
    this.edit(AddCommandsFromFolder, commandsFolder);

    this._globalPrefix = globalPrefix;
    this._microHandlers = [
      new ArgsMicroHandler(),
      new GroupsMicroHandler(),
      new PermissionsMicroHandler(),
      new RolesMicroHandler(),
    ];

    this._on_begin_microHandlers = [new PluginsMicroHandler(), new CooldownsMicroHandler()];
    this._on_end_microHandlers = [];
  }

  public addMicroHandler(handler: IMicroHandler, onBegin: IMicroHandlerExecutionMode = 'async') {
    switch (onBegin) {
      case 'onBegin':
        this._on_begin_microHandlers.push(handler);
        break;
      case 'async':
        this._microHandlers.push(handler);
        break;
      case 'onEnd':
        this._on_end_microHandlers.push(handler);
        break;
      default:
        throw new OasisError('Invalid micro handler execution mode');
    }
  }

  public async edit(ConfType: new () => IAddCommands | IRemoveCommands, ...args: string[]) {
    const provider = new ConfType();
    await provider.handle(this._commands, ...args);
  }

  public async handleInteraction(interaction: Interaction, pluginsHandler: IPluginsHandler) {
    if (!interaction.isCommand()) return;

    this.setManager(interaction, pluginsHandler);

    await this.executeInteraction(interaction);
    console.log(interaction, pluginsHandler);
  }

  public async handleMessage(message: Message, pluginsHandler: IPluginsHandler) {
    this.setMessagePrefix(message);
    if (!message.prefix) return;

    this.setMessageArgs(message);

    this.setCommand(message);

    this.setManager(message, pluginsHandler);

    await this.executeMessage(message);
  }

  private async executeMessage(message: Message) {
    if (!message.command) return;

    try {
      for (const handler of this._on_begin_microHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handleMessage(message);
      }

      await Promise.all(this._microHandlers.map(async (handler) => handler.handleMessage(message)));

      for (const handler of this._on_end_microHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handleMessage(message);
      }

      await message.command.execute(message);
    } catch (err) {
      if (!(err instanceof CommandError)) {
        throw new OasisError('Error executing command', {
          message,
        });
      }
      err.send();
    }
  }

  private async executeInteraction(interaction: CommandInteraction) {
    if (!interaction.command) return;

    try {
      for (const handler of this._on_begin_microHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handleInteraction(interaction);
      }

      await Promise.all(this._microHandlers.map(async (handler) => handler.handleInteraction(interaction)));

      for (const handler of this._on_end_microHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handleInteraction(interaction);
      }

      await interaction.command.execute(interaction);
    } catch (err) {
      if (!(err instanceof CommandError)) {
        throw new OasisError('Error executing command', {
          interaction,
        });
      }
      err.send();
    }
  }

  private setMessagePrefix(message: Message) {
    if (message.author.bot) return;

    if (this._globalPrefix && message.content.startsWith(this._globalPrefix)) {
      message.prefix = this._globalPrefix;
    }

    if (message.guild?.prefix && message.content.startsWith(message.guild.prefix)) {
      message.prefix = message.guild.prefix;
    }
  }

  private setMessageArgs(msg: Message) {
    msg.content = msg.content.slice(msg.prefix.length);
    msg.args = msg.content.trim().split(/\s+/);
  }

  private setCommand(msg: Message | CommandInteraction) {
    const commandMsg = new Array<string>();
    while (!msg.command && msg.args.length > 0) {
      commandMsg.push(msg.args.shift()?.toLowerCase() || '');
      const commandByName = this._commands.get(commandMsg.join(' '));
      const commandByAliases = this._commands.find((cmd) => cmd.aliases?.includes(commandMsg.join(' ')));

      Object.assign(msg.command, commandByName || commandByAliases);
    }
  }

  private setManager(cmd: Message | CommandInteraction, pluginsHandler: IPluginsHandler) {
    const pluginId = get(cmd.command, 'pluginId');
    cmd.manager = pluginId ? pluginsHandler.plugins.get(pluginId) || null : null;
  }
}
export default CommandHandler;
