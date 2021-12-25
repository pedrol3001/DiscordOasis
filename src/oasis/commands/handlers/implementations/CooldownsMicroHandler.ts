import { Collection, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class CooldownsMicroHandler implements IMicroHandler {
  private cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    this.cooldowns = new Collection<string, Collection<string, number>>();
  }

  async handle(msg: Message): Promise<void> {
    // cooldowns handler

    if (!msg.command) return;

    if (!this.cooldowns.has(msg.command.name)) {
      this.cooldowns.set(msg.command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(msg.command.name);
    const cooldownAmount = (msg.command.cooldown || 1) * 1000;

    const timestampValue = timestamps?.get(msg.author.id);

    if (timestampValue !== undefined) {
      const expirationTime = timestampValue + cooldownAmount;

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
