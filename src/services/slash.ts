import { Routes } from 'discord-api-types/v9';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';
import { ICommand } from '../interfaces/ICommand';
import { discordRest } from './rest';
import logger from '../services/logger';

function parseCommand(command: ICommand): unknown {
  const [commandName, subCommandGroupName, subCommandName] = command.name.split(' ');

  const commandData = new SlashCommandBuilder();
  const subCommandGroup = new SlashCommandSubcommandGroupBuilder();
  const subCommand = new SlashCommandSubcommandBuilder();

  commandData.setName(commandName);
  commandData.setDescription(command.description);

  if (subCommandGroupName) {
    subCommandGroup.setName(subCommandGroupName);
    subCommandGroup.setDescription(command.description);
    commandData.addSubcommandGroup(subCommandGroup);
  }
  if (subCommandName !== undefined) {
    subCommand.setName(subCommandName);
    subCommand.setDescription(command.description);
    subCommandGroup.addSubcommand(subCommand);
  }

  return commandData.toJSON();
}

async function registerCommands(clientId: string, commands: unknown, guildId?: string) {
  try {
    const routes =
      guildId === undefined ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);

    await discordRest.put(routes, { body: commands });

    logger.info('Successfully reloaded application (/) commands.', commands);
  } catch (err) {
    logger.error(err);
  }
}

export { registerCommands, parseCommand };
