import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommand } from '../interfaces/ICommand';
import { discordRest } from './rest';
import logger from '../services/logger';
import { recursiveMergeArrayBy } from '../utils/utils';

function parseCommand(command: ICommand): unknown {
  const fullSplittedCommandName = command.name.split(' ');
  const [commandName, subCommandGroupName, subCommandName] = fullSplittedCommandName;

  const commandData = new SlashCommandBuilder();
  commandData.setName(commandName);
  commandData.setDescription(command.description);

  if (subCommandGroupName && subCommandName) {
    commandData.addSubcommandGroup((subCommandGroup) => {
      subCommandGroup.setName(subCommandGroupName);
      subCommandGroup.setDescription(command.description);
      subCommandGroup.addSubcommand((subCommand) => {
        subCommand.setName(subCommandName);
        subCommand.setDescription(command.description);
        return subCommand;
      });
      return subCommandGroup;
    });
  } else if (subCommandGroupName) {
    commandData.addSubcommand((subCommand) => {
      subCommand.setName(subCommandGroupName);
      subCommand.setDescription(command.description);
      return subCommand;
    });
  } else {
    Object.assign(commandData.options, ...command.options);
  }

  return commandData.toJSON();
}

async function registerCommands(clientId: string, commands: unknown, guildId?: string) {
  try {
    const routes =
      guildId === undefined ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);
    return await discordRest.put(routes, { body: commands });
  } catch (err) {
    return logger.error(err);
  }
}

async function setSlashCommands(applicationId: string, commands: ICommand[], guildId?: string) {
  const slashCommandsJSON = commands.map((command) => {
    return parseCommand(command);
  });
  const mergedSlashCommands = recursiveMergeArrayBy(slashCommandsJSON, 'name');
  const response = await registerCommands(applicationId, mergedSlashCommands, guildId);
  logger.info(`Successfully reloaded application (/) commands for guild ${guildId || 'Global'}`, response);
}

export { registerCommands, parseCommand, setSlashCommands };
