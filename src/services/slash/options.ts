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
import { ApplicationCommandOption } from 'discord.js';
import { assign } from 'lodash';

type OptionAttribute = Omit<ApplicationCommandOption, 'type'>;
type AddOption = (optionsAttributes: OptionAttribute) => void;
interface OptionMapper {
  addOption: AddOption;
}
export function optionsMapper(subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionMapper: Record<string, OptionMapper> = {
    BOOLEAN: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addBooleanOption(assign(new SlashCommandBooleanOption(), optionsAttributes));
      },
    },
    NUMBER: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addNumberOption(assign(new SlashCommandNumberOption(), optionsAttributes));
      },
    },
    INTEGER: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addIntegerOption(assign(new SlashCommandIntegerOption(), optionsAttributes));
      },
    },
    STRING: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addStringOption(assign(new SlashCommandStringOption(), optionsAttributes));
      },
    },
    MENTIONABLE: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addMentionableOption(assign(new SlashCommandMentionableOption(), optionsAttributes));
      },
    },
    USER: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addUserOption(assign(new SlashCommandUserOption(), optionsAttributes));
      },
    },
    CHANNEL: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addChannelOption(assign(new SlashCommandChannelOption(), optionsAttributes));
      },
    },
    ROLE: {
      addOption: (optionsAttributes: OptionAttribute) => {
        subCommandRef.addRoleOption(assign(new SlashCommandRoleOption(), optionsAttributes));
      },
    },
  };
  return optionMapper;
}
