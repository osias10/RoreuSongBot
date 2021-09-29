const ytdl = require("ytdl-core");
const ytdlexec = require('youtube-dl-exec').raw

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource, 
  AudioPlayerStatus
} = require('@discordjs/voice');
const yts = require("yt-search");


const queue = new Map();


async function music(msg){
    
  const serverQueue = queue.get(msg.guild.id);
    
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
    let song_name = String(commandList.slice(1,undefined));
    console.log(song_name);
    if (commandList[1] == undefined){
      msg.channel.send("노래를 입력해주세요");
      return;
    }
    if (commandList[0].startsWith('pla2')){
        
      play(msg,commandList[1],connection);
        
    }else if (commandList[0].startsWith(`pq`)) {
      playtest(msg,connection);
        
    } else if (commandList[0].startsWith(`play`)) {
      play3(msg,song_name);
      //execute(msg,song_name,serverQueue);
      return;
    } else if (commandList[0].startsWith(`qplay`)) {
        execute(msg,song_name,serverQueue);
        return;
    }else if (commandList[0].startsWith('pla4')){
    
        play3(msg,commandList[1]);
    
    }else if (commandList[0].startsWith('pla5')){
    
        play5(msg);
    
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

async function play3(msg,arg){

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

    
const stream = ytdlexec(song.url, {
    o: '-',
    q: '',
    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
    r: '100K',
  }, { stdio: ['ignore', 'pipe', 'ignore'] })

const player = createAudioPlayer();
const connection = await joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator
    });
const resource = createAudioResource(stream.stdout);
player.play(resource);

try {
    //await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    connection.subscribe(player);
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

async function play5(msg){
/*
    
    const stream = youtubeDlWrap.execStream(["https://www.youtube.com/watch?v=aqz-KE-bpKQ","-f", "best[ext=mp4]"])
    
    const player = createAudioPlayer();
    const connection = await joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });
    console.log(stream);
    const resource = createAudioResource(stream);
    player.play(resource);
    
    try {
        //await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        connection.subscribe(player);
      } catch (error) {
        connection.destroy();
        throw error;
      }
      */
}



async function execute(msg,song_name,serverQueue){
  let voiceChannel =  msg.member.voice.channel;
  if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
    }
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);

    if (commandList[1] == undefined){
      msg.channel.send("노래를 입력해주세요");
      return;
    }

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

    if(!serverQueue){
                const queueConstructor = {
                    txtChannel: msg.channel,
                    vChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true
                };
                queue.set(msg.guild.id, queueConstructor);
 
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await joinVoiceChannel({
                      channelId: msg.member.voice.channel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild.voiceAdapterCreator
                    });
                    queueConstructor.connection = connection;

                    
                    qplay(msg.guild, queueConstructor.songs[0]);
                }catch (err){
                    console.error(err);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(`Unable to join the voice chat ${err}`)
                }
            }else{
                serverQueue.songs.push(song);
                return msg.channel.send(`The song has been added ${song.url}`);
            }

  
}



function qplay(guild, song){

  const serverQueue = queue.get(guild.id);
  if(!song){
    serverQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdlexec(song.url, {
    o: '-',
    q: '',
    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
    r: '100K',
  }, { stdio: ['ignore', 'pipe', 'ignore'] })
  
  const player = createAudioPlayer();
  const resource = createAudioResource(stream.stdout);
  player.play(resource);
  serverQueue.connection.subscribe(player);
  
  player.on('error', error => {
    console.error(error);
  });

  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();

    player.play(guild, serverQueue.songs[0]);
  })

  serverQueue.txtChannel.send(`Now Playing ${serverQueue.song[0].url}`);

}

function stop ( msg,serverQueue){
  if(!msg.member.voice.channel){
    return msg.channel.send("음성채널에 들어가주세요!");
  }
  serverQueue.songs = [];
  serverQueue.connection.destroy();

}




module.exports= {
    music
}