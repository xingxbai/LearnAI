<script setup>
import { ref } from 'vue';

const props = defineProps({
  word: String,
  audio: String
})
const emit = defineEmits(['updateImage']);

const imgPreview = ref('https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png');

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
    console.log('开始播放音频:', props.audio);
    
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
</script>

<template>
  <div class="card">
    <input id="selecteImage" class="input" type="file" accept=".jpg, .jpeg, .png, .gif" @change="updateImageData" />
    <label for="selecteImage" class="upload">
      <img :src="imgPreview" alt="preview" />
    </label>
    <div class="word">{{ props.word }}</div>
    <div v-if="props.audio" class="playAudio" @click="playAudio">
        <img width="20px" src="https://res.bearbobo.com/resource/upload/Omq2HFs8/playA-3iob5qyckpa.png" alt="logo" />
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
  color: rgb(255,255,255);
}
.playAudio {
  margin-top: 16px;
}

.playAudio img {
  cursor: pointer;
}
</style>
