import { ClientApplication, Collection, CommandInteraction, Interaction, Message } from 'discord.js';

import { get } from 'lodash';
import { ICommand } from '../../interfaces/ICommand';
import { OasisError } from '../../error/OasisError';

import { CommandError } from './error/CommandError';
import { ICommandHandler } from './ICommandHandler';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { AddCommandsFromFolder } from './providers/AddCommands/implementations/AddCommandsFromFolder';
import { IMicroHandler } from './handlers/IMicroHandler';
import { GroupsMicroHandler } from './handlers/implementations/GroupsMicroHandler';
import { OptionsMicroHandler } from './handlers/implementations/OptionsMicroHandler';
import { PermissionsMicroHandler } from './handlers/implementations/PermissionsMicroHandler';
import { RolesMicroHandler } from './handlers/implementations/RolesMicroHandler';
import { CooldownsMicroHandler } from './handlers/implementations/CooldownsMicroHandler';
import { IPluginsHandler } from '../plugins/IPluginsHandler';
import { PluginsMicroHandler } from './handlers/implementations/PluginsMicroHandler';

export type IMicroHandlerExecutionMode = 'onBegin' | 'async' | 'onEnd';

class CommandHandler implements ICommandHandler {
  private _commands: Collection<string, ICommand> = new Collection<string, ICommand>();

  private readonly globalPrefix: string;

  private readonly commandsFolder: string;

  private onBeginMicroHandlers: IMicroHandler[];

  private microHandlers: IMicroHandler[];

  private onEndMicroHandlers: IMicroHandler[];

  public get commands(): Array<ICommand> {
    return Array.from(this._commands.values());
  }

  public constructor(commandsFolder: string, globalPrefix: string) {
    this.commandsFolder = commandsFolder;
    this.globalPrefix = globalPrefix;
    this.microHandlers = [new GroupsMicroHandler(), new PermissionsMicroHandler(), new RolesMicroHandler()];

    this.onBeginMicroHandlers = [new PluginsMicroHandler(), new CooldownsMicroHandler()];
    this.onEndMicroHandlers = [new OptionsMicroHandler()];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async setup(_application: ClientApplication) {
    await this.edit(AddCommandsFromFolder, this.commandsFolder);
    // setSlashCommands(application.id, this.commands);
  }

  public addMicroHandler(handler: IMicroHandler, onBegin: IMicroHandlerExecutionMode = 'async') {
    switch (onBegin) {
      case 'onBegin':
        this.onBeginMicroHandlers.push(handler);
        break;
      case 'async':
        this.microHandlers.push(handler);
        break;
      case 'onEnd':
        this.onEndMicroHandlers.push(handler);
        break;
      default:
        throw new OasisError('Invalid micro handler execution mode');
    }
  }

  public async edit(ConfType: new () => IAddCommands | IRemoveCommands, ...args: string[]) {
    const provider = new ConfType();
    await provider.handle(this._commands, ...args);
  }

  public async handle(cmd: Message | Interaction, pluginsHandler: IPluginsHandler) {
    if (cmd instanceof Interaction) {
      if (!cmd.isCommand()) return;
    } else {
      this.setMessagePrefix(cmd);
      if (!cmd.prefix) return;
    }

    this.setArgs(cmd);
    this.setCommandHandler(cmd);
    this.setManager(cmd, pluginsHandler);
    await this.executeHandler(cmd);
  }

  private async executeHandler(cmd: Message | CommandInteraction) {
    if (!cmd.commandHolder) return;

    try {
      for (const handler of this.onBeginMicroHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handle(cmd);
      }

      await Promise.all(this.microHandlers.map(async (handler) => handler.handle(cmd)));

      for (const handler of this.onEndMicroHandlers) {
        // eslint-disable-next-line no-await-in-loop
        await handler.handle(cmd);
      }

      await cmd.commandHolder.execute(cmd);
    } catch (err) {
      if (!(err instanceof CommandError)) {
        throw new OasisError('Error executing command', {
          cmd,
          error: err,
        });
      }
      err.send();
    }
  }

  private setMessagePrefix(message: Message) {
    if (message.author.bot) return;

    if (this.globalPrefix && message.content.startsWith(this.globalPrefix)) {
      message.prefix = this.globalPrefix;
    }

    if (message.guild?.prefix && message.content.startsWith(message.guild.prefix)) {
      message.prefix = message.guild.prefix;
    }
  }

  private setArgs(cmd: Message | CommandInteraction) {
    if (cmd instanceof CommandInteraction) {
      const { commandName } = cmd;

      const subCommand = cmd.options.getSubcommand(false);
      const subCommandGroup = cmd.options.getSubcommandGroup(false);

      cmd.args = [commandName];

      if (subCommandGroup) {
        cmd.args.push(subCommandGroup);
      }
      if (subCommand) {
        cmd.args.push(subCommand);
      }

      const optionsArgs = get(cmd.options, '_hoistedOptions');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valueMappedArgs = optionsArgs.map((option: any) => {
        return option.value;
      });

      cmd.args.push(...valueMappedArgs);
    } else {
      const command = cmd.content.slice(cmd.prefix.length);
      cmd.args = command.trim().split(/\s+/);
    }
  }

  private setCommandHandler(msg: Message | CommandInteraction) {
    const commandMsg = new Array<string>();
    while (!msg.commandHolder && msg.args.length > 0) {
      commandMsg.push(msg.args.shift()?.toLowerCase() || '');
      const commandByName = this._commands.get(commandMsg.join(' ')) || null;
      const commandByAliases = this._commands.find((cmd) => cmd.aliases?.includes(commandMsg.join(' '))) || null;
      msg.commandHolder = commandByName || commandByAliases;
    }
  }

  private setManager(cmd: Message | CommandInteraction, pluginsHandler: IPluginsHandler) {
    const pluginId = get(cmd.commandHolder, 'pluginId');
    cmd.manager = pluginId ? pluginsHandler.plugins.get(pluginId) || null : null;
  }
}
export default CommandHandler;
