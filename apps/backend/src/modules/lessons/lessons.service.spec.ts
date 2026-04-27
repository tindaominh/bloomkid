import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { VocabularyItem } from './vocabulary-item.entity';

const mockRepo = {
  find: jest.fn(),
  findBy: jest.fn(),
};

describe('LessonsService', () => {
  let service: LessonsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: getRepositoryToken(VocabularyItem), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<LessonsService>(LessonsService);
  });

  it('getCategories returns distinct category list', async () => {
    mockRepo.find.mockResolvedValue([
      { category: 'animals' },
      { category: 'colors' },
    ]);
    const cats = await service.getCategories();
    expect(cats).toEqual(['animals', 'colors']);
  });

  it('getItemsByCategory returns vocabulary items for a category', async () => {
    const items = [
      { word: 'cat', category: 'animals', imageUrl: 'https://s3/cat.png', audioUrl: 'https://s3/cat.mp3' },
    ];
    mockRepo.findBy.mockResolvedValue(items);
    const result = await service.getItemsByCategory('animals');
    expect(result).toEqual(items);
    expect(mockRepo.findBy).toHaveBeenCalledWith({ category: 'animals' });
  });

  it('getItemsByCategory returns empty array when no items exist', async () => {
    mockRepo.findBy.mockResolvedValue([]);
    const result = await service.getItemsByCategory('unknown');
    expect(result).toEqual([]);
  });
});
