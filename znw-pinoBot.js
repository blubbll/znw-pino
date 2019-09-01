const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();

const discord_token = process.env.TOKEN;
const prefix = process.env.PREFIX;

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);

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
bot.settings = {
    //Server
    prefix: process.env.PREFIX,
    flowChannel: "610046168788893708",
    welcomeChannel: "615492208673554462",
    roleChannel: "615505311041585163",
    feedbackChannel: "617798936408752150",
    owner: ""
}

bot.on("guildMemberAdd", member => {
    const chnl = bot.channels.get(bot.settings.flowChannel);

    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        const invite = guildInvites.find(i => invites[member.guild.id].get(i.code).uses < i.uses);

        chnl.setName("𝙛𝙡𝙤𝙬 ▶");
        chnl.send(new Discord.RichEmbed()
            .setDescription(`▶ <@${member.id}>(${member.user.username}#${member.user.discriminator})`)
            .setColor("#00aba9")
        );

        if (invite.code === "UgaKDjS") {
            const currch = bot.channels.get(invite.channel.id);
            const gamename = "Cube World";
            const gamerole = "cw";

            var hereRole = member.guild.roles.find(r => r.name === gamerole);

            member.addRole(hereRole.id).then(() => {
                currch.send(new Discord.RichEmbed()
                    .setTitle(`Another ${gamename} player!`)
                    .setDescription(`👋Welcome, <@${member.id}>`)
                    .setColor("#FFD700") //gold
                );
            });

            wait(4999);
            resetFlow();
        }
    });
});

bot.on("guildMemberRemove", member => {
    const chnl = bot.channels.get(bot.settings.flowChannel);
    chnl.setName("𝙛𝙡𝙤𝙬 ◀");
    chnl.send(new Discord.RichEmbed()
        .setDescription(`◀ (${member.user.username}#${member.user.discriminator})`)
        .setColor("#ff0097")
    );

    wait(4999);
    resetFlow();

});

const resetFlow = () => {
    bot.channels.get(bot.settings.flowChannel).setName("𝘧𝘭𝘰𝘸");
}

bot.on("message", message => {

    if (message.author.bot) return;
    //Text command
    switch (message.channel.type) {
        case 'text':
            {
                if (message.content.indexOf(prefix) !== 0) return;
                // This is the best way to define args. Trust me.
                const args = message.content.slice(prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                // The list of if/else is replaced with those simple 2 lines:
                try {
                    let commandFile = require(`./commands/${command}.js`);
                    commandFile.run(bot, message, args);
                } catch (err) {
                    console.error(err);
                }
            }
            break;
        case 'dm':
            {
                //regular msg
                if (message.attachments.size === 0)
                    bot.users.get(bot.settings.owner).send(new Discord.RichEmbed()
                        .setTitle(`Neues Feedback von (${message.author.username}#${message.author.discriminator})`)
                        .setDescription(`${message.content}\n${'▔'.repeat(20)}\nKlick für Antwort: <@${message.author.id}>`)
                        .setTimestamp()
                        .setColor("#aa00ff")
                    );

                //message has attachments
                else if (message.attachments.size > 0) {

                    message.attachments.forEach(attachment => {
                      
                        // do something with the attachment
                        const url = attachment.url;
                        const desc = attachment.message.content
                        console.log(desc)

                    bot.users.get(bot.settings.owner).send(new Discord.RichEmbed()
                        .setTitle(`Neues Feedback mit Anhang von (${message.author.username}#${message.author.discriminator}):`)
                        .setDescription(desc)
                        .setTimestamp()
                        .setColor("#aa00ff")
                    );
                      
                      bot.users.get(bot.settings.owner).send({embed: new Discord.RichEmbed()
                            .setTitle(`Neues Feedback mit Bild von (${message.author.username}#${message.author.discriminator})`)
                            .setDescription(attachment.message.content)
                            .setTimestamp()
                            .setColor("#aa00ff"),
                        files: [{ attachment:url, name: url }] 
                    });
                      
                    
                      
                      
                    });
                }
            }
            break;
    }
});

//login to discord servers
bot.login(discord_token);

const updateWelcome = () => {
    const chnl = bot.channels.get(bot.settings.welcomeChannel);
    chnl.bulkDelete(2);
    chnl.send(new Discord.RichEmbed()
        .setTitle('Welcome to the znw Discord!')
        .setFooter(`We hope you enjoy your time on here. 💙`)
        .setColor("#2d89ef")
    );
    chnl.setTopic('Make sure this channel is muted.')
}

const updateFeedback = () => {

    const chnl = bot.channels.get(bot.settings.feedbackChannel);
    chnl.bulkDelete(2);
    chnl.send(new Discord.RichEmbed()
        .setTitle('We appreciate your will for giving feedback.')
        .setDescription(`Send me a message to submit yours: <@${bot.user.id}>`)
        .setFooter(`Note that we might not reply to every feedback. Thx 💜`)
        .setColor("#76608a")
    );
    chnl.setTopic('Make sure this channel is muted.')
}

//--------------------------------------------------COLORS BOT

const initAssigner = (first) => {
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

    const chn = bot.channels.get(bot.settings.roleChannel);
    const srv = chn.guild;

    const messages = generateMessages();

    chn.bulkDelete(messages.length + 2); //(+initial msg + 1 failsafe)

    //chn.send(CONFIG.initialMessage);

    chn.send(new Discord.RichEmbed()
        .setTitle(`${CONFIG.initialMessage}`)
        .setColor("#f0a30a")
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


    const popTitle = () => {
        chn.setName("𝙖𝙨𝙨𝙞𝙜𝙣𝙢𝙚𝙣𝙩")
    }
    const resetTitle = () => {
        chn.setName("𝘢𝘴𝘴𝘪𝘨𝘯𝘮𝘦𝘯𝘵");
    }

    // This event handles adding/removing users from the role(s) they chose based on message reactions
    if (first)
        bot.on('raw', async event => {
            if (!events.hasOwnProperty(event.t)) return;

            const {
                d: data
            } = event;
            const user = bot.users.get(data.user_id);

            try {
                const message = await chn.fetchMessage(data.message_id);

                //only in assign channel
                if (message.channel !== chn) return;

                const member = srv.members.get(user.id);

                const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
                let reaction = message.reactions.get(emojiKey);

                if (!reaction) {
                    // Create an object that can be passed through the event like normal
                    const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
                    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
                }

                if (
                    (message.author.id === bot.user.id) && (message.content !== CONFIG.initialMessage ||
                        (message.embeds[0]))
                ) {

                    let role = message.content.replace(/[^0-9 a-z]/gi, '').trim() //`${message.content.split("⤙")[1].split("⤚")[0]}`;
                    if (role === "Cube World") role = "cw";

                    if (member.id !== bot.user.id) {

                        const guildRole = message.guild.roles.find(r => r.name === role);
                        //if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        //else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);

                        if (member.roles.has(guildRole.id))
                            member.removeRole(guildRole.id);
                        else member.addRole(guildRole.id);

                        popTitle();
                        initAssigner();

                    }
                    resetTitle();
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


bot.on('ready', () => {
    // "ready" isn't really ready. We need to wait a spell.
    wait(1000);

    console.log("Connected!");

    bot.settings.owner = bot.guilds.first().ownerID;

    //welcome channel msg
    updateWelcome();
    //assign bot
    initAssigner(true);

    //feedback channel msg
    updateFeedback();

    //reset flow channel title
    resetFlow();

    // Load all invites for all guilds and save them to the cache.
    bot.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});