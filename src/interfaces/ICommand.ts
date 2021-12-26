import { Message, BitFieldResolvable, PermissionString } from 'discord.js';

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

  execute(msg: Message): Promise<void>;
}
