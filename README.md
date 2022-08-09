# g711
> A JavaScript Audio Codec for G711A/G711U/PCM. Pure javascript implements, no any other 3rd-party library required.

## PCM to G711A
``` ts
export function alawFromPCM(data: Int16Array | Int8Array): Uint8Array;

```


## G711A to PCM
``` ts
 
export function alawToPCM(data: Uint8Array, bit?: number): Int8Array | Int16Array;

```
## G711U to PCM
``` ts

export function ulawToPCM(data: Uint8Array, bit?: number): Int8Array;

```
## PCM to G711U
``` ts
export function ulawFromPCM(data: Int16Array | Int8Array): Uint8Array;

```
## PCM to WAV
``` ts
/**
 * 编码wav，一般wav格式是在pcm文件前增加44个字节的文件头，
 * 所以，此处只需要在pcm数据前增加下就行了。
 *
 * @param {DataView} bytes           pcm二进制数据
 * @param {number}  sampleRate  输入采样率
 * @param {number}  numChannels      声道数
 * @param {number}  sampleBits  输出采样位数
 * @param {boolean} littleEndian      是否是小端字节序
 * @returns {ArrayBuffer}               wav二进制数据
 */
export function encodeWAV(bytes: DataView, sampleRate?: SampleRate, numChannels?: NumChannels, sampleBits?: SampleBits, littleEndian?: boolean): ArrayBuffer;

```


## DEMO

``` js

  const audioUrl = './8k_1_16.g711u'; // 8KHZ 单声道 16-bit
  const res = await fetch(audioUrl);
  const arrayBuffer = await res.arrayBuffer(); // byte array字节数组
  const i16A = ulawToPCM(new Uint8Array(arrayBuffer),16)
  const wavBuf = encodeWAV(new DataView(i16A.buffer), 8000, 1, 16) // 8KHZ 单声道 16-bit
  // const wavBuf = encodeWAV(new DataView(i16A.buffer), 16000, 2, 16) // 16KHZ 双声道 16-bit
  const ctx = new (window.AudioContext || window.webkitAudioContext())();
  const audioBuffer = await ctx.decodeAudioData(wavBuf, decodeData => decodeData, err => console.error(err));
  const source = ctx.createBufferSource()
  source.buffer = audioBuffer; // 设置数据
  source.loop = false; //设置，循环播放
  source.connect(ctx.destination); // 头尾相连
  source.start(0); //立即播放
```


## 参考 C++ 版，感谢！
https://github.com/dreamisdream/audioTransfromTools