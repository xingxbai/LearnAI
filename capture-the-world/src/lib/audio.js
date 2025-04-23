export const createBlobURL = (base64AudioData) => {
  // 1. 解码base64
  const binaryString = atob(base64AudioData);
  // 2. 转化Unicode 编码值放入数组中
  const arrayBuffer = [];
  for (var offect = 0; offect < binaryString.length; offect++) {
    arrayBuffer.push(binaryString.charCodeAt(offect));
  }
  // 3.生成arrayBuffer 对象
  const arrayBuffer8 = new Uint8Array(arrayBuffer);
  const blob = new Blob([arrayBuffer8], { type: "audio/mp3" });
  // 4.生成blob url
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
};
export const generateAudio = async (text) => {
  const token = import.meta.env.VITE_AUDIO_ACCESS_TOKEN;
  const appId = import.meta.env.VITE_AUDIO_APP_ID;
  const clusterId = import.meta.env.VITE_AUDIO_CLUSTER_ID;
  const voiceName = import.meta.env.VITE_AUDIO_VOICE_NAME;

  const endpoint = "/tts/api/v1/tts";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer;${token}`,
  };

  const payload = {
    app: {
      appid: appId,
      token,
      cluster: clusterId,
    },
    user: {
      uid: "bearbobo",
    },
    audio: {
      voice_type: voiceName,
      encoding: "ogg_opus",
      compression_rate: 1,
      rate: 24000,
      speed_ratio: 1.0,
      volume_ratio: 1.0,
      pitch_ratio: 1.0,
      emotion: "happy",
      language: 'cn',
    },
    request: {
      reqid: Math.random().toString(36).substring(7),
      text,
      text_type: "plain",
      operation: "query",
      silence_duration: "125",
      with_frontend: "1",
      frontend_type: "unitTson",
      pure_english_opt: "1",
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.data) {
    throw new Error("No audio data returned");
  }
  return createBlobURL(data.data);
};