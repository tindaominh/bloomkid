# Sprint Plan: AI-Powered Flashcards
Date: 2026-04-27
Status: Complete — ready for /techlead
Source: docs/specs/2026-04-27-ba-flashcards.md

---

## Technical Layers Affected

| Layer | Work needed |
|---|---|
| `packages/shared/` | Confirm Lesson, VocabularyItem, LessonCategory types |
| `packages/ai-pipeline/` | 4 generation stages: lesson → audio → image → upload |
| `apps/backend/` | DB migration + LessonsModule (entity, service, controller) |
| `apps/mobile/` | AudioService, HomeScreen, FlashcardScreen, CelebrationScreen, offline cache |

---

## Tasks

### T-01: Confirm + extend shared types [S]
**Files:** `packages/shared/src/types/index.ts`
**Depends on:** none
Verify Lesson, VocabularyItem, LessonCategory cover all required fields.

### T-02: AI pipeline — generate-lesson.ts [M]
**Files:** `packages/ai-pipeline/src/generate-lesson.ts`
**Depends on:** T-01
Claude API call using tools/prompts/lesson-script.md. Outputs output/<category>/manifest.json with 8 vocabulary items.

### T-03: AI pipeline — generate-audio.ts [M]
**Files:** `packages/ai-pipeline/src/generate-audio.ts`
**Depends on:** T-02
ElevenLabs TTS per word. Saves MP3 to output/<category>/<word>.mp3.

### T-04: AI pipeline — generate-image.ts [M]
**Files:** `packages/ai-pipeline/src/generate-image.ts`
**Depends on:** T-02
DALL-E 3 per vocabulary item. Saves PNG to output/<category>/<word>.png.

### T-05: AI pipeline — upload-assets.ts [M]
**Files:** `packages/ai-pipeline/src/upload-assets.ts`
**Depends on:** T-03, T-04
Upload images + audio to S3. Write VocabularyItem + Lesson rows to DB.

### T-06: DB migration — lessons + vocabulary_items [M]
**Files:** `apps/backend/src/database/migrations/<timestamp>-create-lessons.ts`
**Depends on:** T-01
Create lessons and vocabulary_items tables with UUID PKs and FK constraint.

### T-07: LessonsModule — entity + service [M]
**Files:**
- `apps/backend/src/modules/lessons/lesson.entity.ts`
- `apps/backend/src/modules/lessons/vocabulary-item.entity.ts`
- `apps/backend/src/modules/lessons/lessons.service.ts`
- `apps/backend/src/modules/lessons/lessons.module.ts`
**Depends on:** T-06
TypeORM entities + service with findCategories() and findByCategory() methods.

### T-08: LessonsController — GET /lessons/categories + GET /lessons/:category [S]
**Files:** `apps/backend/src/modules/lessons/lessons.controller.ts`
**Depends on:** T-07
Two REST endpoints returning categories list and full lesson with vocabulary items.

### T-09: AudioService (mobile) [S]
**Files:** `apps/mobile/src/services/audio.ts`
**Depends on:** none
expo-av wrapper. One active sound at a time. Restart on re-tap.

### T-10: HomeScreen — category grid [M]
**Files:** `apps/mobile/src/screens/HomeScreen.tsx`
**Depends on:** T-08, T-09
Fetches /lessons/categories. 2-column FlatList of CategoryTile components. Touch target ≥ 88×88 pt.

### T-11a: FlashcardScreen — display + audio tap [M]
**Files:**
- `apps/mobile/src/screens/FlashcardScreen.tsx`
- `apps/mobile/src/components/FlashCard/FlashCard.tsx`
**Depends on:** T-08, T-09
Full-screen illustration + word label. Tap → play audio. Image fallback placeholder.

### T-11b: FlashcardScreen — swipe navigation [M]
**Files:** `apps/mobile/src/screens/FlashcardScreen.tsx`
**Depends on:** T-11a
Left swipe → next card (animated). Right swipe on first card → no-op. Audio does NOT auto-play on card change.

### T-12: ProgressDots component [S]
**Files:** `apps/mobile/src/components/ProgressDots/ProgressDots.tsx`
**Depends on:** T-11a
Row of 8 dots. Filled = current card, empty = remaining.

### T-13: CelebrationScreen [M]
**Files:** `apps/mobile/src/screens/CelebrationScreen.tsx`
**Depends on:** T-11b
Confetti animation + cheer audio. Buttons: "Play Again" + "Quiz Time". Home icon.

### T-14: Offline cache [M]
**Files:** `apps/mobile/src/services/storage.ts`
**Depends on:** T-11a
expo-file-system cache for lesson JSON + assets. Network-first, fallback to cache. Empty-state screen when nothing cached.

### T-15: Randomized replay [S]
**Files:** `apps/mobile/src/screens/FlashcardScreen.tsx`
**Depends on:** T-13
Fisher-Yates shuffle on vocabularyItems when isReplay prop is true.

---

## Dependency Tree

```
T-01 (types)
 ├── T-02 → T-03 → T-05 (AI pipeline)
 ├── T-04 → T-05
 └── T-06 (DB migration)
      └── T-07 (service)
           └── T-08 (controller)
                ├── T-10 (HomeScreen)
                └── T-11a (FlashcardScreen core)
                     ├── T-11b (swipe) → T-13 (celebration) → T-15 (shuffle)
                     └── T-12 (dots)
T-09 (AudioService) → T-10, T-11a
T-14 (offline) → T-11a
```

## Effort Summary

| Size | Tasks | Est. time |
|---|---|---|
| S (< 2h) | T-01, T-08, T-09, T-12, T-15 | ~8h |
| M (2–4h) | T-02, T-03, T-04, T-05, T-06, T-07, T-11a, T-11b, T-13, T-14 | ~30h |
| **Total** | 15 tasks | **~4–5 days** |
