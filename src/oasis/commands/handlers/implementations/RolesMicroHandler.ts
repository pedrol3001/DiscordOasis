import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class RolesMicroHandler implements IMicroHandler {
  async handleMessage(message: Message) {
    // roles handler
    if (!message.guild || !message.command?.rolesList) return;
    const roles = message.command.rolesList.filter((requiredRole: string) => {
      return !!(
        message.guild?.roles.cache.some((role) => role.name === requiredRole) &&
        message.member?.roles.cache.some((role) => role.name === requiredRole)
      );
    });

    if (roles.length === 0) {
      const reply = `This command requires one of the roles ${message.command.rolesList.join(',')}`;
      throw new CommandError(reply, message.channel);
    }
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { RolesMicroHandler };
