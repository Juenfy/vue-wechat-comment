<script setup>
import {onMounted, onBeforeUnmount, onUnmounted, ref, watch, nextTick} from "vue"
import {getEmojiTab} from "../utils/emojiLoader"
import {emoji, baseUrl} from "../emoji"

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  modules: {
    type: String,
    default: 'voice,emoji,send',
  },
  position: {
    type: String,
    default: 'bottom',
  },
  emoji: {
    type: Object,
    default: {}
  },
  disabledDefaultEmoji: {
    type: Boolean,
    default: false,
  },
  activeDefaultEmoji: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['sendCb', 'focus', 'input', 'startVoice', 'stopVoice'])

const msg = ref({
  type: '',
  content: '',
})
const commentRef = ref(null)
const isVoice = ref(false)
const isVoicing = ref(false);
const isCancelVoice = ref(false)
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const mediaStream = ref(null);
const startY = ref(0);
const waveOffset = ref(0);
const animationFrame = ref(null);


const popupEmoji = ref(false)
const popupMore = ref(false)
const emojiTab = ref([])
const loadedEmoji = ref({})
const activeEmoji = ref([])
const activeTabId = ref(null)
const message = ref('')

// 输入框输入事件
const onMessageInput = (e) => {
  msg.value.content = e.target.value
  emit('input', e)
}

// 模块按钮点击事件
const onClickModules = (module) => {
  switch (module) {
    case 'voice':
      isVoice.value = !isVoice.value
      popupMore.value = false
      popupEmoji.value = false
      break
    case 'emoji':
      if (!popupEmoji.value && popupMore.value) {
        popupMore.value = false
        setTimeout(() => {
          popupEmoji.value = true
        }, 300)
      } else {
        popupEmoji.value = !popupEmoji.value
      }
      break
    case 'more':
      if (!popupMore.value && popupEmoji.value) {
        popupEmoji.value = false
        setTimeout(() => {
          popupMore.value = true
        }, 300)
      } else {
        popupMore.value = !popupMore.value
      }
      break
  }
}

// 点击评论组件区域外收缩展开项
const handleClickOutside = (e) => {
  if (commentRef.value && !commentRef.value.contains(e.target)) {
    // popupEmoji.value = false
    // popupMore.value = false
  }
};

// 切换表情包
const onClickEmojiTab = (tabId) => {
  activeEmoji.value = loadedEmoji.value[tabId]
  activeTabId.value = tabId
}

// 发送消息
const sendMsg = () => {
  popupMore.value = false
  popupEmoji.value = false
  if (message.value.trim().length <= 0) return false
  msg.value.type = 'text'
  emit('sendCb', msg.value)
  message.value = ''
}

// 发送表情包
const sendEmoji = (emoji) => {
  msg.value.type = 'emoji'
  msg.value.content = emoji
  emit('sendCb', msg.value)
}


//录音
const initVoice = async () => {
  try {
    mediaStream.value = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaRecorder.value = new MediaRecorder(mediaStream.value)

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, {type: 'audio/wav'})
      audioChunks.value = []
      if (!isCancelVoice.value) {
        // 这里可以上传录音文件或进行其他处理
        console.log('录音文件:', audioBlob)
        msg.value.content = {file: audioBlob}
        msg.value.type = 'voice'
        emit("sendCb", msg.value)
      }
    };
  } catch (error) {
    console.error('获取本地媒体流失败:', error)
  }
}
const animateWave = () => {
  waveOffset.value = (waveOffset.value + 1) % 100
  animationFrame.value = requestAnimationFrame(animateWave)
};

const wavePath = (n) => {
  const amplitude = 10
  const frequency = 0.1
  let path = "M 0 15 "
  for (let x = 0; x <= 100; x++) {
    const y =
        15 + amplitude * Math.sin(frequency * (x + waveOffset.value + n * 20))
    path += `L ${x} ${y} `
  }
  return path
};
const startRecording = (e) => {
  console.log('开始录音', e)
  emit('startVoice')
  msg.value.type = 'voice'
  startY.value = e.touches[0].clientY
  isVoicing.value = true
  isCancelVoice.value = false
  audioChunks.value = []
  if (mediaRecorder.value) {
    mediaRecorder.value.start()
  }
  animationFrame.value = requestAnimationFrame(animateWave)
};

const stopRecording = (e) => {
  if (mediaRecorder.value && isVoicing.value) {
    mediaRecorder.value.stop()
    console.log(isCancelVoice.value ? '取消录音' : '发送录音')
    emit('stopVoice', isCancelVoice.value ? 'cancel' : 'send')
  }
  isVoicing.value = false
  cancelAnimationFrame(animationFrame.value)
};

const handleTouchMove = (e) => {
  const currentY = e.touches[0].clientY
  // 上划距离超过50像素取消
  isCancelVoice.value = startY.value - currentY > 100
};

watch(isVoice, val => {
  msg.value.type = val ? 'audio' : 'text'
})

onMounted(() => {

  nextTick(() => {
    // document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        // 在这里执行你的操作
        sendMsg()
      }
    });
  });
  if (props.modules.indexOf('voice') !== -1) {
    initVoice()
  }
  if (props.modules.indexOf('emoji') !== -1) {
    if (!props.disabledDefaultEmoji) {
      loadedEmoji.value = emoji
    }
    if (props.emoji) {
      Object.keys(props.emoji).forEach(key => {
        props.emoji[key].default = false
        loadedEmoji.value[key] = props.emoji[key]
      })
    }
    const loadedEmojiKey = Object.keys(loadedEmoji.value)
    if (loadedEmojiKey.length > 0) {
      emojiTab.value = getEmojiTab(loadedEmoji.value)
      activeTabId.value = props.activeDefaultEmoji.trim() !== '' ? props.activeDefaultEmoji : loadedEmojiKey[0]
      activeEmoji.value = loadedEmoji.value[activeTabId.value]
      console.log('当前展开表情包选项卡：', activeTabId.value, activeEmoji.value)
    }
    console.log('加载表情包完毕：', loadedEmoji.value, '表情包选项卡：', emojiTab.value)
  }
})
onBeforeUnmount(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
});

onUnmounted(async () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop())
  }
});
</script>
<script>
export default {}
</script>
<template>
  <div v-show="props.show" :class="'wechat-comment-container position-'+props.position" ref="commentRef">
    <div class="top">
      <div class="voice" v-if="props.modules.indexOf('voice') !== -1" @click="onClickModules('voice')">
        <img src="../assets/voice.png" class="icon" alt="voice" v-if="!isVoice"/>
        <img src="../assets/keyboard.png" class="icon" alt="keyboard" v-else/>
      </div>
      <div class="message">
        <textarea v-model="message" @focus="$emit('focus')" @input="onMessageInput" v-if="!isVoice"/>
        <button type="button" v-else @touchstart="startRecording" @touchend="stopRecording"
                @touchmove="handleTouchMove">按住说话
        </button>
      </div>
      <div class="emoji" v-if="props.modules.indexOf('emoji') !== -1" @click="onClickModules('emoji')">
        <img src="../assets/emoji.png" class="icon" alt="emoji" v-if="!popupEmoji"/>
        <img src="../assets/keyboard.png" class="icon" alt="keyboard" v-else/>
      </div>
      <div class="more" v-if="props.modules.indexOf('more') !== -1" @click="onClickModules('more')">
        <img src="../assets/more.png" class="icon" alt="send"/>
      </div>
      <div class="send" @click="sendMsg" v-if="props.modules.indexOf('send') !== -1">
        <img src="../assets/send.png" class="icon" alt="send"/>
      </div>
    </div>
    <div :class="'bottom ' + (popupEmoji || popupMore ? 'active' : '')">
      <div class="emoji" v-if="popupEmoji">
        <div class="tab">
          <div :class="'item ' + (activeTabId === tab.id ? 'active' : '')" v-for="tab in emojiTab" :key="tab.id"
               @click="onClickEmojiTab(tab.id)">
            <img :src="tab.default ? (baseUrl+tab.id+'/'+tab.name+'.'+tab.ext) : tab.path" alt="tab.id">
          </div>
        </div>
        <div class="container">
          <div class="item" v-for="emoji in activeEmoji" :key="emoji.name" @click="sendEmoji(emoji)">
            <img :src="emoji.default ? (baseUrl+activeTabId+'/'+emoji.name+'.'+emoji.ext) : emoji.path"
                 :alt="emoji.name">
            <span>{{ emoji.name }}</span>
          </div>
        </div>
      </div>
      <div class="more" v-if="popupMore">

      </div>
    </div>
  </div>
  <div class="voice-recording" v-if="isVoicing">
    <div :class="isCancelVoice ? 'bubble bubble-cancel' : 'bubble'">
      <svg class="waveform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
        <path v-for="n in 5" :key="n" :d="wavePath(n)" stroke="white" stroke-width="2" fill="none"
              :opacity="1 - n * 0.15"/>
      </svg>
    </div>
    <div class="recording-text">
      {{
        isCancelVoice ? "松开手指，取消发送" : "正在录音... 上划取消"
      }}
    </div>
  </div>
</template>

<style lang="scss">
@import "../assets/style/style.scss";
</style>