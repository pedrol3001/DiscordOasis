import { ClientApplication, Collection, CommandInteraction, Interaction, Message } from 'discord.js';

import { get } from 'lodash';
import { ICommand } from '../../interfaces/ICommand';
import { OasisError } from '../../error/OasisError';

import { CommandError } from './error/CommandError';
import { ICommandHandler } from './ICommandHandler';
import { IAddCommands } from './providers/AddCommands/IAddCommands';
import { IRemoveCommands } from './providers/RemoveCommands/IRemoveCommands';
import { AddCommandsFromFolder } from './providers/AddCommands/implementations/AddCommandsFromFolder';
import { AddDefaultCommands } from './providers/AddCommands/implementations/AddDefaultCommands';
import { IValidator } from './validators/IValidator';
import { GroupsValidator } from './validators/implementations/GroupsValidator';
import { OptionsValidator } from './validators/implementations/OptionsValidator';
import { PermissionsValidator } from './validators/implementations/PermissionsValidator';
import { RolesValidator } from './validators/implementations/RolesValidator';
import { CooldownsValidator } from './validators/implementations/CooldownsValidator';
import { IPluginsHandler } from '../plugins/IPluginsHandler';
import { PluginsValidator } from './validators/implementations/PluginsValidator';

export type IValidatorExecutionMode = 'onBegin' | 'async' | 'onEnd';

class CommandHandler implements ICommandHandler {
  private _commands: Collection<string, ICommand> = new Collection<string, ICommand>();

  private readonly globalPrefix: string;

  private readonly commandsFolder: string;

  private onBeginValidators: IValidator[];

  private validators: IValidator[];

  private onEndValidators: IValidator[];

  public get commands(): Array<ICommand> {
    return Array.from(this._commands.values());
  }

  public constructor(commandsFolder: string, globalPrefix: string) {
    this.commandsFolder = commandsFolder;
    this.globalPrefix = globalPrefix;
    this.validators = [new GroupsValidator(), new PermissionsValidator(), new RolesValidator()];

    this.onBeginValidators = [new PluginsValidator(), new CooldownsValidator()];
    this.onEndValidators = [new OptionsValidator()];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async setup(_application: ClientApplication) {
    await this.edit(AddDefaultCommands);
    await this.edit(AddCommandsFromFolder, this.commandsFolder);
  }

  public addValidator(handler: IValidator, onBegin: IValidatorExecutionMode = 'async') {
    switch (onBegin) {
      case 'onBegin':
        this.onBeginValidators.push(handler);
        break;
      case 'async':
        this.validators.push(handler);
        break;
      case 'onEnd':
        this.onEndValidators.push(handler);
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
      for (const validator of this.onBeginValidators) {
        // eslint-disable-next-line no-await-in-loop
        await validator.validate(cmd);
      }

      await Promise.all(this.validators.map(async (validator) => validator.validate(cmd)));

      for (const validator of this.onEndValidators) {
        // eslint-disable-next-line no-await-in-loop
        await validator.validate(cmd);
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
