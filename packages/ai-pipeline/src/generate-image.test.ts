import fs from 'fs/promises';
import path from 'path';

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

import { generateImage } from './generate-image';

const FAKE_IMAGE = Buffer.from('fake-png-binary-data');

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch
    .mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: [{ url: 'https://example.com/image.png' }],
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(FAKE_IMAGE.buffer),
    });
  mockFs.mkdir.mockResolvedValue(undefined);
  mockFs.writeFile.mockResolvedValue(undefined);
});

describe('generateImage', () => {
  it('calls DALL-E 3 API with the image prompt', async () => {
    await generateImage('cat', 'animals', 'A cute cartoon cat, white background');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('openai.com'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: expect.stringContaining('A cute cartoon cat'),
      }),
    );
  });

  it('downloads the image from the returned URL', async () => {
    await generateImage('cat', 'animals', 'A cute cartoon cat, white background');
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/image.png');
  });

  it('saves PNG to output/<category>/<word>.png', async () => {
    await generateImage('cat', 'animals', 'A cute cartoon cat, white background');
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining(path.join('output', 'animals', 'cat.png')),
      expect.any(Buffer),
    );
  });

  it('creates output directory if it does not exist', async () => {
    await generateImage('dog', 'animals', 'A cute cartoon dog, white background');
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(path.join('output', 'animals')),
      { recursive: true },
    );
  });

  it('throws if DALL-E API returns a non-ok response', async () => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, statusText: 'Unauthorized' });
    await expect(generateImage('cat', 'animals', 'prompt')).rejects.toThrow('DALL-E');
  });

  it('returns the local file path of the saved PNG', async () => {
    const filePath = await generateImage('lion', 'animals', 'A cute cartoon lion');
    expect(filePath).toContain(path.join('output', 'animals', 'lion.png'));
  });
});
