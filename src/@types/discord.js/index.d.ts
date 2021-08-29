import ICommand from 'oasis/interfaces/ICommand';
import CommandHandler from '@commands/';
import { PluginsHandler } from '@discord/plugins';

declare module 'discord.js' {
  export interface Client {
    command_handler: ICommandHandler;
  }

  export interface Guild {
    prefix: string;
  }

  export interface Message {
    args: Array<string>;
    command: ICommand;
    prefix: string;
    manager: AbstractPlugin;
  }
}
