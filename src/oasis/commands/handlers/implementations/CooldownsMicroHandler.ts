import Discord from 'discord.js';
import { CommandError } from 'oasis/commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class CooldownsMicroHandler implements IMicroHandler {
  private cooldowns: Discord.Collection<string | undefined, Discord.Collection<string, number>>;

  constructor() {
    this.cooldowns = new Discord.Collection<string | undefined, Discord.Collection<string, number>>();
  }

  async handle(msg: Discord.Message): Promise<void> {
    // cooldowns handler
    if (!this.cooldowns.has(msg.command?.name)) {
      this.cooldowns.set(msg.command?.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(msg.command?.name);
    const cooldownAmount = (msg.command?.cooldown || 1) * 1000;

    if (timestamps?.has(msg.author.id)) {
      const expirationTime = timestamps.get(msg.author.id) || 0 + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const reply = `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          msg.command?.name
        }\` command.`;

        throw new CommandError(reply, msg.channel);
      }
    }

    timestamps?.set(msg.author.id, now);
    setTimeout(() => timestamps?.delete(msg.author.id), cooldownAmount);
  }
}

export { CooldownsMicroHandler };
