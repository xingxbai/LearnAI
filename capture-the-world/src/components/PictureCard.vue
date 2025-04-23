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
      audioElement.value = new Audio();
      audioElement.value.src = props.audio;
      
      // 添加音频事件监听
      audioElement.value.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
        const error = e.target.error;
        let errorMessage = '未知错误';
        
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = '播放被中止';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = '解码错误';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '音频格式不支持';
            break;
        }
        
        alert(`音频错误: ${errorMessage}`);
      });
    }

    try {
      console.log('尝试播放音频');
      const playPromise = audioElement.value.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('播放Promise错误:', error);
          if (error.name === 'NotAllowedError') {
            alert('浏览器阻止了自动播放，请再次点击播放按钮');
          } else {
            alert(`播放失败: ${error.message}`);
          }
        });
      }
    } catch (playError) {
      console.error('播放执行错误:', playError);
      alert(`播放执行错误: ${playError.message}`);
    }
  } catch (error) {
    console.error('音频总体错误:', error);
    alert(`音频错误: ${error.message}`);
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
