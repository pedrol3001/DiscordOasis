import { ICommand } from '../../interfaces/ICommand';
import { ICommandHandler } from '../../oasis/commands/ICommandHandler';
import { AbstractPlugin } from '../../oasis/plugins/class/AbstractPlugin';

declare module 'discord.js' {
  export interface Client {
    commandHandler: ICommandHandler;
  }

  export interface Guild {
    prefix: string;
  }

  export interface Message {
    prefix: string;
    manager: AbstractPlugin | null;
    command: ICommand | null;
    args: Array<string>;
  }

  export interface CommandInteraction {
    manager: AbstractPlugin | null;
    args: Array<string>;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ApplicationCommand extends ICommand {}
}
