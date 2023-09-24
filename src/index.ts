import 'dotenv/config'
const { Client, IntentsBitField} = require("discord.js")
import { openai } from "./lib/openai";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})
const channelId = process.env.CHANNEL_ID;

client.login(process.env.ID_LOGIN)

client.on('messageCreate', async (message) => {
  if (message.channelId === channelId) {
    if (message.author.bot) {
      return;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: 'user', content: message.content }
      ]
    });

    if (response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
      message.reply(response.choices[0].message.content);
    } else {
      message.reply("I couldn't generate a response at the moment.");
    }
  }
});


client.on('ready', (c) => {
  console.log(`${c.user.tag} is online`)
})