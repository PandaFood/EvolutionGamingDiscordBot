import redisStore from "../../dataStore/redis";
import redis from 'redis';
import { TwitchAlertAccount, TwitchAccount } from "../../models/twitchAlert.model";
import axios from 'axios';
let { client_id, client_secret } =  require('../../../config/credentials.json');
let { redisHost } = require('../../../config/config.json');


let publisher = redis.createClient( { host: redisHost } );
let oauth2Token: string;
let alertAccounts: Array<TwitchAlertAccount> = [];


export async function initialize(time: number ) {
    // Convert to seconds
    time = time * 1000;

    let localAccounts = await redisStore.getTwitchAccounts();
    let twitchAccountNames: Array<string> = [];

    localAccounts.forEach(account => {
        twitchAccountNames.push(account.twitch.userName);
    });

    let twitchAccounts = await getTwitchAccountInfo(twitchAccountNames);

    localAccounts.forEach(localAccount => {
        alertAccounts.push(mergeTwitchAndLocalData(localAccount, twitchAccounts));
    });

    redisStore.updateTwitchAccounts(alertAccounts);

    setInterval(checkIfLive, time)
}

async function checkIfLive() {

    let localAccounts = await redisStore.getTwitchAccounts();
    let twitchAccountNames: Array<string> = [];

    localAccounts.forEach(account => {
        twitchAccountNames.push(account.twitch.userName);
    });

    let twitchAccounts = await getTwitchAccountInfo(twitchAccountNames);

    localAccounts.forEach(alertAccount => {
        if (diffTwitchAndLocalData(alertAccount, twitchAccounts)){
            alertAccount = mergeTwitchAndLocalData(alertAccount, twitchAccounts);
            publisher.publish("twitchalerts", JSON.stringify(alertAccount));
        } else {
            alertAccount = mergeTwitchAndLocalData(alertAccount, twitchAccounts);
        }
    });

    redisStore.updateTwitchAccounts(localAccounts);
}

function diffTwitchAndLocalData(alertAccount: TwitchAlertAccount, twitchAccounts: TwitchAccount[]) {

    let difference = false;
    
    twitchAccounts.forEach(twitchAccount => {
        if(alertAccount.twitch.userName.toLowerCase() == twitchAccount.user_name.toLowerCase()) {            
            if(alertAccount.twitch.type != twitchAccount.type) {
                difference = true;
            }
        }
    });

    return difference;
}

function mergeTwitchAndLocalData(localAccount: TwitchAlertAccount, twitchAccounts: TwitchAccount[]) {

    let foundAccount = false;

    twitchAccounts.forEach(twitchAccount => {
        if(localAccount.twitch.userName.toLowerCase() == twitchAccount.user_name.toLowerCase()) {
            foundAccount = true;

            localAccount.twitch.type = twitchAccount.type;
            localAccount.twitch.streamTitle = twitchAccount.title;
        }
    });

    if(!foundAccount){
        localAccount.twitch.type = "offline";
    }

    return localAccount;
}


async function getTwitchAccountInfo(twitchAccounts: string[]) {

    if(twitchAccounts.length <= 0) 
        return;

    const TWITCHAPISTREAMURL = 'https://api.twitch.tv/helix/streams';
    const USERLOGINPARAM = 'user_login'
    let fullURL = `${TWITCHAPISTREAMURL}?`;

    twitchAccounts.forEach(account => {
        fullURL = `${fullURL}${USERLOGINPARAM}=${account}&`;
    })

    if(!oauth2Token){
        oauth2Token = await getNewTwitchOAuthToken();
    }

    
    const response = await axios.get(fullURL, {
        headers: {
            'Authorization': `Bearer ${oauth2Token}`,
            'Client-ID': client_id
        }
    }).then(res => {

        return res.data.data;
    }).catch(err => {
        if(err.response){
            if(err.response.status == 401){
                oauth2Token = '';
            } else {
                console.error(err);
            }
        } else {
            console.error(err);
        }
    });

    return response;
}

async function getNewTwitchOAuthToken(){
    
    const TWITCHAPIOAUTHURL = 'https://id.twitch.tv/oauth2/token';
    const CLIENTIDPARAM = 'client_id';
    const CLIENTSECRETPARAM = 'client_secret'
    const GRANTTYPE = 'grant_type=client_credentials'

    const fullURL = `${TWITCHAPIOAUTHURL}?${CLIENTIDPARAM}=${client_id}&${CLIENTSECRETPARAM}=${client_secret}&${GRANTTYPE}`


    const response = await axios.post(fullURL)
    .then(res => {
        return res.data.access_token;
    })

    return response

}

