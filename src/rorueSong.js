const { Client, Intents } = require('discord.js');

const musicutils = require('./utils/musicutils');


const {
    DISCORD_KEY
  } = require('./../key.json');




const commandLetter = '*';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]  });

client.on('ready', async() => {
    console.log("준비 완료");
});
client.on('message', async msg =>{
    let content = msg.content;
    console.log(content);
    if (!content.startsWith(commandLetter)) {
        return;
    }
    const command = content.trim().substring(1);
    if (command.startsWith('p')){
        musicutils.music(msg);
    }

});


client.login(DISCORD_KEY);