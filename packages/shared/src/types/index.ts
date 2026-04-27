export interface Lesson {
  id: string;
  title: string;
  category: LessonCategory;
  ageMin: number;
  ageMax: number;
  vocabularyItems: VocabularyItem[];
  createdAt: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation?: string;
  imageUrl: string;
  audioUrl: string;
  soundEffectUrl?: string;
  lessonId: string;
}

export interface UserProgress {
  sessionId: string;
  lessonId: string;
  correctCount: number;
  totalCount: number;
  completedAt?: string;
}

export interface ParentProfile {
  id: string;
  email: string;
  childProfiles: ChildProfile[];
}

export interface ChildProfile {
  id: string;
  nickname: string;
  ageYears: number;
}

export type LessonCategory =
  | 'animals'
  | 'colors'
  | 'family'
  | 'food'
  | 'numbers'
  | 'shapes'
  | 'transport'
  | 'body';
