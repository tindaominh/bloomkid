import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLessonsSchema1714000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category    VARCHAR(100) NOT NULL,
        word_count  INT NOT NULL DEFAULT 0,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vocabulary_items (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        word         VARCHAR(100) NOT NULL,
        category     VARCHAR(100) NOT NULL,
        syllables    INT NOT NULL DEFAULT 1,
        image_url    TEXT NOT NULL,
        audio_url    TEXT NOT NULL,
        image_prompt TEXT NOT NULL,
        audio_script TEXT NOT NULL,
        sound_effect VARCHAR(100) NOT NULL,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (word, category)
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vocabulary_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS lessons`);
  }
}
