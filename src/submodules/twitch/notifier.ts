import * as Discord from 'discord.js';
import * as redis from 'redis';
import { TwitchAlertAccount } from '../../models/twitchAlert.model';
let { redisHost } = require('../../../config/config.json');


let subscriber = redis.createClient( { host: redisHost } );
let discordClient: Discord.Client;

subscriber.on("message", (subChannel, message) => {
    let data: TwitchAlertAccount = JSON.parse(message);

    if(data.twitch.type != "live" ) return

    data.discord.alertChannelID.forEach(alertChannel => {
        const channel = discordClient.channels.cache.get(alertChannel) as Discord.TextChannel;
        channel.send(data.discord.alertMessage);
    });
});


export function initialize(client: Discord.Client) {
    discordClient = client;
    subscriber.subscribe("twitchalerts");    
}

