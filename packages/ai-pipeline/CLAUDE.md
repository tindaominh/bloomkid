# AI Pipeline Context

Offline content generation scripts. Not a running service — executed manually or via CI.

## Pipeline Stages (run in order)
1. `generate-lesson.ts`  — Claude API → lesson metadata JSON
2. `generate-audio.ts`   — ElevenLabs → MP3 per vocabulary word
3. `generate-image.ts`   — DALL-E 3 → 512×512 PNG per vocabulary word
4. `upload-assets.ts`    — S3 upload + write URLs to PostgreSQL

## Environment Variables Required
```
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
OPENAI_API_KEY=
S3_BUCKET=
DATABASE_URL=
AWS_REGION=ap-southeast-1
```

## Prompt Templates
Reusable prompt templates live in `../../tools/prompts/`. Always load prompts from files, never hardcode them.

## Output Format
Each generated lesson produces a JSON file in `./output/<topic>/manifest.json` before uploading.
This file is the source of truth — if upload fails, re-run `upload-assets.ts` with the existing manifest.
