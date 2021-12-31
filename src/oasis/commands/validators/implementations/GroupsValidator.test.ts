import { Message } from 'discord.js';
import { CommandError } from '../../error/CommandError';
import { GroupsValidator } from './GroupsValidator';

describe('Validate groups', () => {
  const validator = new GroupsValidator();

  describe('inside GUILD_TEXT channel', () => {
    const command = {
      commandHolder: {
        group: 'dmOnly',
        args: [],
        options: [
          {
            required: true,
          },
        ],
      },
      channel: {
        send: jest.fn(),
        type: 'GUILD_TEXT',
      },
    } as unknown as Message;

    describe('DM only command', () => {
      it('should fail validation', () => {
        validator.validate(command).catch((error) => {
          expect(error).not.toBeInstanceOf(Error);
          expect(error).toBeInstanceOf(CommandError);
          expect(error.message).toBe('You can only use this command inside dms');
        });
      });
    });
  });

  describe('inside DM channel', () => {
    const command = {
      commandHolder: {
        group: 'guildOnly',
        args: [],
        options: [
          {
            required: true,
          },
        ],
      },
      channel: {
        send: jest.fn(),
        type: 'DM',
      },
    } as unknown as Message;

    describe('DM only command', () => {
      it('should fail validation', () => {
        validator.validate(command).catch((error) => {
          expect(error).not.toBeInstanceOf(Error);
          expect(error).toBeInstanceOf(CommandError);
          expect(error.message).toBe('You can only use this command inside a server');
        });
      });
    });
  });
});
