import Discord from 'discord.js';
import { CommandError } from 'oasis/commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class PermissionsMicroHandler implements IMicroHandler {
  async handle(msg: Discord.Message): Promise<void> {
    // permissions handler
    if (msg.guild && msg.command?.permissions) {
      for (const requiredPermission of msg.command.permissions) {
        if (!msg.member?.hasPermission(requiredPermission)) {
          const reply = `This command requires the permissions ${msg.command.permissions.join(', ')}`;
          throw new CommandError(reply, msg.channel);
        }
      }
    }
  }
}

export { PermissionsMicroHandler };
