import { Collection, CommandInteraction, Message } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class CooldownsMicroHandler implements IMicroHandler {
  private cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    this.cooldowns = new Collection<string, Collection<string, number>>();
  }

  async handleMessage(message: Message) {
    // cooldowns handler

    if (!message.command) return;

    if (!this.cooldowns.has(message.command.name)) {
      this.cooldowns.set(message.command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(message.command.name);
    const cooldownAmount = (message.command.cooldown || 1) * 1000;

    const timestampValue = timestamps?.get(message.author.id);

    if (timestampValue !== undefined) {
      const expirationTime = timestampValue + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const reply = `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          message.command?.name
        }\` command.`;

        throw new CommandError(reply, message.channel);
      }
    }

    timestamps?.set(message.author.id, now);
    setTimeout(() => timestamps?.delete(message.author.id), cooldownAmount);
  }

  async handleInteraction(interaction: CommandInteraction) {
    console.log(interaction);
  }
}

export { CooldownsMicroHandler };
