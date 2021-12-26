/* eslint-disable import/no-mutable-exports */

import { REST } from '@discordjs/rest';

let discordRest: REST;
function setDiscordRest(token: string) {
  discordRest = new REST({ version: '9' }).setToken(token);
}

export { discordRest, setDiscordRest };
