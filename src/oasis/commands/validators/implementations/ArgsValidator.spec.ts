import { Message } from 'discord.js';
import { ArgsValidator } from './ArgsValidator';
import { CommandError } from '../../error/CommandError';

describe('Validate arguments', () => {
  const validator = new ArgsValidator();

  describe('with insufficient required arguments', () => {
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
        expect(error.message).toBe('Missing required argument');
      });
    });
  });

  describe('with exceeded arguments ', () => {
    const command = {
      args: ['testId', 'blue', 'something'],
      commandHolder: {
        options: [
          {
            name: 'id',
            required: true,
          },
          {
            name: 'color',
            required: false,
          },
        ],
      },
    } as unknown as Message;

    it('should fail validation ', () => {
      validator.validate(command).catch((error) => {
        expect(error).toBeInstanceOf(CommandError);
        expect(error).not.toBeInstanceOf(Error);
        expect(error.message).toBe('More arguments than needed');
      });
    });
  });
});
