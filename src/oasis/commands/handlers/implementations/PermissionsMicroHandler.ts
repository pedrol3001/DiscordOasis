import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class PermissionsMicroHandler implements IMicroHandler {
  async handle(cmd: Message | CommandInteraction) {
    // permissions handler
    if (!cmd.guild || !cmd.member || !cmd.command?.permissionsList) return;
    for (const requiredPermission of cmd.command.permissionsList) {
      const permissions = cmd.member.permissions as Exclude<typeof cmd.member.permissions, string>;
      if (!permissions.has(requiredPermission)) {
        const reply = `This command requires the permissions ${cmd.command.permissionsList.join(', ')}`;
        throw new CommandError(reply, cmd.channel);
      }
    }
  }
}

export { PermissionsMicroHandler };
