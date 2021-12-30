import {
  Message,
  BitFieldResolvable,
  PermissionString,
  Interaction,
  ApplicationCommandOption,
  ApplicationCommandSubGroup,
  ApplicationCommandSubCommand,
} from 'discord.js';

export type ICommandGroups = 'guildOnly' | 'global' | 'dmOnly';

export interface ICommandDescription {
  command: string;
  subCommand?: string;
  subCommandGroup?: string;
}

export type ICommandOptions = Exclude<
  ApplicationCommandOption,
  ApplicationCommandSubGroup | ApplicationCommandSubCommand
>;

export interface ICommand {
  name: string;
  group: ICommandGroups;
  aliases: Array<string>;
  description: ICommandDescription;
  options: ICommandOptions[];
  cooldown?: number;
  rolesList?: Array<string>;
  permissionsList?: Array<BitFieldResolvable<PermissionString, bigint>>;

  execute(cmd: Message | Interaction): Promise<void>;
}
