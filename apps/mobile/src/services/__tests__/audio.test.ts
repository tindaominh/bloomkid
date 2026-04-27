jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  },
}));

import { Audio } from 'expo-av';
import { AudioService } from '../audio';

const mockCreateAsync = Audio.Sound.createAsync as jest.Mock;

const mockSound = {
  playAsync: jest.fn().mockResolvedValue(undefined),
  unloadAsync: jest.fn().mockResolvedValue(undefined),
};

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAsync.mockResolvedValue({ sound: mockSound });
    service = new AudioService();
  });

  it('play loads and plays a remote audio URL', async () => {
    await service.play('https://s3.example.com/cat.mp3');
    expect(mockCreateAsync).toHaveBeenCalledWith(
      { uri: 'https://s3.example.com/cat.mp3' },
    );
    expect(mockSound.playAsync).toHaveBeenCalled();
  });

  it('play unloads previous sound before playing new one', async () => {
    await service.play('https://s3.example.com/cat.mp3');
    await service.play('https://s3.example.com/dog.mp3');
    expect(mockSound.unloadAsync).toHaveBeenCalledTimes(1);
  });

  it('stop unloads the current sound', async () => {
    await service.play('https://s3.example.com/cat.mp3');
    await service.stop();
    expect(mockSound.unloadAsync).toHaveBeenCalled();
  });

  it('stop does nothing if no sound is loaded', async () => {
    await expect(service.stop()).resolves.not.toThrow();
  });
});
