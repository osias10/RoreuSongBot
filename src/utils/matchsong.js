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
const participant = new Map();

async function participate(msg){
  //console.log(msg.author);
  const partqueue = participant.get(msg.guild.id);
  if (!partqueue){
    const partConstructor = {
      txtChannel: msg.channel,
      
      participants:[]
    }

    participant.set(msg.guild.id, partConstructor);
    msg.author.point=0;
    msg.author.skip=false;
    partConstructor.participants.push(msg.author);
    
  }
  else{
    let parti = participant.get(msg.guild.id).participants.find((item,idx) =>{
      return item.id == msg.author.id;
    });
    if (parti == undefined){
      msg.author.point=0;
      msg.author.skip=false;
      participant.get(msg.guild.id).participants.push(msg.author);
    }
  }
  let playerList = participant.get(msg.guild.id).participants;
  let nowPlayer = "참여자 목록\n";

  for (let i =0; i<playerList.length; i++){
    nowPlayer+=`<@${playerList[i].id}>, `;
  }
  //nowPlayer+="```"
  
  return msg.channel.send(nowPlayer);

}
/*
User {
  id: '00000000',
  bot: false,
  system: false,
  flags: UserFlags { bitfield: 0 },
  username: 'name',
  discriminator: '0000',
  avatar: null
}
*/
async function cancelParti(msg){
  const partqueue = participant.get(msg.guild.id);
  let result="";
  if(partqueue){
    const idx = partqueue.participants.findIndex(function(item) {return item.id === msg.author.id}) // findIndex = find + indexOf 
  
    if (idx > -1) {
      result+= `<@${msg.author.id}>`;
      partqueue.participants.splice(idx, 1);
    }
    return msg.channel.send(result+"  참가 취소 완료");
  }
}

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
    else if (commandList[1] == 'stop'){
      /*
      let scores = scoreList(participant.get(msg.guild.id).participants);
      let scoreResult ="[게임 결과]\n";
      for (let i ; i<scores.length; i++){
        scoreResult+=`${i+1}등: <@${scores[i].id}> - ${socres[i].point}점`;
      }

      msg.channel.send(scoreResult);
      */
      stop(msg,matchqueue);

    }
    else if (commandList[1] == 'test'){
      let test = await fs.readFile('./src/utils/files/songlist/test.json');
      
      execute(msg,serverQueue,test);
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
                    qplay(msg,msg.guild, queueConstructor.songs[0][0]);
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

    qplay(msg,guild, serverQueue.songs[0][0]);
  });
  



  //serverQueue.txtChannel.send(`Now Playing ${serverQueue.songs[0].url}`);
  console.log(`Now Playing ${serverQueue.songs[0].url}`);

}

function qplay(msg,guild, song){
  
  const serverQueue = matchqueue.get(guild.id);
  if(!song){
    /*
    serverQueue.connection.destroy();

    matchqueue.delete(guild.id);
    */
    stop(msg,matchqueue);
    return;
  }
  let startUrl = song.URL;
  if(song.length){


    startUrl = song.URL+'?t='+getRandom(0,song.length-60);
  }else{
    startUrl=song.URL;
  }
  console.log(startUrl);
  const stream = ytdlexec(startUrl, {
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

    qplay(msg,guild, serverQueue.songs[0][0]);
  });
  



  //serverQueue.txtChannel.send(`Now Playing ${serverQueue.songs[0][0].URL}`);

}

function answercheck(msg){
  if(matchqueue.has(msg.guild.id)){
    if(!participant.has(msg.guild.id) && matchqueue.get(msg.guild.id).txtChannel.id == msg.channel.id){
      return msg.channel.send("[*참가 노래맞추기]  명령어로 참가신청을 먼저 해주세요");
      
    }
    else if(matchqueue.get(msg.guild.id).txtChannel.id != msg.channel.id){
      return;
    }
    let parti = participant.get(msg.guild.id).participants.find((item,idx) =>{
      return item.id == msg.author.id;
    });

    if (matchqueue.get(msg.guild.id).txtChannel == msg.channel && parti !=undefined){
      let answer = matchqueue.get(msg.guild.id).songs[0][0].song.find((item) =>{
        return item == msg.content.replace(/(\s*)/g, "");
      });

      const command = msg.content.trim().substring(1);
      const commandList = command.trim().split(/ +/);
      /*
      if (commandList[0] == '노래맞추기' &&commandList[1] == 'stop'){
        stop(msg,matchqueue);
      }
      console.log(matchqueue);
      */
      if(answer!=undefined){
        answer="바뀜";
        msg.channel.send(`<@${parti.id}> 정답입니다\n 정답: ${matchqueue.get(msg.guild.id).songs[0][0].song[0]}`);
        parti.point+=1;
        skip(msg,matchqueue.get(msg.guild.id));
        let printPoint="[점수판]";
        let score = participant.get(msg.guild.id).participants;
        for (let i =0; i<score.length; i++){
          printPoint+=`\n<@${score[i].id}>: ${score[i].point}p`;
        }
        //console.log(printPoint);
        msg.channel.send(printPoint);
        return
      }
      else if(msg.content == '스킵' || msg.content== 'skip'){
        parti.skip = true;
        let skipq = participant.get(msg.guild.id).participants.filter((item,idx) =>{
          return item.skip == true
        });
        //console.log(skipq);
        let skiped = participant.get(msg.guild.id).participants.length
        printSkip = `문제 스킵 투표 ${skipq.length}/${skiped - 1}`;
        msg.channel.send(printSkip);
        
        if (skipq.length >= skiped-1){
          msg.channel.send('문제를 건너뜁니다.');
          for (let j=0; j<skipq.length; j++){
            skipq[j].skip = false;
          }
          skip(msg,matchqueue.get(msg.guild.id));
        }
        

      }
      //return msg.channel.send("게임이 진행중입니다");
    }
    
  }
  else return 

}

function skip(msg, serverQueue){
  if (!msg.member.voice.channel){
    return msg.channel.send("음성채널에 들어가주세요!");

  }
  if (!serverQueue){
    return msg.channel.send("넘어갈 곡이 없습니다.");
  }
  serverQueue.player.stop();
  //serverQueue.connection.dispatcher.end();
}


function stop ( msg,mq){
  if(!msg.member.voice.channel){
    return msg.channel.send("음성채널에 들어가주세요!");
  }
  
  //const q = mq.get(msg.guild.id);
  let q=matchqueue.get(msg.guild.id);
  console.log(matchqueue);
  console.log(q);
  q.songs[0] = [];
  q.connection.destroy();
  mq.delete(msg.guild.id);
  
  let scores = scoreList(participant.get(msg.guild.id).participants);
  let scoreResult ="[게임 결과]\n";
  for (let i=0 ; i<scores.length; i++){
    scoreResult+=`\n${i+1}등: <@${scores[i].id}>  (${scores[i].point}점)`;
  }

  msg.channel.send(scoreResult);
  
  participant.get(msg.guild.id).participants =[];


}

function scoreList(scores){
  scores.sort(function(a,b) {

    return parseFloat(b.point) - parseFloat(a.point);
  
  });
  
  
  
  return scores;
}


function getRandom(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}





  module.exports = {
    matchmusic,
    answercheck,
    participate,
    cancelParti
  }