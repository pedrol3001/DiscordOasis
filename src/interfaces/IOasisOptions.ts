import { AbstractPlugin } from 'oasis/plugins/class/AbstractPlugin';

export interface IOasisOptions {
  shard_count?: number;
  plugins?: AbstractPlugin[];
  commands_folder: string;
  global_prefix: string;
}
