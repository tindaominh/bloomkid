import { Audio } from 'expo-av';

export class AudioService {
  private current: Audio.Sound | null = null;

  async play(uri: string): Promise<void> {
    if (this.current) {
      await this.current.unloadAsync();
      this.current = null;
    }
    const { sound } = await Audio.Sound.createAsync({ uri });
    this.current = sound;
    await sound.playAsync();
  }

  async stop(): Promise<void> {
    if (this.current) {
      await this.current.unloadAsync();
      this.current = null;
    }
  }
}
