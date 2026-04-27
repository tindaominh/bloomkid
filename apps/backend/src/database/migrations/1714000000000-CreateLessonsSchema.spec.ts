import { CreateLessonsSchema1714000000000 } from './1714000000000-CreateLessonsSchema';

describe('CreateLessonsSchema migration', () => {
  it('has an up method', () => {
    const migration = new CreateLessonsSchema1714000000000();
    expect(typeof migration.up).toBe('function');
  });

  it('has a down method', () => {
    const migration = new CreateLessonsSchema1714000000000();
    expect(typeof migration.down).toBe('function');
  });

  it('up creates vocabulary_items table', async () => {
    const executed: string[] = [];
    const queryRunner = { query: jest.fn((sql: string) => { executed.push(sql); return Promise.resolve(); }) };
    const migration = new CreateLessonsSchema1714000000000();
    await migration.up(queryRunner as never);
    const combined = executed.join('\n');
    expect(combined).toContain('vocabulary_items');
    expect(combined).toContain('CREATE TABLE');
  });

  it('up creates lessons table', async () => {
    const executed: string[] = [];
    const queryRunner = { query: jest.fn((sql: string) => { executed.push(sql); return Promise.resolve(); }) };
    const migration = new CreateLessonsSchema1714000000000();
    await migration.up(queryRunner as never);
    const combined = executed.join('\n');
    expect(combined).toContain('lessons');
  });

  it('down drops created tables', async () => {
    const executed: string[] = [];
    const queryRunner = { query: jest.fn((sql: string) => { executed.push(sql); return Promise.resolve(); }) };
    const migration = new CreateLessonsSchema1714000000000();
    await migration.down(queryRunner as never);
    const combined = executed.join('\n');
    expect(combined).toContain('DROP TABLE');
  });
});
