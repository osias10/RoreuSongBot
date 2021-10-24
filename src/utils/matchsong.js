const iu = require('./files/songlist/IU.json');


const ytdlexec = require('youtube-dl-exec').raw

const { joinVoiceChannel,
  createAudioPlayer,
  createAudioResource, 
  AudioPlayerStatus
} = require('@discordjs/voice');



async function matchmusic(msg){
    const command = msg.content.trim().substring(1);
    const commandList = command.trim().split(/ +/);
    if (!commandList[1]){
        return msg.channel.send("종류를 붙여주세요  종류: 아이유");
    }else if (commandList[2]=='아이유'){
        
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

  module.exports = {
    matchmusic
  }