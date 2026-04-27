import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyItem } from './vocabulary-item.entity';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VocabularyItem])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
