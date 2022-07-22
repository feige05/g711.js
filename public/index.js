import { ulawToPCM , encodeWAV} from '../src/index'
import audioFile from "url:./8k_1_16.g711u"
var ctx = new (window.AudioContext || window.webkitAudioContext())();
let source = null; // 创建音频源头
// 暂停
async function resumeAudio() {
  console.log(ctx.state)
  if (ctx.state === "running") {
    ctx.suspend();
  } else if (ctx.state === "suspended") {
    ctx.resume();
  }
}
// 停止
async function stopAudio() {
  source && source.stop();
}
async function loadAudio() {
  // const audioUrl = './8k_1_16.g711u';
  // const audioUrl = 'http://127.0.0.1:8080/16k_2_16.g711u';// 16000, 16000, 2, 16
  const res = await fetch(audioFile);
  const arrayBuffer = await res.arrayBuffer(); // byte array字节数组
  console.log(arrayBuffer)
  const i16A = ulawToPCM(new Uint8Array(arrayBuffer),16)
  // console.log(i16A)
  const wavBuf = encodeWAV(new DataView(i16A.buffer), 8000, 1, 16)
  // const wavBuf = encodeWAV(new DataView(i16A.buffer), 16000, 2, 16)
  const audioBuffer = await ctx.decodeAudioData(wavBuf, decodeData => decodeData, err => console.error(err));
  return audioBuffer;

}

async function playSound(audioBuffer) {
  source = ctx.createBufferSource()
  source.buffer = audioBuffer; // 设置数据
  source.loop = false; //设置，循环播放
  source.connect(ctx.destination); // 头尾相连
  // 可以对音频做任何控制
  source.start(0); //立即播放
}

document.getElementById('start').addEventListener('click', async function playAudio() {
  const audioBuffer = await loadAudio();
  audioBuffer && playSound(audioBuffer);
})

document.getElementById('stop').addEventListener('click', () => {
  stopAudio()
})

document.getElementById('resume').addEventListener('click', () => {
  resumeAudio()
})
