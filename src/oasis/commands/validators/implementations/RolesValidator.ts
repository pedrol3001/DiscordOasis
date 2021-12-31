import { CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../error/CommandError';
import { IValidator } from '../IValidator';

class RolesValidator implements IValidator {
  async validate(cmd: Message | CommandInteraction) {
    // roles handler
    if (!cmd.guild || !cmd.member || !cmd.commandHolder?.rolesList) return;

    const guildRoles = (requiredRole: string) => cmd.guild?.roles.cache.some((role) => role.name === requiredRole);

    const memberRolesType = cmd.member.roles as Exclude<typeof cmd.member.roles, string[]>;
    const memberRoles = (requiredRole: string) => memberRolesType.cache.some((role) => role.name === requiredRole);

    const roles = cmd.commandHolder.rolesList.filter((requiredRole: string) => {
      return !!(guildRoles(requiredRole) && memberRoles(requiredRole));
    });

    if (roles.length === 0) {
      const reply = `This command requires one of the roles ${cmd.commandHolder.rolesList.join(',')}`;
      throw new CommandError(reply, cmd.channel);
    }
  }
}

export { RolesValidator };
