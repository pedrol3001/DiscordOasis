//import fs from 'fs';
import { Collection } from 'discord.js';
import {ICommand} from '../../../../../interfaces/ICommand';
//import {OasisError} from '@error/OasisError';
import { IRemoveCommands } from '../IRemoveCommands';

class RemoveCommandsFromPlugin implements IRemoveCommands {
  public handle(_collection: Collection<string, ICommand>, ..._args:string[]): void {
    // TODO

  }
}

export { RemoveCommandsFromPlugin };
