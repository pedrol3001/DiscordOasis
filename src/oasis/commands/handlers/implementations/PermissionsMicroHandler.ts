import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class PermissionsMicroHandler implements IMicroHandler {
  async handleMessage(message: Message) {
    // permissions handler
    if (!message.guild || !message.command?.permissionsList) return;
    for (const requiredPermission of message.command.permissionsList) {
      if (!message.member?.permissions.has(requiredPermission)) {
        const reply = `This command requires the permissions ${message.command.permissionsList.join(', ')}`;
        throw new CommandError(reply, message.channel);
      }
    }
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { PermissionsMicroHandler };
