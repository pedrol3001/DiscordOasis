import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../error/CommandError';
import { IValidator } from '../IValidator';

class PermissionsValidator implements IValidator {
  async validate(cmd: Message | CommandInteraction) {
    // permissions handler
    if (!cmd.guild || !cmd.member || !cmd.commandHolder?.permissionsList) return;
    for (const requiredPermission of cmd.commandHolder.permissionsList) {
      const permissions = cmd.member.permissions as Exclude<typeof cmd.member.permissions, string>;
      if (!permissions.has(requiredPermission)) {
        const reply = `This command requires the permissions ${cmd.commandHolder.permissionsList.join(', ')}`;
        throw new CommandError(reply, cmd.channel);
      }
    }
  }
}

export { PermissionsValidator };
