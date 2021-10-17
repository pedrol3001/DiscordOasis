import Discord from 'discord.js';

interface IMicroHandler {
  handle(msg: Discord.Message): Promise<void>;
}

export { IMicroHandler };
