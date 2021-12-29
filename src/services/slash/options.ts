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

export function optionsMapper(subCommandRef: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionMapper: Record<string, any> = {
    BOOLEAN: {
      addOption: subCommandRef.addBooleanOption,
      OptionBuild: SlashCommandBooleanOption,
    },
    NUMBER: {
      addOption: subCommandRef.addNumberOption,
      OptionBuild: SlashCommandNumberOption,
    },
    INTEGER: {
      addOption: subCommandRef.addIntegerOption,
      OptionBuild: SlashCommandIntegerOption,
    },
    STRING: {
      addOption: subCommandRef.addStringOption,
      OptionBuild: SlashCommandStringOption,
    },
    MENTIONABLE: {
      addOption: subCommandRef.addMentionableOption,
      OptionBuild: SlashCommandMentionableOption,
    },
    USER: {
      addOption: subCommandRef.addUserOption,
      OptionBuild: SlashCommandUserOption,
    },
    CHANNEL: {
      addOption: subCommandRef.addChannelOption,
      OptionBuild: SlashCommandChannelOption,
    },
    ROLE: {
      addOption: subCommandRef.addRoleOption,
      OptionBuild: SlashCommandRoleOption,
    },
  };
  return optionMapper;
}
