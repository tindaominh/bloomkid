import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vocabulary_items')
export class VocabularyItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  word!: string;

  @Column()
  category!: string;

  @Column({ default: 1 })
  syllables!: number;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @Column({ name: 'audio_url' })
  audioUrl!: string;

  @Column({ name: 'image_prompt' })
  imagePrompt!: string;

  @Column({ name: 'audio_script' })
  audioScript!: string;

  @Column({ name: 'sound_effect' })
  soundEffect!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
