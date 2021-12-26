import { Collection, CommandInteraction, Message, User } from 'discord.js';
import { CommandError } from '../../../commands/error/CommandError';
import { IMicroHandler } from '../IMicroHandler';

class CooldownsMicroHandler implements IMicroHandler {
  private cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    this.cooldowns = new Collection<string, Collection<string, number>>();
  }

  async handle(cmd: Message | CommandInteraction) {
    if (!cmd.command) return;

    if (!this.cooldowns.has(cmd.command.name)) {
      this.cooldowns.set(cmd.command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = this.cooldowns.get(cmd.command.name);
    const cooldownAmount = (cmd.command.cooldown || 1) * 1000;

    const sender: User = cmd instanceof Message ? cmd.author : cmd.user;

    const timestampValue = timestamps?.get(sender.id);

    if (timestampValue !== undefined) {
      const expirationTime = timestampValue + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const reply = `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          cmd.command?.name
        }\` command.`;

        throw new CommandError(reply, cmd.channel);
      }
    }

    timestamps?.set(sender.id, now);
    setTimeout(() => timestamps?.delete(sender.id), cooldownAmount);
  }
}

export { CooldownsMicroHandler };
