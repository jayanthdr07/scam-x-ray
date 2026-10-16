/**
 * SCAMTRACE Live Voice Audio Streaming Engine
 * Handles 16kHz microphone capture encoding (Float32 -> Int16 PCM Base64)
 * and gapless 24kHz audio buffer queue playback for Gemini 3.8 Live API responses.
 */

export function pcm16ToBase64(inputData: Float32Array): string {
  const buffer = new ArrayBuffer(inputData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < inputData.length; i++) {
    // Clamp to [-1, 1]
    const s = Math.max(-1, Math.min(1, inputData[i]));
    // Scale to 16-bit signed integer [-32768, 32767]
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(i * 2, val, true); // little-endian
  }

  // Convert binary to base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const numSamples = Math.floor(bytes.length / 2);
  const output = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const int16 = view.getInt16(i * 2, true); // little-endian
    output[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
  }

  return output;
}

export class LiveAudioQueuePlayer {
  private ctx: AudioContext | null = null;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor(sampleRate: number = 24000) {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate });
    }
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  public async resume(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public playChunk(base64Pcm: string): void {
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const samples = base64ToFloat32(base64Pcm);
      if (samples.length === 0) return;

      const audioBuffer = this.ctx.createBuffer(1, samples.length, 24000);
      audioBuffer.getChannelData(0).set(samples);

      const source = this.ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.ctx.destination);

      const currentTime = this.ctx.currentTime;
      // If queue fell behind, reset nextPlayTime to now
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime + 0.04; // small 40ms safety buffer
      }

      source.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
      };
    } catch (err) {
      console.error('[LiveAudioQueuePlayer] Error playing chunk:', err);
    }
  }

  public stopAll(): void {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    }
    this.activeSources = [];
    if (this.ctx) {
      this.nextPlayTime = this.ctx.currentTime;
    }
  }

  public close(): void {
    this.stopAll();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}
