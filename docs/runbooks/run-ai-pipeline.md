# Runbook: Run AI Content Pipeline

## Prerequisites
- AWS credentials configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- `.env` file in `packages/ai-pipeline/` with `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `OPENAI_API_KEY`, `S3_BUCKET`, `DATABASE_URL`

## Steps

### 1. Generate a new lesson set
```bash
pnpm --filter ai-pipeline generate -- --topic animals --count 10
```

### 2. Check generated assets in S3
```bash
aws s3 ls s3://<bucket>/lessons/ --recursive
```

### 3. Verify DB records
Connect to Supabase and confirm rows in `vocabulary_items` table have `image_url` and `audio_url` populated.

## Troubleshooting
- **Rate limit from ElevenLabs:** Add `--delay 2000` flag to slow down batch generation.
- **DALL-E content policy rejection:** Edit the prompt template in `tools/prompts/image-generation.md` to be more neutral.
