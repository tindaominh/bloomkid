# BloomKid — Claude Context

## Project
Multi-sensory English learning app for toddlers/preschoolers (Ages 2–5). AI-generated flashcards, soundscapes, quizzes, and parental insights.

## Monorepo Layout
```
apps/mobile/      React Native + Expo (TypeScript) — iOS & Android
apps/backend/     NestJS on AWS Lambda (Serverless) — REST API
packages/shared/  Shared TypeScript types and constants
packages/ai-pipeline/  AI content generation scripts (Claude, ElevenLabs, DALL-E)
tools/scripts/    DB migrations, seed data, utility scripts
tools/prompts/    Reusable AI prompt templates
docs/             Architecture decisions and runbooks
.claude/          Claude Code settings, hooks, and local skills
```

## Tech Stack
- **Mobile:** React Native, Expo SDK, TypeScript, Zustand, React Navigation
- **Backend:** NestJS, AWS Lambda (Serverless Framework), PostgreSQL (Supabase), TypeORM
- **Storage:** AWS S3 (AI-generated images & audio)
- **AI:** Claude API (lesson orchestration), ElevenLabs (TTS), DALL-E 3 (illustrations)
- **CI/CD:** GitHub Actions + EAS (Expo Application Services)
- **Package manager:** pnpm workspaces

## Key Conventions
- All TypeScript — strict mode enabled
- Mobile screens live in `apps/mobile/src/screens/`, one file per screen
- Backend modules follow NestJS feature-module pattern (controller + service + entity per folder)
- Shared types imported from `@bloomkid/shared` — never duplicate type definitions
- AI-generated assets uploaded to S3 by `packages/ai-pipeline/` scripts, URLs stored in DB
- COPPA compliant — no 3rd-party analytics or ads, no PII collected from children

## Compliance Notes
- Apple Kids Category + Google Families Program requirements must be met before store submission
- No external links, no social features, no in-app purchases targeting children
- Parental gate required before any parent-facing screens

## Common Commands
```bash
pnpm install              # Install all workspace deps
pnpm --filter mobile dev  # Start Expo dev server
pnpm --filter backend dev # Start NestJS locally
pnpm --filter ai-pipeline generate  # Run AI content generation
```
