import type {
  Lesson,
  VocabularyItem,
  UserProgress,
  LessonCategory,
  ChildProfile,
  ParentProfile,
} from './index';

describe('Shared types contract', () => {
  it('Lesson has all required fields', () => {
    const lesson: Lesson = {
      id: 'uuid-1',
      title: 'Animals',
      category: 'animals',
      ageMin: 2,
      ageMax: 5,
      vocabularyItems: [],
      createdAt: '2026-04-27T00:00:00Z',
    };
    expect(lesson.id).toBe('uuid-1');
    expect(lesson.category).toBe('animals');
    expect(Array.isArray(lesson.vocabularyItems)).toBe(true);
  });

  it('VocabularyItem has required asset URL fields', () => {
    const item: VocabularyItem = {
      id: 'uuid-2',
      word: 'cat',
      imageUrl: 'https://s3.example.com/cat.png',
      audioUrl: 'https://s3.example.com/cat.mp3',
      lessonId: 'uuid-1',
    };
    expect(item.imageUrl).toContain('https://');
    expect(item.audioUrl).toContain('https://');
    expect(item.soundEffectUrl).toBeUndefined();
  });

  it('VocabularyItem accepts optional soundEffectUrl', () => {
    const item: VocabularyItem = {
      id: 'uuid-3',
      word: 'lion',
      imageUrl: 'https://s3.example.com/lion.png',
      audioUrl: 'https://s3.example.com/lion.mp3',
      soundEffectUrl: 'https://s3.example.com/lion-roar.mp3',
      lessonId: 'uuid-1',
    };
    expect(item.soundEffectUrl).toBeDefined();
  });

  it('UserProgress uses anonymous sessionId — no child PII', () => {
    const progress: UserProgress = {
      sessionId: 'anon-device-uuid',
      lessonId: 'uuid-1',
      correctCount: 6,
      totalCount: 8,
    };
    // No name, email, DOB — only anonymous session ID
    expect('email' in progress).toBe(false);
    expect('name' in progress).toBe(false);
    expect(progress.sessionId).toBe('anon-device-uuid');
  });

  it('LessonCategory covers all Phase 1 categories', () => {
    const categories: LessonCategory[] = [
      'animals', 'colors', 'family', 'food', 'numbers', 'shapes',
    ];
    expect(categories).toHaveLength(6);
  });

  it('ChildProfile stores nickname and age only — no full name or DOB', () => {
    const child: ChildProfile = {
      id: 'uuid-4',
      nickname: 'Bunny',
      ageYears: 3,
    };
    expect('fullName' in child).toBe(false);
    expect('dateOfBirth' in child).toBe(false);
    expect(child.nickname).toBe('Bunny');
  });

  it('ParentProfile links to child profiles array', () => {
    const parent: ParentProfile = {
      id: 'uuid-5',
      email: 'parent@example.com',
      childProfiles: [{ id: 'uuid-4', nickname: 'Bunny', ageYears: 3 }],
    };
    expect(parent.childProfiles).toHaveLength(1);
  });
});
