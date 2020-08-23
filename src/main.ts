import * as Discord from 'discord.js';
let { token } = require('../config/credentials.json');
let { prefix } = require('../config/config.json');
let fs = require('fs');
import { initialize } from './submodules/initializer';

const client = new Discord.Client();
let commands = new Discord.Collection();


// Go through all folders in commands folder
const commandFolders = fs.readdirSync('./commands').filter((directory: any) => {
	return fs.lstatSync(`./commands/${directory}`).isDirectory();
});

// Check if theres a command there and add it to the available commands then
for (const folder of commandFolders) {
	const dirPath = `./commands/${folder}/module.js`;

	if(fs.existsSync(dirPath)) {
		const command = require(dirPath);
		commands.set(command.name, command);
	}
}


client.once('ready', () => {
	console.log('Ready!');
	initialize(client);
});



client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	let inputArgs = message.content.slice(prefix.length).split(/ +/);
	let commandName = inputArgs.shift() !.toLowerCase();

	if (!commands.has(commandName)) return;

	try {
		let command: any = commands.get(commandName);
		command.execute(message, inputArgs, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});



client.login(token);