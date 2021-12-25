import { Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class RolesMicroHandler implements IMicroHandler {
  async handle(msg: Message): Promise<void> {
    // roles handler
    if (!msg.guild || !msg.command?.roles) return;
    const roles = msg.command.roles.filter((requiredRole: string) => {
      return !!(
        msg.guild?.roles.cache.some((role) => role.name === requiredRole) &&
        msg.member?.roles.cache.some((role) => role.name === requiredRole)
      );
    });

    if (roles.length === 0) {
      const reply = `This command requires one of the roles ${msg.command.roles.join(',')}`;
      throw new CommandError(reply, msg.channel);
    }
  }
}

export { RolesMicroHandler };
