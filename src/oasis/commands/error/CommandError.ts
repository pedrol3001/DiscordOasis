import Discord from 'discord.js';
import {ICommand} from '@interfaces/ICommand';

class CommandError {
  constructor(
    public message?: string,
    public channel?: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  ) {}

  async send(): Promise<void> {
    await this.channel.send(this.message);
  }
}

export { CommandError };
