# BloomKid Architecture

## Overview
BloomKid is a monorepo with three runtime concerns: mobile client, REST API backend, and an offline AI content-generation pipeline.

```
[Mobile App] ──HTTP──▶ [Backend API (Lambda)] ──SQL──▶ [PostgreSQL (Supabase)]
                              │
                              └──S3──▶ [AI Assets (images, audio)]

[AI Pipeline] ──▶ Claude API / ElevenLabs / DALL-E 3 ──▶ S3 + PostgreSQL
```

## Mobile (apps/mobile)
- Expo SDK with React Native + TypeScript
- Zustand for local state (lesson progress, settings)
- React Navigation for screen routing
- Audio playback via `expo-av`
- Assets (images, audio) fetched from S3 CDN URLs stored in backend responses

## Backend (apps/backend)
- NestJS deployed as AWS Lambda via Serverless Framework
- One NestJS module per domain: lessons, vocabulary, progress, users, ai-generation
- PostgreSQL via TypeORM; migrations in `src/database/migrations/`
- S3 presigned URLs returned to mobile for asset delivery

## AI Pipeline (packages/ai-pipeline)
Offline scripts (not a running service). Run manually or via CI to bulk-generate content:
1. `generate-lesson.ts` — Claude API produces lesson scripts + metadata JSON
2. `generate-audio.ts` — ElevenLabs converts text to MP3 narration
3. `generate-image.ts` — DALL-E 3 produces cartoon illustrations (PNG)
4. `upload-assets.ts` — Uploads audio + images to S3, writes URLs to DB

## Shared Types (packages/shared)
All domain types (`Lesson`, `VocabularyItem`, `UserProgress`, etc.) live here.
Both mobile and backend import from `@bloomkid/shared` to stay in sync.

## CI/CD
- GitHub Actions: lint + typecheck + test on every PR
- EAS Build: Expo managed workflow for iOS and Android binaries
- Backend deploys via `serverless deploy` in the deploy workflow
