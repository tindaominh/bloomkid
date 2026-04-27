# Backend Context

NestJS deployed to AWS Lambda via Serverless Framework. PostgreSQL via TypeORM + Supabase.

## Module Structure
Each domain module in `src/modules/<name>/` contains:
- `<name>.module.ts`
- `<name>.controller.ts`
- `<name>.service.ts`
- `<name>.entity.ts`
- `dto/`  (request/response DTOs)

## Modules
- `lessons`       Lesson metadata, categories, ordering
- `vocabulary`    VocabularyItem with image_url, audio_url, word, translation
- `progress`      UserProgress records per child profile
- `users`         Parent accounts only (no child PII)
- `ai-generation` Webhook endpoint for triggering pipeline jobs

## Rules
- All endpoints return camelCase JSON
- Auth via Supabase JWT (parent-only routes)
- No child PII in any DB table — progress tracked by anonymous session ID
- DB migrations managed via TypeORM CLI, files in `src/database/migrations/`
