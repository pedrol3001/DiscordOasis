import { CommandInteraction, Message } from 'discord.js';

interface IMicroHandler {
  handleMessage(cmd: Message): Promise<void>;
  handleInteraction(cmd: CommandInteraction): Promise<void>;
}

export { IMicroHandler };
