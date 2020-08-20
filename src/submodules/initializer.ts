import * as LiveChecker from "./twitch/liveChecker";
import * as Notifier from './twitch/notifier';
import * as Discord from 'discord.js';


export function initialize (client: Discord.Client, options?: {} ) {
    Notifier.initialize(client);
    LiveChecker.initialize(10);
}