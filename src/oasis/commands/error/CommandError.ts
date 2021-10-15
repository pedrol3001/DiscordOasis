import {TextChannel, NewsChannel, DMChannel } from "discord.js";


class CommandError {
  constructor(
    public message?: string,
    public channel?: TextChannel | DMChannel | NewsChannel,
  ) {}

  async send(): Promise<void> {
    await this.channel?.send(this.message || 'An error occurred.');
  }
}

export { CommandError };
