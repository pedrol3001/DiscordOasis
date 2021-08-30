import Discord from 'discord.js';

class CommandError {
  constructor(
    public message?: string,
    public channel?: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  ) {}

  async send(): Promise<void> {
    await this.channel?.send(this.message || 'An error occurred.');
  }
}

export { CommandError };
