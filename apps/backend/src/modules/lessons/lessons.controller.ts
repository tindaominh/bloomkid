import { Controller, Get, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { VocabularyItem } from './vocabulary-item.entity';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('categories')
  getCategories(): Promise<string[]> {
    return this.lessonsService.getCategories();
  }

  @Get(':category')
  getByCategory(@Param('category') category: string): Promise<VocabularyItem[]> {
    return this.lessonsService.getItemsByCategory(category);
  }
}
