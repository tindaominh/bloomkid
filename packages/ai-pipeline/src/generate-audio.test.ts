import fs from 'fs/promises';
import path from 'path';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

import { generateAudio } from './generate-audio';

const FAKE_AUDIO = Buffer.from('fake-mp3-binary-data');

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    arrayBuffer: jest.fn().mockResolvedValue(FAKE_AUDIO.buffer),
  });
  mockFs.mkdir.mockResolvedValue(undefined);
  mockFs.writeFile.mockResolvedValue(undefined);
});

describe('generateAudio', () => {
  it('calls ElevenLabs API with the word text', async () => {
    await generateAudio('cat', 'animals');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('elevenlabs.io'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: expect.stringContaining('"text":"cat"'),
      }),
    );
  });

  it('saves MP3 to output/<category>/<word>.mp3', async () => {
    await generateAudio('cat', 'animals');
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('output', 'animals', 'cat.mp3')),
      expect.any(Buffer),
    );
  });

  it('creates output directory if it does not exist', async () => {
    await generateAudio('dog', 'animals');
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(path.join('output', 'animals')),
      { recursive: true },
    );
  });

  it('throws if ElevenLabs returns a non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' });
    await expect(generateAudio('cat', 'animals')).rejects.toThrow('ElevenLabs');
  });

  it('returns the local file path of the saved MP3', async () => {
    const filePath = await generateAudio('lion', 'animals');
    expect(filePath).toContain(path.join('output', 'animals', 'lion.mp3'));
  });
});
