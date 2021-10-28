const { Client, Intents } = require('discord.js');
const os = require('os');
const musicutils = require('./utils/musicutils');
const matchsong = require('./utils/matchsong');

const {
    DISCORD_KEY
  } = require('./../key.json');




const commandLetter = '*';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]  });

client.on('ready', async() => {
    //await ytdlw.downloadFromWebsite("./src/data/youtube-dl/", os.platform());
    //const youtubeDlWrap = new ytdlw("../src/data/youtube-dl/");
    console.log("준비 완료");
    
});
client.on('message', async msg =>{
    let content = msg.content;
    console.log(content);
    if (content&& msg.author.bot!= true){
        matchsong.answercheck(msg);
        console.log(msg.content);

    }
    if (!content.startsWith(commandLetter)) {
        return;
    }
    const command = content.trim().substring(1);
    if (command.startsWith('p')||command.startsWith('s')){
        musicutils.music(msg);
        return;
    }
    else if (command.startsWith('노래맞추기')){
        matchsong.matchmusic(msg);
        return;
    }
    content=undefined;

});


client.login(DISCORD_KEY);