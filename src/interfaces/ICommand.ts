import { Message, BitFieldResolvable, PermissionString, Interaction, ApplicationCommandOption } from 'discord.js';

export type ICommandGroups = 'guildOnly' | 'global' | 'dmOnly';

export interface ICommandDescription {
  command: string;
  subCommand?: string;
  subCommandGroup?: string;
}

export interface ICommand {
  name: string;
  group: ICommandGroups;
  aliases: Array<string>;
  description: ICommandDescription;
  options: ApplicationCommandOption[];
  cooldown?: number;
  rolesList?: Array<string>;
  permissionsList?: Array<BitFieldResolvable<PermissionString, bigint>>;

  execute(cmd: Message | Interaction): Promise<void>;
}
