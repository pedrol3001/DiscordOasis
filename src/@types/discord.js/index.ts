import { Plugin } from '@prisma/client';
import { ICommand } from '../../interfaces/ICommand';
import { AbstractPlugin } from '../../oasis/plugins/class/AbstractPlugin';

declare module 'discord.js' {
  export interface Guild {
    prefix: string;
    plugins: Plugin[];
  }

  export interface Message {
    prefix: string;
    manager: AbstractPlugin | null;
    commandHolder: ICommand | null;
    args: Array<string>;
  }

  export interface CommandInteraction {
    manager: AbstractPlugin | null;
    commandHolder: ICommand | null;
    args: Array<string>;
  }
}
