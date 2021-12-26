import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommand } from '../interfaces/ICommand';
import { discordRest } from './rest';
import logger from '../services/logger';

function parseCommand(command: ICommand): any {
  const data = new SlashCommandBuilder();
  data.setName(command.name);
  data.setDescription(command.description);
  return data.toJSON();
}

async function registerCommands(clientId: string, commands: any, guildId?: string) {
  try {
    logger.info('Started refreshing application (/) commands.');

    const routes =
      guildId === undefined ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);

    await discordRest.put(routes, { body: commands });

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error(error);
  }
}

export { registerCommands, parseCommand };
