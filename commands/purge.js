const Discord = require('discord.js');

exports.run = async (client, message, [number,... reason]) => {
  if (message.author.id === process.env.OWNER_ID){
  	message.channel.bulkDelete(number)
  
	  let embed = new Discord.RichEmbed()
	    .setDescription(`**Purging...**`)
	    .setColor(process.env.COLOR);

	  message.delete(250);

	  const m = await message.channel.send({ embed })     
	  m.delete(5000)
  } else {
	  if (!message.guild.members.get(message.author.id).hasPermission('MANAGE_MESSAGES')) return message.author.send("You need to have `MANAGE_MESSAGES` permission to use this command.");
	  
	  if (!message.guild.members.get(message.author.id).hasPermission('MANAGE_MESSAGES')) return;
  
	  message.channel.bulkDelete(number)
  
  	let embed = new Discord.RichEmbed()
  	  .setDescription(`**Purging...**`)
  	  .setColor(process.env.COLOR);

	  try{message.delete(100);} catch (ex){console.log(ex)}

	  const m = await message.channel.send({ embed })     
	  m.delete(5000)
  }
}