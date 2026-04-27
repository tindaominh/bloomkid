# Generate Content Skill

Use this skill when generating AI lesson content for BloomKid.

## Steps
1. Load the lesson topic from `tools/prompts/lesson-script.md`
2. Call `packages/ai-pipeline/src/generate-lesson.ts` with topic + count
3. Review generated metadata JSON for age-appropriateness (words ≤ 2 syllables for 2-3yr, ≤ 3 for 4-5yr)
4. Run `generate-audio.ts` for each vocabulary item
5. Run `generate-image.ts` for each vocabulary item
6. Run `upload-assets.ts` to push to S3 and write to DB
7. Confirm DB rows with `tools/scripts/verify-content.ts`

## Quality Gates
- All audio files must be < 500KB
- All images must be 512×512 PNG, cartoon style, no text overlay
- Lesson must contain 6–12 vocabulary items
