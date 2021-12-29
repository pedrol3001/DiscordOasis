import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import _, { assign } from 'lodash';
import { ApplicationCommandOption } from 'discord.js';
import { ICommand } from '../../interfaces/ICommand';
import { discordRest } from '../rest';
import logger from '../logger';
import { optionsMapper } from './options';
import { OasisError } from '../../error/OasisError';

function recursiveMergeArrayBy(array: RESTPostAPIApplicationCommandsJSONBody[], attribute: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _.uniqWith(array, (pre: any, cur: any) => {
    if (pre[attribute] === cur[attribute]) {
      const mergedOptions = cur.options.concat(pre.options);
      cur.options = recursiveMergeArrayBy(mergedOptions, attribute);
      return true;
    }
    return false;
  });
}

function addOptions(
  subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  options: ApplicationCommandOption[],
) {
  options.forEach((option: ApplicationCommandOption) => {
    const { type, ...optionsAttributes } = option;
    const mapper = optionsMapper(subCommandRef);
    mapper[type].addOption(assign(new mapper.BOOLEAN.OptionBuild(), optionsAttributes));
  });
}

function parseCommand(command: ICommand): RESTPostAPIApplicationCommandsJSONBody {
  const fullSplittedCommandName = command.name.split(' ');
  const [commandName, subCommandGroupName, subCommandName] = fullSplittedCommandName;

  const commandDescription = command.description.command;
  const subCommandGroupDescription = command.description?.subCommandGroup || commandDescription;
  const subCommandDescription = command.description?.subCommand || subCommandGroupDescription || commandDescription;

  const commandData = new SlashCommandBuilder();
  commandData.setName(commandName);
  commandData.setDescription(commandDescription);

  let subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder | null = null;

  if (subCommandGroupName && subCommandName) {
    commandData.addSubcommandGroup((subCommandGroup) =>
      subCommandGroup
        .setName(subCommandGroupName)
        .setDescription(subCommandGroupDescription)
        .addSubcommand((subCommand) => {
          subCommand.setName(subCommandName).setDescription(subCommandDescription);
          subCommandRef = subCommand;
          return subCommand;
        }),
    );
  } else if (subCommandGroupName) {
    commandData.addSubcommand((subCommand) => {
      subCommand.setName(subCommandGroupName).setDescription(subCommandDescription);
      subCommandRef = subCommand;
      return subCommand;
    });
  } else {
    subCommandRef = commandData;
  }

  if (!subCommandRef) throw new OasisError('Unknown error reading the command');

  addOptions(subCommandRef, command.options);

  return commandData.toJSON() as RESTPostAPIApplicationCommandsJSONBody;
}

async function registerCommands(
  clientId: string,
  commands: RESTPostAPIApplicationCommandsJSONBody[],
  guildId?: string,
) {
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
  await registerCommands(applicationId, mergedSlashCommands, guildId);
  logger.info(`Successfully reloaded application (/) commands for guild ${guildId || 'Global'}`);
}

export { registerCommands, parseCommand, setSlashCommands };
