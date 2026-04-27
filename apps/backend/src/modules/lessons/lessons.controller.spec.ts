import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

const mockService = {
  getCategories: jest.fn(),
  getItemsByCategory: jest.fn(),
};

describe('LessonsController', () => {
  let controller: LessonsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [{ provide: LessonsService, useValue: mockService }],
    }).compile();
    controller = module.get<LessonsController>(LessonsController);
  });

  it('GET /lessons/categories returns category list', async () => {
    mockService.getCategories.mockResolvedValue(['animals', 'colors']);
    const result = await controller.getCategories();
    expect(result).toEqual(['animals', 'colors']);
  });

  it('GET /lessons/:category returns items for that category', async () => {
    const items = [{ word: 'cat', category: 'animals' }];
    mockService.getItemsByCategory.mockResolvedValue(items);
    const result = await controller.getByCategory('animals');
    expect(result).toEqual(items);
    expect(mockService.getItemsByCategory).toHaveBeenCalledWith('animals');
  });
});
