import { Message, BitFieldResolvable, PermissionString, Interaction } from 'discord.js';

export type ICommandGroups = 'guildOnly' | 'global' | 'dmOnly';

export interface ICommand {
  name: string;
  group: ICommandGroups;
  aliases: Array<string>;
  description: string;
  args?: boolean;
  usage?: string;
  cooldown?: number;
  rolesList?: Array<string>;
  permissionsList?: Array<BitFieldResolvable<PermissionString, bigint>>;

  execute(cmd: Message | Interaction): Promise<void>;
}
