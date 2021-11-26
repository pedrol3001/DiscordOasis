import { Client } from 'discord.js';
import { container } from 'tsyringe';
import { LoadGuildsUseCase } from './LoadGuildsUseCase';

const LoadGuildsController = {
  handle: async (client: Client) => {
    const guilds = client.guilds.cache;

    const loadGuildUseCase = container.resolve(LoadGuildsUseCase);

    await loadGuildUseCase.execute(guilds);
  },
};

export { LoadGuildsController };
