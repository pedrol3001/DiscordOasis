import { Routes } from 'discord-api-types/v9';
import {
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandUserOption,
} from '@discordjs/builders';
import _, { assign } from 'lodash';
import { ICommand } from '../interfaces/ICommand';
import { discordRest } from './rest';
import logger from '../services/logger';
import { OasisError } from '..';

function recursiveMergeArrayBy(array: Array<unknown>, attribute: string) {
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

function parseCommand(command: ICommand): unknown {
  const fullSplittedCommandName = command.name.split(' ');
  const [commandName, subCommandGroupName, subCommandName] = fullSplittedCommandName;

  const commandData = new SlashCommandBuilder();
  commandData.setName(commandName);
  commandData.setDescription(command.description);

  let subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder | null = null;

  if (subCommandGroupName && subCommandName) {
    commandData.addSubcommandGroup((subCommandGroup) =>
      subCommandGroup
        .setName(subCommandGroupName)
        .setDescription(command.description)
        .addSubcommand((subCommand) => {
          subCommand.setName(subCommandName).setDescription(command.description);
          subCommandRef = subCommand;
          return subCommand;
        }),
    );
  } else if (subCommandGroupName) {
    commandData.addSubcommand((subCommand) => {
      subCommand.setName(subCommandGroupName).setDescription(command.description);
      subCommandRef = subCommand;
      return subCommand;
    });
  } else {
    subCommandRef = commandData;
  }

  command.options.forEach((option) => {
    if (!subCommandRef) throw new OasisError('Unknown error reading the command');

    const { type, ...optionsAttributes } = option;

    switch (type) {
      case 'BOOLEAN':
        subCommandRef.addBooleanOption(assign(new SlashCommandBooleanOption(), optionsAttributes));
        break;
      case 'NUMBER':
        subCommandRef.addNumberOption(assign(new SlashCommandNumberOption(), optionsAttributes));
        break;
      case 'INTEGER':
        subCommandRef.addIntegerOption(assign(new SlashCommandIntegerOption(), optionsAttributes));
        break;
      case 'STRING':
        subCommandRef.addStringOption(assign(new SlashCommandStringOption(), optionsAttributes));
        break;
      case 'MENTIONABLE':
        subCommandRef.addMentionableOption(assign(new SlashCommandMentionableOption(), optionsAttributes));
        break;
      case 'USER':
        subCommandRef.addUserOption(assign(new SlashCommandUserOption(), optionsAttributes));
        break;
      case 'CHANNEL':
        subCommandRef.addChannelOption(assign(new SlashCommandChannelOption(), optionsAttributes));
        break;
      case 'ROLE':
        subCommandRef.addRoleOption(assign(new SlashCommandRoleOption(), optionsAttributes));
        break;
      default:
        throw new OasisError('Argument type not supported');
    }
  });

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
  await registerCommands(applicationId, mergedSlashCommands, guildId);
  logger.info(`Successfully reloaded application (/) commands for guild ${guildId || 'Global'}`);
}

export { registerCommands, parseCommand, setSlashCommands };
