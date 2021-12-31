import { Message } from 'discord.js';
import { OptionsValidator } from './OptionsValidator';
import { CommandError } from '../../error/CommandError';

xdescribe('Validate options', () => {
  const validator = new OptionsValidator();

  it('should not accept the command', async () => {
    const command = {
      commandHolder: {
        args: [],
        options: [
          {
            required: true,
          },
        ],
      },
    } as unknown as Message;

    await expect(validator.validate(command)).toThrow(CommandError);
  });
});
