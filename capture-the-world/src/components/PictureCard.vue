<script setup>
import { ref } from 'vue';

const voiceTypeMap = {
  "zh_male_tiancaitongsheng_mars_bigtts": "天才童声",
  "zh_male_naiqimengwa_mars_bigtts": "奶气萌娃",
  "zh_male_sunwukong_mars_bigtts": "猴哥",
  "zh_male_xionger_mars_bigtts": "熊二",
  "zh_female_peiqi_mars_bigtts": "佩奇猪",
  "zh_female_zhixingnvsheng_mars_bigtts": "知性女声",
  "zh_female_qingxinnvsheng_mars_bigtts": "清新女声",
  "zh_male_changtianyi_mars_bigtts": "悬疑解说",
  "zh_female_popo_mars_bigtts": "婆婆", 
  "zh_male_silang_mars_bigtts": "四郎",
  "zh_female_wuzetian_mars_bigtts": "武则天",
  "zh_female_shaoergushi_mars_bigtts": "少儿故事",
  "zh_female_qiaopinvsheng_mars_bigtts": "俏皮女声",
}
const voiceTypeMap1 = {
  "zh_female_wanqudashu_moon_bigtts": "湾区大叔",
  "zh_female_daimengchuanmei_moon_bigtts": "呆萌川妹",
  // "zh_female_guozhoudege_moon_bigtts": "广州德哥",
  // "zh_female_beijingxiaoye_moon_bigtts": "北京小爷",
  "zh_male_shaonianzixin_moon_bigtts": "少年梓辛",
  "zh_female_meilinvyou_moon_bigtts": "魅力女友",
  "zh_male_shenyeboke_moon_bigtts": "深夜播客",
  "zh_female_sajiaonvyou_moon_bigtts": "柔美女友",
  "zh_female_yuanqinvyou_moon_bigtts": "撒娇学妹",
  // "zh_female_haoyuxiaoge_moon_bigtts": "浩宇小哥",
}


const props = defineProps({
  word: String,
  audio: String,
})
const emit = defineEmits(['updateImage', 'updateAudio']);

const imgPreview = ref('https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png');
const voiceType = ref("zh_female_wanqudashu_moon_bigtts")

const updateImageData = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const data = reader.result;
      imgPreview.value = data;
      emit('updateImage', data)
      resolve(data);
    };

    reader.onerror = (error) => {
      reject(error);
    }
  })
}

const audioElement = ref(null);
const isPlaying = ref(false);

const playAudio = async () => {
  try {    
    if (!audioElement.value) {
      // 创建音频上下文
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      
      // 获取音频数据
      const response = await fetch(props.audio);
      const arrayBuffer = await response.arrayBuffer();
      
      // 解码音频数据
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // 创建音频源
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // 保存音频源
      audioElement.value = {
        source,
        context: audioContext,
        play: () => {
          source.start(0);
          isPlaying.value = true;
        }
      };
      
      // 监听播放结束
      source.onended = () => {
        isPlaying.value = false;
        audioElement.value = null; // 重置音频元素，允许重新播放
      };
    }

    // 播放音频
    audioElement.value.play();
    
  } catch (error) {
    console.error('音频播放错误:', error);
    alert('音频播放失败，请重试');
    isPlaying.value = false;
    audioElement.value = null;
  }
}
const donwloadAudio = async () => {
  const response = await fetch(props.audio);
  const blob = await response.blob();

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'audio.mp3';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl)
}
const handleChangeVoice = async (event) => {
  const value = event.target.value;
  voiceType.value = value;
  emit('updateAudio', null, voiceType.value)
}
</script>

<template>
  <div class="card">
    <input id="selecteImage" class="input" type="file" accept=".jpg, .jpeg, .png, .gif" @change="updateImageData" />
    <label for="selecteImage" class="upload">
      <img :src="imgPreview" alt="preview" />
    </label>
    <div class="word">{{ props.word }}</div>
    <div class="img-wrapper">
      <select @change="handleChangeVoice">
        <option v-for="(value, key) in voiceTypeMap" :value="key">{{ value }}</option>
      </select>
      <div v-if="props.audio" class="playAudio" @click="playAudio">
          <img width="20px" src="https://res.bearbobo.com/resource/upload/Omq2HFs8/playA-3iob5qyckpa.png" alt="logo" />
      </div>
      <div @click="donwloadAudio">下载音频文件</div>
    </div>
   
  </div>
</template>

<style scoped>
#selecteImage {
  display: none;
}
.card {
  border-radius: 8px;
  padding: 20px;
  margin-top: 40px;
  height: 280px;
  box-shadow: rgb(63,38,21) 0 3px 0px 0;
  background-color: rgb(105,78,62);
  box-sizing: border-box;
  text-align: center;
}
.upload {
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.word {
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
  color: rgb(255,255,255);
}
.playAudio {
  font-size: 20px;
  text-align: center;
}

.playAudio img {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
</style>
