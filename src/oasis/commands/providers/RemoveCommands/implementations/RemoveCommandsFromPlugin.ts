//import fs from 'fs';
import Discord from 'discord.js';
import {ICommand} from 'interfaces/ICommand';
//import {OasisError} from '@error/OasisError';
import { IRemoveCommands } from '../IRemoveCommands';

class RemoveCommandsFromPlugin implements IRemoveCommands {
  public handle(_collection: Discord.Collection<string, ICommand>, ..._args:string[]): void {
    // TODO

  }
}

export { RemoveCommandsFromPlugin };
