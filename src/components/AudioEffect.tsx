class AudioEffect {
  private _audio: HTMLAudioElement | null = null;

  play({ url, force }: { url: string; force?: boolean }) {
    if (!this._audio) {
      this._audio = new window.Audio(url);
    } else {
      if (force) {
        this._audio.pause();
        this._audio.currentTime = 0;
        this._audio.src = url;
      }
    }
    this._audio.play();
  }
}

const audioEffect = new AudioEffect();
export default audioEffect; 