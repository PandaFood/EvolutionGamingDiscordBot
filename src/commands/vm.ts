// import * as Discord from "discord.js";


// module.exports = {
// 	name: 'vm',
// 	description: 'Vote Mute',
// 	execute(message: Discord.Message, args: string[], client: Discord.Client) {

		

// 		const targetMention = message.mentions.members.first();
// 		const voter = message.member;

// 		// Check if they have the prototype
// 		if(targetMention.vote == undefined){
// 			targetMention.vote = {
// 				muteTimer: 0,
// 				muteList: [],
// 				isMuted: false
// 			}
// 		} 

// 		// END of prototype check



// 		if (!message.guild) return;
// 		if (targetMention.vote.isMuted) return message.channel.send('User is already muted');
// 		if (!message.member.voiceChannel) return message.channel.send('You arent in any voice channel.'); 
// 		if (!message.member.voiceChannel.members.has(targetMention.id)) return message.channel.send('User not in the same channel as you.');
				
// 		voteMute(targetMention, voter, message);	

		
		
// 	},
// };


// function voteMute(target : Discord.GuildMember, voter : Discord.GuildMember, message : Discord.Message){

// 	var voteTimeOut = 60 * 5 * 1000;

// 	if(target.vote.muteTimer == 0){
// 		target.vote.muteTimer = setTimeout(failMute, voteTimeOut, target, message);
// 	} else {
// 		clearTimeout(target.vote.muteTimer);
// 		target.vote.muteTimer = setTimeout(failMute, voteTimeOut, target, message);
// 	}
  
// 	if(target.vote.muteList.includes(voter)){
// 		return message.channel.send("You already voted to mute him");
// 	}

// 	target.vote.muteList.push(voter);

	
// 	if(target.vote.muteList.length >= (voter.voiceChannel.members.size / 2)){
// 		message.channel.send( (target.nickname != null ? target.nickname : target.user.username ) + " has been votemuted for 2 minutes.");
// 		startMute(target, message);
// 		return;
// 	}
	
// }

// function startMute(target : Discord.GuildMember, message : Discord.Message){

// 	const MuteTime = 60 * 2 * 1000;

// 	target.vote.isMuted = true;
// 	clearTimeout(target.vote.muteTimer);
// 	target.setMute(true);

// 	setTimeout(() => {
// 		clearMute(target, message);
// 	}, MuteTime);
// }
// function failMute(target : Discord.GuildMember, message : Discord.Message){
// 	message.channel.send("Vote to mute " + (target.nickname != null ? target.nickname : target.user.username ) + " failed. " + target.vote.muteList.length + " / " + (target.voiceChannel.members.size) + " voted" );
// 	target.vote.muteList = [];
// }

// function clearMute(target : Discord.GuildMember, message : Discord.Message){
// 	message.channel.send((target.nickname != null ? target.nickname : target.user.username ) + " is no longer muted");
// 	target.vote.isMuted = false;
// 	target.setMute(false);
// 	target.vote.muteList = [];
// }