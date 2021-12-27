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
  const fullSplittedCommandName = command.name.split(' ');
  const [commandName, subCommandGroupName, subCommandName] = fullSplittedCommandName;

  const commandData = new SlashCommandBuilder();
  const subCommand = new SlashCommandSubcommandBuilder();

  commandData.setName(commandName);
  commandData.setDescription(command.description);

  if (subCommandGroupName && subCommandName) {
    const subCommandGroup = new SlashCommandSubcommandGroupBuilder();

    subCommandGroup.setName(subCommandGroupName);
    subCommandGroup.setDescription(command.description);
    commandData.addSubcommandGroup(subCommandGroup);

    subCommand.setName(subCommandName);
    subCommand.setDescription(command.description);
    subCommandGroup.addSubcommand(subCommand);
  } else if (subCommandGroupName) {
    subCommand.setName(subCommandGroupName);
    subCommand.setDescription(command.description);
    commandData.addSubcommand(subCommand);
  }

  return commandData.toJSON();
}

async function registerCommands(clientId: string, commands: unknown, guildId?: string) {
  try {
    const routes =
      guildId === undefined ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);

    const response = await discordRest.put(routes, { body: commands });

    logger.info('Successfully reloaded application (/) commands.', response);
  } catch (err) {
    logger.error(err);
  }
}

export { registerCommands, parseCommand };
