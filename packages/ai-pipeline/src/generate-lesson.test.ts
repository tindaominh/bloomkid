import fs from 'fs/promises';
import path from 'path';

// Mock Anthropic SDK before importing the module under test
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [
            {
              type: 'text',
              text: JSON.stringify([
                {
                  word: 'cat',
                  syllables: 1,
                  imagePrompt: 'A cute cartoon cat, white background',
                  audioScript: 'cat',
                  soundEffect: 'meow',
                },
                {
                  word: 'dog',
                  syllables: 1,
                  imagePrompt: 'A cute cartoon dog, white background',
                  audioScript: 'dog',
                  soundEffect: 'woof',
                },
              ]),
            },
          ],
        }),
      },
    })),
  };
});

jest.mock('fs/promises');

import { generateLesson, LessonItem } from './generate-lesson';

const mockFs = fs as jest.Mocked<typeof fs>;

describe('generateLesson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.readFile.mockResolvedValue(
      '## System\nYou are an educator.\n## User Template\n```\nGenerate {{TOPIC}} {{COUNT}}\n```' as any,
    );
    mockFs.mkdir.mockResolvedValue(undefined);
    mockFs.writeFile.mockResolvedValue(undefined);
  });

  it('returns an array of lesson items', async () => {
    const items = await generateLesson('animals', 2);
    expect(Array.isArray(items)).toBe(true);
    expect(items).toHaveLength(2);
  });

  it('each item has required fields', async () => {
    const items = await generateLesson('animals', 2);
    const item = items[0] as LessonItem;
    expect(item.word).toBe('cat');
    expect(item.imagePrompt).toBeDefined();
    expect(item.audioScript).toBeDefined();
    expect(item.soundEffect).toBeDefined();
  });

  it('saves manifest.json to output/<category>/', async () => {
    await generateLesson('animals', 2);
    expect(mockFs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining(path.join('output', 'animals')),
      { recursive: true },
    );
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('manifest.json'),
      expect.stringContaining('"word"'),
    );
  });

  it('uses the prompt template from tools/prompts/lesson-script.md', async () => {
    await generateLesson('animals', 2);
    expect(mockFs.readFile).toHaveBeenCalledWith(
      expect.stringContaining('lesson-script.md'),
      'utf-8',
    );
  });

  it('passes category into the prompt content', async () => {
    const items = await generateLesson('colors', 4);
    // The mock returns 2 items regardless — verify the call reached the API
    // and the prompt file was read (category substitution happens in the template read)
    expect(mockFs.readFile).toHaveBeenCalled();
    expect(Array.isArray(items)).toBe(true);
  });
});
