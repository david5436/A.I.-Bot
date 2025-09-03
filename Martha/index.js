const Discord = require('discord.js');
const { OpenAI } = require('openai');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} = require('@discordjs/voice');
require('dotenv').config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ]
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!join')) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('Please join a voice channel first!');
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            message.reply('Joined voice channel!');
        } catch (error) {
            console.error(error);
            message.reply('Error joining voice channel!');
        }
    }

    if (message.content.startsWith('!chat')) {
        const query = message.content.slice(6);
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: query
                }]
            });
            message.reply(response.choices[0].message.content);
        } catch (error) {
            console.error(error);
            message.reply('Error generating response!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

/*
{
  "name": "martha-ai-bot",
  "version": "1.0.0",
  "description": "Discord AI Voice Chat Bot",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@discordjs/voice": "^0.16.0",
    "discord.js": "^14.11.0",
    "dotenv": "^16.0.3",
    "openai": "^4.0.0",
    "ffmpeg-static": "^5.1.0",
    "libsodium-wrappers": "^0.7.11"
  }
}
*/

node_modules/
.env
.vscode/