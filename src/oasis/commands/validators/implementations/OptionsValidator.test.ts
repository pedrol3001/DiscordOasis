import { Message } from 'discord.js';
import { OptionsValidator } from './OptionsValidator';
import { CommandError } from '../../error/CommandError';

describe('Validate options', () => {
  const validator = new OptionsValidator();

  describe('with insufficient required options', () => {
    const command = {
      args: [],
      commandHolder: {
        options: [
          {
            required: true,
          },
        ],
      },
    } as unknown as Message;

    it('should fail validation ', () => {
      validator.validate(command).catch((error) => {
        expect(error).toBeInstanceOf(CommandError);
        expect(error).not.toBeInstanceOf(Error);
        expect(error.message).toBe('Missing required option');
      });
    });
  });
});
