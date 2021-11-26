import { Message } from 'discord.js';

interface IMicroHandler {
  handle(msg: Message): Promise<void>;
}

export { IMicroHandler };
