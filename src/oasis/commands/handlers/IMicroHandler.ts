import { CommandInteraction, Message } from 'discord.js';

interface IMicroHandler {
  handle(cmd: Message | CommandInteraction): Promise<void>;
}

export { IMicroHandler };
