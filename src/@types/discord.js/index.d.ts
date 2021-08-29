import {ICommand} from '@interfaces/ICommand'
import {AbstractPlugin} from '@plugins/class/AbstractPlugin'
import {ICommandHandler} from '@interfaces/ICommandHandler'
import {Client, Guild, Message, MessageEmbed} from 'discord.js'


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
