import fs from 'fs/promises';

jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

const mockSend = jest.fn();
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
}));

const mockQuery = jest.fn();
jest.mock('pg', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    query: mockQuery,
    end: jest.fn().mockResolvedValue(undefined),
  })),
}));

import { uploadAssets, AssetManifestItem } from './upload-assets';

const MANIFEST: AssetManifestItem[] = [
  {
    word: 'cat',
    syllables: 1,
    imagePrompt: 'A cute cartoon cat',
    audioScript: 'cat',
    soundEffect: 'meow',
    localImagePath: 'output/animals/cat.png',
    localAudioPath: 'output/animals/cat.mp3',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockFs.readFile.mockResolvedValue(Buffer.from('fake-binary'));
  mockSend.mockResolvedValue({});
  mockQuery.mockResolvedValue({ rows: [] });
});

describe('uploadAssets', () => {
  it('uploads image to S3 with correct key', async () => {
    await uploadAssets('animals', MANIFEST);
    const { PutObjectCommand } = jest.requireMock('@aws-sdk/client-s3');
    const imageCall = PutObjectCommand.mock.calls.find((c: unknown[]) =>
      (c[0] as { Key: string }).Key.includes('.png'),
    );
    expect(imageCall).toBeDefined();
    expect((imageCall![0] as { Key: string }).Key).toContain('animals/cat.png');
  });

  it('uploads audio to S3 with correct key', async () => {
    await uploadAssets('animals', MANIFEST);
    const { PutObjectCommand } = jest.requireMock('@aws-sdk/client-s3');
    const audioCall = PutObjectCommand.mock.calls.find((c: unknown[]) =>
      (c[0] as { Key: string }).Key.includes('.mp3'),
    );
    expect(audioCall).toBeDefined();
    expect((audioCall![0] as { Key: string }).Key).toContain('animals/cat.mp3');
  });

  it('inserts lesson row into PostgreSQL', async () => {
    await uploadAssets('animals', MANIFEST);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      expect.arrayContaining(['cat', 'animals']),
    );
  });

  it('returns array of uploaded items with S3 URLs', async () => {
    const result = await uploadAssets('animals', MANIFEST);
    expect(result).toHaveLength(1);
    expect(result[0].imageUrl).toContain('cat.png');
    expect(result[0].audioUrl).toContain('cat.mp3');
  });
});
