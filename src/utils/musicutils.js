const ytdl = require("ytdl-core");
const ytdlexec = require('youtube-dl-exec').raw

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource 
} = require('@discordjs/voice');
const yts = require("yt-search");


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
    if (commandList[0].startsWith('pla2')){
        
            play(msg,commandList[1],connection);
        
    }else if (commandList[0].startsWith(`pq`)) {
        playtest(msg,connection);
        
    } else if (commandList[0].startsWith(`play`)) {
        play2(msg, commandList[1], connection);
        return;
    } else if (commandList[0].startsWith(`pla3`)) {
        play2(msg, commandList[1], connection);
        return;
    }else {
        msg.channel.send("You need to enter a valid command!");
    }

}

async function play12() {
    
    await player.play(resource);
    connection.subscribe(player);
}

async function play(msg,arg,connection){

    if (ytdl.validateURL(arg)) {
        const songInfo = await ytdl.getInfo(arg);
        song = {
          title: songInfo.title,
          url: songInfo.video_url
        };
      } else {
        //const {videos} = await yts(arg.slice(1).join(" "));
        const {videos} = await yts(arg);
        if (!videos.length) return msg.channel.send("No songs were found!");
        song = {
          title: videos[0].title,
          url: videos[0].url
        };
      }
    /*
    const stream = ytdl(song.url, {
        filter: "audioonly"
    });
    */
    console.log("song_url");
    console.log(song.url);
    const stream =  ytdlexec(song.url, {
        o: '-',
        q: '',
        f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        r: '100K',
      }, { stdio: ['ignore', 'pipe', 'ignore'] })
      //, { stdio: ['ignore', 'pipe', 'ignore'] })
      
    
    if (!stream.stdout){
        console.log("not stdout");
        return;
    }
    //console.log(stream.stdout);
    //console.log("stream");
    //console.log(stream);
    try{
        const player = createAudioPlayer();
        //const resource = createAudioResource(stream);
        const resource = createAudioResource(stream.stdout);

        await player.play(resource);
        connection.subscribe(player);
    }catch (e){
        console.log(e);
    }
    
}

async function play2(msg,arg,connection){

    if (ytdl.validateURL(arg)) {
        const songInfo = await ytdl.getInfo(arg);
        song = {
          title: songInfo.title,
          url: songInfo.video_url
        };
      } else {
        //const {videos} = await yts(arg.slice(1).join(" "));
        const {videos} = await yts(arg);
        if (!videos.length) return msg.channel.send("No songs were found!");
        song = {
          title: videos[0].title,
          url: videos[0].url
        };
      }
    
    const stream = ytdl(song.url, {
        quality : 'lowestaudio' , 
        filter: "audioonly"
        
    });
    
    console.log("song_url");
    console.log(song.url);
   
    
    if (!stream){
        console.log("not stdout");
        return;
    }
    console.log(stream);
    //console.log("stream");
    //console.log(stream);
    try{
        const player = createAudioPlayer();
        //const resource = createAudioResource(stream);
        const resource = createAudioResource(stream);

        await player.play(resource);
        connection.subscribe(player);
    }catch (e){
        console.log(e);
    }
    
}


async function playtest(msg,connection){
    console.log("mp3 재생");
    
    
    //console.log("stream");
    //console.log(stream);
    try{
        const player = createAudioPlayer();
        const resource = createAudioResource("./test/akmu.mp3", { inlineVolume: true});
        resource.volume.setVolume(0.5);
        //const resource = createAudioResource(stream.stdout);

        player.play(resource);
        //await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        connection.subscribe(player);

    }catch (e){
        console.log(e);
    }
}

module.exports= {
    music
}