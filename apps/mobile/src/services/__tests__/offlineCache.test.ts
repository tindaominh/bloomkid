jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///data/documents/',
  downloadAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
}));

import * as FileSystem from 'expo-file-system';
import { OfflineCache } from '../offlineCache';

const mockDownloadAsync = FileSystem.downloadAsync as jest.Mock;
const mockGetInfoAsync = FileSystem.getInfoAsync as jest.Mock;

describe('OfflineCache', () => {
  let cache: OfflineCache;

  beforeEach(() => {
    jest.clearAllMocks();
    (FileSystem.makeDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    cache = new OfflineCache();
  });

  it('downloads a remote URL to local filesystem', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: false });
    mockDownloadAsync.mockResolvedValue({ uri: 'file:///data/documents/bloomkid-cache/animals/cat.mp3' });
    const localUri = await cache.ensure('https://s3.example.com/animals/cat.mp3', 'animals/cat.mp3');
    expect(mockDownloadAsync).toHaveBeenCalledWith(
      'https://s3.example.com/animals/cat.mp3',
      expect.stringContaining('animals/cat.mp3'),
    );
    expect(localUri).toContain('cat.mp3');
  });

  it('returns the cached path if already downloaded', async () => {
    mockGetInfoAsync.mockResolvedValue({ exists: true, uri: 'file:///data/documents/bloomkid-cache/animals/cat.mp3' });
    const localUri = await cache.ensure('https://s3.example.com/animals/cat.mp3', 'animals/cat.mp3');
    expect(mockDownloadAsync).not.toHaveBeenCalled();
    expect(localUri).toContain('cat.mp3');
  });
});
