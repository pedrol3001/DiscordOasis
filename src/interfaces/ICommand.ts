import { Message, BitFieldResolvable, PermissionString, Interaction } from 'discord.js';

export type ICommandGroups = 'guildOnly' | 'global' | 'dmOnly';

export interface ICommand {
  name: string;
  aliases: Array<string>;
  args?: boolean;
  cooldown?: number;
  description: string;
  usage?: string;
  roles?: Array<string>;
  group: ICommandGroups;
  permissions?: Array<BitFieldResolvable<PermissionString, bigint>>;

  execute(cmd: Message | Interaction): Promise<void>;
}
