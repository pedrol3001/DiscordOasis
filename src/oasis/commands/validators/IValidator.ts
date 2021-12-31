import { CommandInteraction, Message } from 'discord.js';

interface IValidator {
  validate(cmd: Message | CommandInteraction): Promise<void>;
}

export { IValidator };
