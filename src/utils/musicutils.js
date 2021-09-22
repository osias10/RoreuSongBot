const ytdl = require("ytdl-core");
const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource 
} = require('@discordjs/voice');

async function music(msg){
    
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);

    const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
    });

    console.log("커맨드0");
    console.log(commandList[0]);
    console.log("커맨드1");
    console.log(commandList[1]);
    if (commandList[0].startsWith('p')){
        play(commandList[1],connection);
    }else if (msg.content.startsWith(`${prefix}skip`)) {
        
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        
        return;
    } else {
        msg.channel.send("You need to enter a valid command!");
    }

}

async function play12() {
    
    await player.play(resource);
    connection.subscribe(player);
}

async function play(arg,connection){

    
    
    const stream = ytdl(arg, {
        filter: "audioonly"
    });
    
    const player = createAudioPlayer();
    const resource = createAudioResource(stream);
    await player.play(resource);
    connection.subscribe(player);
}

module.exports= {
    music
}