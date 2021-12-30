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
import { assign } from 'lodash';

export function optionsMapper(subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionMapper: Record<string, any> = {
    BOOLEAN: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addBooleanOption(assign(new SlashCommandBooleanOption(), optionsAttributes)),
    },
    NUMBER: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addNumberOption(assign(new SlashCommandNumberOption(), optionsAttributes)),
    },
    INTEGER: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addIntegerOption(assign(new SlashCommandIntegerOption(), optionsAttributes)),
    },
    STRING: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addStringOption(assign(new SlashCommandStringOption(), optionsAttributes)),
    },
    MENTIONABLE: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addMentionableOption(assign(new SlashCommandMentionableOption(), optionsAttributes)),
    },
    USER: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addUserOption(assign(new SlashCommandUserOption(), optionsAttributes)),
    },
    CHANNEL: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addChannelOption(assign(new SlashCommandChannelOption(), optionsAttributes)),
    },
    ROLE: {
      addOption: (optionsAttributes: unknown) =>
        subCommandRef.addRoleOption(assign(new SlashCommandRoleOption(), optionsAttributes)),
    },
  };
  return optionMapper;
}
