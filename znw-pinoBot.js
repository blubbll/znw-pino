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
    color: { //color for embeds
        self: "#7e3878",
        suc: "#00a300",
        assign: "#f0a30a",
        welcome: "#2d89ef",
        flow_join: "#00aba9",
        flow_leave: "#ff0097",
        flow_game: "#FFD700" //gold
    }
}

bot.on("guildMemberAdd", member => {
    const chnl = bot.channels.get(bot.settings.flowChannel);

    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        const invite = guildInvites.find(i => invites[member.guild.id].get(i.code).uses < i.uses);

        chnl.setName("𝙛𝙡𝙤𝙬 ▶");
        chnl.send(new Discord.RichEmbed()
            .setDescription(`▶ <@${member.id}>(${member.user.username}#${member.user.discriminator})`)
            .setColor(bot.settings.color.flow_join)
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
                    .setColor(bot.settings.color.flow_game)
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
        .setColor(bot.settings.color.flow_leave)
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
        case 'group':
            {
                const ty = `Thank you for choosing ${bot.user.username} 💜`;


                //regular msg
                if (message.attachments.size === 0) {
                    bot.users.get(bot.settings.owner).send(new Discord.RichEmbed()
                        .setTitle(`Neues Feedback von (${message.author.username}#${message.author.discriminator}).`)
                        .setDescription(`${message.content}\n${'▁'.repeat(20)}\nKlick für Antwort: <@${message.author.id}>`)
                        .setTimestamp()
                        .setColor(bot.settings.color.self)
                    );

                    //reply for msg
                    message.channel.send(new Discord.RichEmbed()
                        .setTitle(`Your feedback has been sent.`)
                        .setDescription(`("${message.content}")`)
                        .setFooter(ty)
                        .setColor(bot.settings.color.suc)
                    );

                }


                //message has attachments
                else if (message.attachments.size > 0) {

                    message.attachments.forEach(attachment => {

                        // do something with the attachment
                        const url = attachment.url;
                        const desc = attachment.message.content

                        bot.users.get(bot.settings.owner).send({
                            embed: new Discord.RichEmbed()
                                .setTitle(`Anhang von (${message.author.username}#${message.author.discriminator}):`)
                                .setDescription(`
                                  Datei:
                                    "${attachment.filename}"
                                    ${'▔'.repeat(20)}
                                    Nachricht:
                                    ${'▔'.repeat(20)}\n${desc.length !== 0 ? desc : "(Keine Nachricht)"}
                                    ${'▁'.repeat(20)}\nKlick für Antwort: <@${message.author.id}>`)
                                .setTimestamp()
                                .setColor(bot.settings.color.self),
                            files: [{
                                attachment: url,
                                name: url
                            }]
                        });
                    });

                    //reply for attachments
                    message.channel.send(new Discord.RichEmbed()
                        .setTitle(`Your file has been sent.`)
                        .setFooter(ty)
                        .setColor(bot.settings.color.suc)
                    );

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
        .setColor(bot.settings.color.welcome)
    );
    chnl.setTopic('Make sure this channel is muted.')
}

const updateFeedback = () => {
    const chnl = bot.channels.get(bot.settings.feedbackChannel);
    chnl.bulkDelete(2);
    chnl.send(new Discord.RichEmbed()
        .setTitle('We appreciate your will for giving feedback.')
        .setDescription(`Drop me a message to submit yours.\nAttachments are supported.📎\n👉<@${bot.user.id}>\n`)
        .setFooter(`Note that we might not reply to every feedback. Thx 💜`)
        .setColor(bot.settings.color.self)
    );
    chnl.setTopic('Make sure this channel is muted.')
}

const deleteOldmessages = async () => {
    console.log("deleting expired messages...")

    const olderThanDays = 2;
    let channel;
    for (const ch of bot.server.channels) {

        if (ch[1].type === "text") {

            await bot.channels.get(ch[1].id).fetchMessages()
                .then(messages => messages.array().forEach(message => {
                    if (message.createdTimestamp <= +new Date() - 1000 * 60 * 60 * 24 * (olderThanDays))
                        message.delete();
                }));
        }
    }
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

    chn.send(new Discord.RichEmbed()
        .setTitle(`${CONFIG.initialMessage}`)
        .setColor(bot.settings.color.assign)
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

bot.on('ready', async () => {
    // "ready" isn't really ready. We need to wait a spell.
    wait(1000);

    console.log("Connected!");

    bot.owner = bot.guilds.first().ownerID;

    bot.server = bot.guilds.first();

    // const owner = await (bot.fetchUser(bot.owner))

    //console.log(owner.get('avatarURL'))

    //welcome channel msg
    updateWelcome();
    //assign bot
    initAssigner(true);

    //feedback channel msg
    updateFeedback();

    //reset flow channel title
    resetFlow();

    deleteOldmessages();

    setInterval(deleteOldmessages, 60 * 1000 * 60 * (1)) //delete old messages every hour

    // Load all invites for all guilds and save them to the cache.
    bot.guilds.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
});