//const iu = require('./files/songlist/IU.json');
//const ytdl = require("ytdl-core");
const yts = require("yt-search");
const fs = require('fs').promises;

const ytdlexec = require('youtube-dl-exec').raw

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource, 
  AudioPlayerStatus,
  AudioPlayer,
  AudioPlayerError,
  VoiceConnection,
  VoiceConnectionStatus
} = require('@discordjs/voice');

const matchqueue = new Map();

async function matchmusic(msg){
    const serverQueue = matchqueue.get(msg.guild.id);
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);
    if (!commandList[1]){
        return msg.channel.send("종류를 붙여주세요  종류: 아이유");
    }else if (commandList[1]=='아이유'){
      msg.channel.send("아이유 노래맞추기를 시작합니다");
      const voiceChannel =  msg.member.voice.channel;
      if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
      }

      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
      }
      let iu = await fs.readFile('./src/utils/files/songlist/IU.json');
      
      execute(msg,serverQueue,iu);
      
    }
    
    
    
    
}


async function execute(msg,serverQueue,singer){
  let voiceChannel =  msg.member.voice.channel;
  if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
    }
    let songKind = JSON.parse(singer);

    if (songKind == undefined){
      msg.channel.send("노래를 입력해주세요");
      return;
    }
    
    msg.channel.send(`${songKind[0].Title}`);
    msg.channel.send(`${songKind[0].Description}`);
    songKind.splice(0,1);

    songKind.sort(function(){
      return Math.random() - Math.random();
    });

    
    const player = createAudioPlayer();

    if(!serverQueue){
                const queueConstructor = {
                    txtChannel: msg.channel,
                    vChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 10,
                    playing: true,
                    player: player
                    
                };
                matchqueue.set(msg.guild.id, queueConstructor);
 
                /*
                if (ytdl.validateURL(song_name)) {
                  const songInfo = await ytdl.getInfo(song_name);
                  song = {
                    title: songInfo.title,
                    url: songInfo.video_url
                  };
                } else {
                  //const {videos} = await yts(arg.slice(1).join(" "));
                  const {videos} = await yts(song_name);
                  
                  if (!videos.length) return msg.channel.send("No songs were found!");
                  song = {
                    title: videos[0].title,
                    url: videos[0].url
                  };
                }
                */

                
                queueConstructor.songs.push(songKind);
 
                try{
                    let connection = await joinVoiceChannel({
                      channelId: msg.member.voice.channel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild.voiceAdapterCreator
                    });
                    queueConstructor.connection = connection;

                    //console.log(queueConstructor);
                    //console.log(queueConstructor.songs[0]);
                    qplay(msg.guild, queueConstructor.songs[0][0]);
                }catch (err){
                    console.error(err);
                    matchqueue.delete(msg.guild.id);
                    //return msg.channel.send(`Unable to join the voice chat ${err}`)
                    return ;
                }
            }else{
                serverQueue.songs.push(songKind);
                //return msg.channel.send(`The song has been added ${song.url}`);
                return ;
            }

  
}

function wqplay(guild, song){
  console.log(song);
  const serverQueue = matchqueue.get(guild.id);
  if(!song){
    serverQueue.connection.destroy();
    matchqueue.delete(guild.id);
    return;
  }
  const stream = ytdlexec(song.URL, {
    o: '-',
    q: '',
    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
    r: '100K',
  }, { stdio: ['ignore', 'pipe', 'ignore'] })
  
  //const player = createAudioPlayer();
  const resource = createAudioResource(stream.stdout);
  const player = serverQueue.player;
  player.play(resource);
  serverQueue.connection.subscribe(player);
  
  player.on('error', error => {
    console.error(error);
  });
  /*
  serverQueue.connection.on('finish', () => {
    console.log("곡 shift");
    serverQueue.songs.shift();

    player.play(guild, serverQueue.songs[0]);
  })
*/
  player.once(AudioPlayerStatus.Idle, () => {
    console.log("곡 shift");
    serverQueue.songs[0].shift();

    qplay(guild, serverQueue.songs[0][0]);
  });
  



  //serverQueue.txtChannel.send(`Now Playing ${serverQueue.songs[0].url}`);

}

function qplay(guild, song){

  const serverQueue = matchqueue.get(guild.id);
  if(!song){
    serverQueue.connection.destroy();
    matchqueue.delete(guild.id);
    return;
  }
  const stream = ytdlexec(song.URL, {
    o: '-',
    q: '',
    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
    r: '100K',
  }, { stdio: ['ignore', 'pipe', 'ignore'] })
  
  //const player = createAudioPlayer();
  const resource = createAudioResource(stream.stdout);
  const player = serverQueue.player;
  
  player.play(resource);
  serverQueue.connection.subscribe(player);
  
  player.on('error', error => {
    console.error(error);
  });
  /*
  serverQueue.connection.on('finish', () => {
    console.log("곡 shift");
    serverQueue.songs.shift();

    player.play(guild, serverQueue.songs[0]);
  })
*/
  player.once(AudioPlayerStatus.Idle, () => {
    console.log("곡 shift");
    serverQueue.songs[0].shift();

    qplay(guild, serverQueue.songs[0][0]);
  });
  



  serverQueue.txtChannel.send(`Now Playing ${serverQueue.songs[0][0].URL}`);

}

function answercheck(msg){
  if(matchqueue.has(msg.guild.id)){
    return msg.channel.send("게임이 진행중입니다");
  }
  else return msg.channel.send("진행x");

}



  module.exports = {
    matchmusic,
    answercheck
  }