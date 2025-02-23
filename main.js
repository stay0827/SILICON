const express = require('express');
const axios = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder, MessageFlags, ActivityType, ApplicationCommand, ApplicationCommandOptionType } = require('discord.js');
const config = require("./config.json");
const dotenv = require("dotenv").config();

const { successEmbed, failedEmbed, errorEmbed } = require('./embed.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
    ]
});

const commands = [
    {
        name: '콘솔',
        description: '콘솔 명령어를 실행합니다.',
        options: [
            {
                name: '명령어',
                description: '실행할 명령어를 입력하세요. (슬래시(/) 제외)',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
]

client.once('ready', async () => {
    client.user.setActivity({
        name: 'Working on Javascript!',
        type: ActivityType.Playing,
        url: 'https:/naver.com'
    });
    console.log(`${client.user.tag}에 로그인하였습니다!`);
});

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
    try {
        console.log('Starting refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.clientID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})()

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "test") {
        await interaction.reply({ content: "yo!", flags: MessageFlags.Ephemeral })
    }

    if (interaction.commandName === "콘솔") {
        body = {
            command: interaction.options.get('명령어').value
        }
        
        await axios.post('http://localhost:30120/SILICON/console', body)
            .then(response => {
                if (response.data.result == true) {
                    interaction.reply({ embeds: [successEmbed(interaction.options.get('명령어').value)], flags: MessageFlags.Ephemeral })
                } else if (response.data.result == false) {
                    interaction.reply({ embeds: [errorEmbed(response.data.errorContent)], flags: MessageFlags.Ephemeral })
                }
            })
            .catch(error => {
                interaction.reply({ embeds: [errorEmbed(error)], flags: MessageFlags.Ephemeral })
                console.error(`Error Occurred in Axios : ${error}`);
            })
    }
});

client.login(process.env.CLIENT_TOKEN)

// [ Express.js settings ]

const app = express();
app.use(express.json());

app.get('/whitelist', async (request, response) => {
    try {
        const guild = client.guilds.cache.get(config.guildID);
        if (!guild) {
            throw new Error('[CLIENT]디스코드 서버를 찾을 수 없음.')
        }

        const member = await guild.members.fetch(request.query.userDiscord).catch(() => null);
        if (!member) {
            throw new Error('[CLIENT] 유저를 찾을 수 없음. (서버에 참여하거나 디스코드 연동을 확인하세요.)')
        }

        const hasRole = member.roles.cache.has(config.whitelist.whitelistRoleID);

        if (hasRole) {
            response.json({ result: true, hasRole: true });
        } else if (!hasRole) {
            response.json({ result: true, hasRole: false });
        }
    } catch (error) {
        response.json({ result: false, errorContent: error.message })
    }
});


app.get('/user/connect', async (request, response) => {
    try {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`

        const embed = new EmbedBuilder()
            .setTitle('FIVEM CONNECTION LOG')
            .setColor('#222222')
            .addFields(
                { name: '**USER NAME**', value: `\`${request.query.userName}\``, inline: true },
                { name: '**USER IP**', value: `\`${request.query.userIP}\``, inline: true },
                { name: '**USER LICENSE**', value: `\`${request.query.userLicense}\`` },
                { name: '**USER DISCORD**', value: `\`${request.query.userDiscord}\`` },
                { name: '**CONNECT DATE**', value: `\`${formattedDate}\`` }
            )
            .setImage('https://cdn.discordapp.com/attachments/1148554507165372416/1342729053425111061/SILICON_BANNER.png?ex=67bab161&is=67b95fe1&hm=3d1179d3e881780a779302589893b9f1ac7a6be9dcef10e7ba76bc7ad9eb9531&');
        client.channels.cache.get(config.connectionLog.logChannelID).send({ embeds: [embed] });
        response.json({ result: true });
    } catch (error) {
        response.json({ result: false, errorContent: error.message })
    }
});

app.get('/user/disconnect', async (request, response) => {
    try {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`

        const embed = new EmbedBuilder()
            .setTitle('FIVEM DISCONNECTION LOG')
            .setColor('#222222')
            .addFields(
                { name: '**USER NAME**', value: `\`${request.query.userName}\``, inline: true },
                { name: '**USER IP**', value: `\`${request.query.userIP}\``, inline: true },
                { name: '**USER LICENSE**', value: `\`${request.query.userLicense}\`` },
                { name: '**USER DISCORD**', value: `\`${request.query.userDiscord}\`` },
                { name: '**DISCONNECT DATE**', value: `\`${formattedDate}\`` },
                { name: '**DISCONNECT REASON**', value: `\`${request.query.reason}\`` }
            )
            .setImage('https://cdn.discordapp.com/attachments/1148554507165372416/1342729053425111061/SILICON_BANNER.png?ex=67bab161&is=67b95fe1&hm=3d1179d3e881780a779302589893b9f1ac7a6be9dcef10e7ba76bc7ad9eb9531&');
        client.channels.cache.get(config.connectionLog.logChannelID).send({ embeds: [embed] })
        response.json({ result: true });
    } catch (error) {
        response.json({ result: false, errorContent: error.message })
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
