import * as Discord from "discord.js";

module.exports = {
	name: 'crab',
	description: 'Sends the Crab picture',
	execute(message: Discord.Message) {

        const crabImage = new Discord.MessageEmbed()
	        .attachFiles(['../../assets/crab.jpg'])
	        .setImage('attachment://crab.jpg');
		message.channel.send(crabImage);
	},
};
