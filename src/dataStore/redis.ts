import * as Redis from 'redis';
import {promisify} from 'util';
import { TwitchAlertAccount } from '../models/twitchAlert.model';
let { redisHost } = require('../../config/config.json');

const redisClient = Redis.createClient( {host: redisHost } );
//
const redisGetCommand = promisify(redisClient.get).bind(redisClient);

const twitchAccountsKey = "twitchAlertAccounts";

redisClient.on('connect', function() {
    console.log('Redis client connected');
});

const redisStore = {

    create: async (key: string, value: string) => {
        redisClient.set(key, value);
    },
    
    read: async (key: string) => {

        const get = promisify(redisClient.get);
        const result = await get(key)
            .then(res => { return res })

        return result as string;
    },

    update: async (key: string, value: string) => {
        redisClient.set(key, value);
    },

    delete: async (key: string) => {
        redisClient.dump(key);
    },

    updateTwitchAccounts: async (accounts: Array<TwitchAlertAccount>) => {
        const value = JSON.stringify(accounts);
        redisClient.set(twitchAccountsKey, value);
    },
    
    getTwitchAccounts: async () => {

        const get = await promisify(redisClient.get).bind(redisClient);
        const result = await get(twitchAccountsKey)
            .then(res => { return res })
            .catch(err => {
                console.error(err);
            });

        let accounts: Array<TwitchAlertAccount>;

        if(!result)
            accounts = [];
        else
            accounts = JSON.parse(result) as Array<TwitchAlertAccount>

        return  accounts;
    }
} 

export default redisStore;