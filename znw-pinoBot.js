const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();

const discord_token = process.env.TOKEN;
const prefix = process.env.PREFIX;

client.on("ready", () => {
    console.log("Connected!");
    updateWelcome();
    initRoles();
});

app.get("/", (request, response) => {
    console.log("Ping received!");
    response.sendStatus(200);
});

// This keeps the bot running 24/7
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

/////////////////////////////////////////////////
client.settings = {
    //Server
    prefix: process.env.PREFIX,
    flowChannel: "610046168788893708",
    welcomeChannel: "615492208673554462",
    roleChannel: "615505311041585163"
}

client.on("guildMemberAdd", member => {
    const chnl = client.channels.get(client.settings.flowChannel);

    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        const invite = guildInvites.find(i => invites[member.guild.id].get(i.code).uses < i.uses);

        chnl.setName("𝙛𝙡𝙤𝙬 ▶");
        chnl.send(new Discord.RichEmbed()
            .setDescription(`▶ <@${member.id}>(${member.user.username}#${member.user.discriminator})`)
            .setColor("#00aba9")
        );

        if (invite.code === "UgaKDjS") {
            const currch = client.channels.get(invite.channel.id);
            const gamename = "Cube World";
            const gamerole = "cw";

            var hereRole = member.guild.roles.find(r => r.name === gamerole);

            currch.send({
                embed: new Discord.RichEmbed()
                    .setDescription(`👋 Another <@&${hereRole.id}>(${gamename}) player! All greet <@${member.id}>❕`)
                    .setColor("#FFD700") //gold

            }).then(embed => {
                embed.react("👋");
              
                setTimeout(function(){
                 member.addRole(hereRole.id);

                },500)
              
            });


        }

        setTimeout(() => chnl.setName("𝘧𝘭𝘰𝘸"), 4999);

    });

});

client.on("guildMemberRemove", member => {
    const chnl = client.channels.get(client.settings.flowChannel);
    chnl.setName("𝙛𝙡𝙤𝙬 ◀");
    chnl.send(new Discord.RichEmbed()
        .setDescription(`◀ (${member.user.username}#${member.user.discriminator})`)
        .setColor("#ff0097")
    );

    setTimeout(() => chnl.setName("𝘧𝘭𝘰𝘸"), 4999);

});


client.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    console.log(message.content);

    // This is the best way to define args. Trust me.
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }
});

client.login(discord_token);

const updateWelcome = () => {
    const chnl = client.channels.get(client.settings.welcomeChannel);
    chnl.bulkDelete(2);
    chnl.send(new Discord.RichEmbed()
        .setTitle('Welcome to the znw Discord!')
        .setFooter(`We hope you enjoy your time on here. 💙`)
        .setColor("#2d89ef")

    );
    chnl.setTopic('Make sure this channel is muted.')
}

//--------------------------------------------------COLORS BOT

const initRoles = (first) => {
    const CONFIG = {
        /**
         * Instructions on how to get this: https://redd.it/40zgse
         */
        yourID: "",

        setupCMD: "!createrolemessage",

        /**
         * Delete the 'setupCMD' command after it is ran. Set to 'true' for the command message to be deleted
         */
        deleteSetupCMD: false,

        initialMessage: `Click on the bubble under the game you'd like to toggle your assignment for:`,

        embedMessage: `Cube World`,

        /**
         * Must set this if "embed" is set to true
         */
        embedFooter: `🠟 click 🠟`,

        roles: ["cw", "mc"],

        /**
         * Set to "true" if you want all roles to be in a single embed
         */
        embed: false,

        /**
         * Set the embed color if the "embed" variable is et to "true"
         * Format:
         * 
         * #dd9323
         */
        embedColor: "#eff4ff",

        /**
         * Set to "true" if you want to set a thumbnail in the embed
         */
        embedThumbnail: false,

        /**
         * The link for the embed thumbnail if "embedThumbnail" is set to true
         */
        embedThumbnailLink: "",

        /**
         * You"ll have to set this up yourself! Read more below:
         * Please do not commit this token to the public if you contributed to this repository
         * or host your code anywhere online. Giving someone your bot's token is the equivalent
         * to giving someone the keys to your house and walking away!
         * 
         * https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
         */
        botToken: ""
    };

    // Function to generate the role messages, based on your settings
    function generateMessages() {
        return CONFIG.roles.map((r, e) => {
            let rString;
            if (r === "cw") rString = "Cube World"
            return {
                role: r,
                message: `${'▔'.repeat(20)}${"\n"}👇 ${rString}`, //DONT CHANGE THIS,
            };
        });
    }

    const chn = client.channels.get(client.settings.roleChannel);
    const srv = chn.guild;

    const messages = generateMessages();

    chn.bulkDelete(messages.length + 2); //(+initial msg + 1 failsafe)

    //chn.send(CONFIG.initialMessage);

    chn.send(new Discord.RichEmbed()
        .setTitle(`${CONFIG.initialMessage}`)
        .setColor("#00aba9")
    ).then(() => {

        for (const {
                role,
                message: msg,
                emoji
            } of messages) {

            chn.send(msg).then(async m => {
                await m.react("⚪");
            }).catch(console.error);

        }

    })

    // This makes the events used a bit more readable
    const events = {
        MESSAGE_REACTION_ADD: 'messageReactionAdd',
        MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    };

    // This event handles adding/removing users from the role(s) they chose based on message reactions
    if (first !== false)
        client.on('raw', async event => {
            if (!events.hasOwnProperty(event.t)) return;

            const {
                d: data
            } = event;
            const user = client.users.get(data.user_id);

            try {
                const message = await chn.fetchMessage(data.message_id);

                //only in assign channel
                if (message.channel !== chn) return;

                const member = srv.members.get(user.id);

                const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
                let reaction = message.reactions.get(emojiKey);

                if (!reaction) {
                    // Create an object that can be passed through the event like normal
                    const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
                    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
                }

                if (
                    (message.author.id === client.user.id) && (message.content !== CONFIG.initialMessage ||
                        (message.embeds[0]))
                ) {

                    let role = message.content.replace(/[^0-9 a-z]/gi, '').trim() //`${message.content.split("⤙")[1].split("⤚")[0]}`;
                    if (role === "Cube World") role = "cw";

                    if (member.id !== client.user.id) {

                        const guildRole = message.guild.roles.find(r => r.name === role);
                        //if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        //else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);

                        if (member.roles.has(guildRole.id))
                            member.removeRole(guildRole.id);
                        else member.addRole(guildRole.id);

                        chn.setName("𝙖𝙨𝙨𝙞𝙜𝙣𝙢𝙚𝙣𝙩")
                        initRoles(false);

                    }
                    chn.setName("𝘢𝘴𝘴𝘪𝘨𝘯𝘮𝘦𝘯𝘵");
                }
            } catch (ex) {

            }
        });
}

//------------------------------------------------------------

process.on('unhandledRejection', err => {
    const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error("Unhandled Rejection", msg);
});

// Initialize the invite cache
const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);

client.on('ready', () => {
    // "ready" isn't really ready. We need to wait a spell.
    wait(1000);

    // Load all invites for all guilds and save them to the cache.
    client.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});