import { Guild, GuildMember, Message, RoleManager } from 'discord.js';
import { CommandError } from '../../error/CommandError';
import { RolesValidator } from './RolesValidator';

describe('Validate roles rules', () => {
  const rolesValidator = new RolesValidator();

  const roleManager: RoleManager = {
    cache: [{ name: 'test' }, { name: 'wrong' }],
  } as unknown as RoleManager;

  const guild: Guild = {
    roles: roleManager,
  } as unknown as Guild;

  describe('user with invalid role', () => {
    const wrongRoleManager = {
      cache: [{ name: 'wrong' }],
    } as unknown as RoleManager;

    const member: GuildMember = {
      roles: wrongRoleManager,
    } as unknown as GuildMember;

    const command = {
      guild,
      member,
      commandHolder: {
        rolesList: ['test'],
      },
      channel: {
        send: jest.fn(),
        type: 'GUILD_TEXT',
      },
    } as unknown as Message;

    it('should fail validation', () => {
      rolesValidator.validate(command).catch((error) => {
        expect(error).toBeInstanceOf(CommandError);
        expect(error).not.toBeInstanceOf(Error);
        expect(command.channel.send).toHaveBeenCalledTimes(1);
        expect(error.message).toBe('This command requires one of the roles test');
      });
    });
  });
});
