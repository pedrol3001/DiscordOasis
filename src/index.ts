export { Oasis } from "oasis/index";
export { OasisError } from "error/OasisError";
export { IOasisOptions } from "interfaces/IOasisOptions";
export { AbstractPlugin } from "oasis/plugins/class/AbstractPlugin";
export { IMicroHandler } from "oasis/commands/handlers/IMicroHandler";
export { IMicroHandlerExecutionMode } from "oasis/commands/index";
export { ICommand, ICommandGroups } from 'interfaces/ICommand'
//export Discord from 'discord.js';

import {ICommand} from 'interfaces/ICommand'
import {AbstractPlugin} from 'oasis/plugins/class/AbstractPlugin'
import {ICommandHandler} from 'interfaces/ICommandHandler'


declare module 'discord.js' {
  export interface Client {
    command_handler: ICommandHandler;
  }

  export interface Guild {
    prefix: string;
  }

  export interface Message {
    args: Array<string>;
    command: ICommand | undefined;
    prefix: string;
    manager: AbstractPlugin | undefined;
  }
}
