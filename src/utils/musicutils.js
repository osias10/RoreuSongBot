const ytdl = require("ytdl-core");
const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource 
} = require('@discordjs/voice');

async function music(msg){
    
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);

    const voiceChannel =  msg.member.voice.channel;
    if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
    }

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
        try{
            play(commandList[1],connection);
        } catch (e) {
            console.log(e);
        }
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
    try{
        const player = createAudioPlayer();
        const resource = createAudioResource(stream);
        await player.play(resource);
        connection.subscribe(player);
    }catch (e){
        console.log(e);
    }
    
}

module.exports= {
    music
}