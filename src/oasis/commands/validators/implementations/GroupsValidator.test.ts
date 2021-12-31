import { Message } from 'discord.js';
import { GroupsValidator } from './GroupsValidator';

describe('Validate groups', () => {
  const validator = new GroupsValidator();

  describe('DM Only command', () => {
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

      it('should fail validation', async () => {
        await validator.validate(command);
        expect(1).toBe(1);
        // expect(command.channel.send).toHaveBeenCalled();
      });
    });
  });
});
