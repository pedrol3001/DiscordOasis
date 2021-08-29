import fs from 'fs';
import Discord from 'discord.js';
import {ICommand} from '@interfaces/ICommand';
import {OasisError} from '@error/OasisError';
import { IRemoveCommands } from '../IRemoveCommands';

class RemoveCommandsFromPlugin implements IRemoveCommands {
  public handle(collection: Discord.Collection<string, ICommand>, ...args): void {
    // TODO
  }
}

export { RemoveCommandsFromPlugin };
