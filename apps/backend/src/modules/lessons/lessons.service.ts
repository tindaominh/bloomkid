import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabularyItem } from './vocabulary-item.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(VocabularyItem)
    private readonly repo: Repository<VocabularyItem>,
  ) {}

  async getCategories(): Promise<string[]> {
    const items = await this.repo.find({ select: { category: true } });
    return [...new Set(items.map((i) => i.category))];
  }

  async getItemsByCategory(category: string): Promise<VocabularyItem[]> {
    return this.repo.findBy({ category });
  }
}
