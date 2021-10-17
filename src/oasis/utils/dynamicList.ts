import Discord from 'discord.js';

import { DynamicMessage, OnReaction } from 'discord-dynamic-messages';

class DynamicList extends DynamicMessage {
  private name: string;
  private pageSize: number;
  private list: Array<string>;
  private counter: number;
  private options: Discord.MessageEmbedOptions;

  public constructor(name: string, list: Array<string>, pageSize: number, options: Discord.MessageEmbedOptions) {
    super();
    this.name = name;
    this.options = options;
    this.pageSize = pageSize;
    this.list = list;
    this.counter = 0;
  }

  @OnReaction(':arrow_left:')
  protected decrement(): void {
    if (this.counter === 0) this.counter = Math.ceil(this.list.length / this.pageSize) - 1;
    else this.counter -= 1;
  }

  @OnReaction(':arrow_right:')
  protected increment(): void {
    if (this.counter === Math.ceil(this.list.length / this.pageSize) - 1) this.counter = 0;
    else this.counter += 1;
  }

  protected render(): Discord.MessageEmbed {
    const lyricsEmbed = new Discord.MessageEmbed(this.options);
    lyricsEmbed.setTitle(
      this.list.length > 0
        ? `${this.name} - ${this.counter + 1}/${Math.ceil(this.list.length / this.pageSize)}`
        : `${this.name} - Empty`,
    );

    let list_aux;
    if (this.counter === Math.ceil(this.list.length / this.pageSize)){
      list_aux = this.list.slice(this.counter * this.pageSize, this.list.length - this.counter * this.pageSize);
    }
    list_aux = this.list.slice(this.counter * this.pageSize, (this.counter + 1) * this.pageSize);
    lyricsEmbed.setDescription(list_aux.join('\n'));
    if (lyricsEmbed.description?.length || 0 >= 2048){
      lyricsEmbed.description = `${lyricsEmbed.description?.substr(0, 2045) || ""}...`;
    }
    return lyricsEmbed;
  }
}

export default DynamicList;
