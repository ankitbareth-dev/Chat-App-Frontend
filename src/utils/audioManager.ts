class AudioManager {
  private currentAudio: HTMLAudioElement | null = null;

  play(newAudio: HTMLAudioElement) {
    if (this.currentAudio && this.currentAudio !== newAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentAudio = newAudio;
  }

  stop(audio: HTMLAudioElement) {
    if (this.currentAudio === audio) {
      this.currentAudio = null;
    }
  }
}

export const audioManager = new AudioManager();
