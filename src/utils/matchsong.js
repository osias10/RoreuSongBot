const iu = require('./files/songlist/IU.json');
//const ytdl = require("ytdl-core");
const yts = require("yt-search");

const ytdlexec = require('youtube-dl-exec').raw

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource, 
  AudioPlayerStatus
} = require('@discordjs/voice');

const matchqueue = new Map();

async function matchmusic(msg){
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);
    if (!commandList[1]){
        return msg.channel.send("종류를 붙여주세요  종류: 아이유");
    }else if (commandList[2]=='아이유'){
        
      const voiceChannel =  msg.member.voice.channel;
      if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
      }

      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
      }
      
      execute(msg,serverQueue,iu);
      
    }

    
    
    
}


async function execute(msg,serverQueue,songKind){
  let voiceChannel =  msg.member.voice.channel;
  if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");
    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
    }
    

    if (commandList[1] == undefined){
      msg.channel.send("노래를 입력해주세요");
      return;
    }

    
    const player = createAudioPlayer();

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


                
                queueConstructor.songs.push(song);
 
                try{
                    let connection = await joinVoiceChannel({
                      channelId: msg.member.voice.channel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild.voiceAdapterCreator
                    });
                    queueConstructor.connection = connection;

                    console.log(queueConstructor);
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





  module.exports = {
    matchmusic
  }