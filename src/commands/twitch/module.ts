import * as Discord from "discord.js";
import { TwitchAlertAccount } from "../../models/twitchAlert.model";
import redisStore from '../../dataStore/redis';


module.exports = {
	name: 'twitchalert',
	description: 'Notify in channel when channel goes live',
	execute(message: Discord.Message, args: string[], client: Discord.Client) {

        if(isNotAllowed(message)) return;

        const op = args.shift()?.toLocaleLowerCase();
        switch (op) {
            case "add":
                addTwitchAlert(message, args);
                break;
            case "delete":
                deleteTwitchAlert(message, args);
                break;
            case "list":
                listTwitchAlert(message, args);
                break;
            case "help":

            default:
                message.author.send("Looks like you're trying to add a user to twitch alerts.");
                message.author.send("Available opperations: add, delete, list, help");

                break;
        }

	},
};


async function addTwitchAlert(message: Discord.Message, args: string[]) {

    if (args.length <= 0) {
        message.author.send("Hey, you need to add a twitch username too");
        return;
    }

    const twitchUserName = args.shift()?.toLowerCase() as string;
    const twitchURL = `https://www.twitch.tv/${twitchUserName}`;
    let discordMessage: string;
    let discordChannel = message.channel.id;
    let twitchAccounts = redisStore.getTwitchAccounts();

    if (args.length > 0){
        discordMessage = args.join(' ');
    } else {
        discordMessage = `Hey @everyone, ${twitchUserName} is now live on ${twitchURL}. Go check it out!`
    }
    

    const user: TwitchAlertAccount = {
        discord: {
            alertChannelID: [discordChannel],
            alertMessage: discordMessage,
        },
        twitch:{
            url: twitchURL,
            userName: twitchUserName
        }
    }



    twitchAccounts.then(accounts => {
        let currentAccount = accounts.find( account => { account.twitch.userName.toLowerCase() == user.twitch.userName.toLowerCase()});

        if(!currentAccount){

            accounts.push(user);
            redisStore.updateTwitchAccounts(accounts);
            message.channel.send(`${twitchUserName} was added to the alert list.`);

        } else {
            
            if(!currentAccount.discord.alertChannelID.includes(discordChannel)){

                currentAccount.discord.alertChannelID.push(discordChannel);
                redisStore.updateTwitchAccounts(accounts);
                message.channel.send(`${twitchUserName} was added to the alert list.`);

            } else {

                message.channel.send(`${twitchUserName} is already on the alert list.`);
                return;
            }
        }
        
    })
}

async function deleteTwitchAlert(message: Discord.Message, args: string[]) {

    if (args.length <= 0) {
        message.author.send("Hey, you need to add a twitch username too");
        return;
    }

    const twitchUserName = args.shift() as string;

    let twitchAccounts = await redisStore.getTwitchAccounts();
    twitchAccounts = twitchAccounts.filter(account => account.twitch.userName.toLowerCase() != twitchUserName.toLowerCase());
    redisStore.updateTwitchAccounts(twitchAccounts);
    message.channel.send(`${twitchUserName} is now removed from the list.`);

}

async function listTwitchAlert(message: Discord.Message, args: string[]) {
    let twitchAccounts = await redisStore.getTwitchAccounts();
    let writtenAccounts: string = twitchAccounts.reduce( (acc, curr) => {return acc + curr.twitch.userName + '  -  '}, '');
    message.channel.send(`The current full list of twitch channels are: ${writtenAccounts}`);
}

function isNotAllowed (message: Discord.Message) {

    let perms = message.member?.permissions as Discord.Permissions;
    
    let has_kick = perms.has("KICK_MEMBERS");
    if(has_kick)
        return false;
    else
        return true;

}