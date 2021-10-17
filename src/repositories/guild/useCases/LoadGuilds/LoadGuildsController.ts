import Discord from 'discord.js';
import { container } from 'tsyringe';
import { LoadGuildsUseCase } from './LoadGuildsUseCase';

const LoadGuildsController = {
  handle: async (client: Discord.Client) => {
    const guilds = client.guilds.cache;

    const loadGuildUseCase = container.resolve(LoadGuildsUseCase);

    await loadGuildUseCase.execute(guilds);
  },
};

export { LoadGuildsController };
