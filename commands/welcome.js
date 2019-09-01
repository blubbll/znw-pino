const Discord = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("Welcoming Messages!")
    .setDescription("We finally have Welcoming Messages. Configurable messages that will send in a specific channel for you. We also have leaving messages too!")
    .addField("Commands", "`setwelcome channel [Channel_Name]` - Sets the channel that welcomes the user with a message\n`setwelcome message [MESSAGE]` - Set the welcome message for the server - Use message guide below for help on setting it up.\n\n`setgoodbye channel [Channel_Name]` - Sets the channel for users leaving the server\n`setgoodbye message [MESSAGE]` - Set the leaving message for the server")
    .addField("Guide to Message Setup", "For mentioning users, use `{{User}}`.\nFor username and tag only, use `{{Username}}`.\nFor user count, use `{{Usercount}}`.\nFor server name, use `{{server}}`.")
    .setFooter("Time to say hellos and goodbyes!", process.env.ICON)
    .setTimestamp()
    .setColor("#00aba9");
  
  if (message.channel.type === "dm") return;
  
  console.log(message.channel.id)
  
  message.channel.send({ embed })
}