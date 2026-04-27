# Analyst Output — BloomKid Phase 1
Date: 2026-04-27
Status: Complete — ready for /ba

---

## Feature 1: AI-Powered Flashcards

### Problem
Children have no engaging, child-safe way to learn new English vocabulary words paired with consistent illustrations and native pronunciation.

### Users
- Primary: Child (age 2–5), no reading ability, touch-only
- Secondary: Parent (chooses category, observes)

### Functional Requirements
- FR1: Child selects a lesson category (Animals, Colors, Family, etc.) from the Home screen
- FR2: App displays flashcards one at a time — AI-generated illustration + word label
- FR3: Tapping the card plays the AI-generated pronunciation audio
- FR4: Child can swipe or tap a button to advance to the next card
- FR5: Cards are sourced from AI-generated content stored in S3 + DB

### Non-Functional Requirements
- NFR1: Images and audio must load within 1.5 seconds (CDN-served from S3)
- NFR2: All illustrations must be cartoon-style, child-safe, no text overlay
- NFR3: No child PII collected — session is anonymous
- NFR4: Offline fallback: cache last-played lesson for offline use

### Out of Scope
- Editable flashcard content by parents
- Multiple languages (English only, Phase 1)
- User accounts for children

### Open Questions
- [ ] How many cards per lesson? (suggestion: 6–12)
- [ ] Does the card auto-advance after audio plays, or wait for child to swipe?
- [ ] What happens when the last card is reached — loop, return to Home, or auto-start Quiz?
- [ ] Should card order be randomized or fixed?
- [ ] Is there a progress indicator (card 3 of 10)?

### BloomKid Checklist
- [x] Child-facing screen → no PII, session-based tracking only
- [x] Requires AI-generated content → depends on `packages/ai-pipeline/`
- [ ] Does not affect parental gate

---

## Feature 2: Interactive Soundscapes

### Problem
Static flashcards don't provide the immersive multi-sensory experience needed to hold a toddler's attention and reinforce word-sound associations.

### Users
- Primary: Child (age 2–5)

### Functional Requirements
- FR1: Each vocabulary item has a "sound effect" in addition to pronunciation (e.g., Lion → word audio + roar)
- FR2: When child taps the flashcard, pronunciation plays first, then sound effect
- FR3: Sound effects are stored as separate audio files in S3, keyed to the vocabulary item
- FR4: Audio playback is managed via `expo-av`, never overlapping two clips

### Non-Functional Requirements
- NFR1: Audio files must be < 500KB per clip
- NFR2: Total audio load time < 1 second on 4G connection
- NFR3: Volume respects device volume control — no forced loud sounds

### Out of Scope
- Animated visual scenes / interactive backgrounds (Phase 2)
- Child-triggered sound remixing
- Sound effects generated in real-time (pre-generated and stored in S3)

### Open Questions
- [ ] Is this a separate "Soundscape mode" or integrated into the existing Flashcard screen?
- [ ] What if a vocabulary item has no natural sound effect (e.g., "Blue", "Round")? → play pronunciation twice? ambient tone?
- [ ] Should pronunciation and sound effect play sequentially or simultaneously?

### BloomKid Checklist
- [x] Child-facing screen → no PII
- [x] Requires AI pipeline → `soundEffect` field in `VocabularyItem` + ElevenLabs or royalty-free audio
- [ ] Does not affect parental gate

---

## Feature 3: Active Recall Quizzes ("Touch & Find")

### Problem
Passive flashcard viewing doesn't build active recall — children need to retrieve words from memory to retain them.

### Users
- Primary: Child (age 2–5)
- Secondary: Parent (views results in dashboard)

### Functional Requirements
- FR1: Quiz presents a spoken prompt: "Where is the [word]?"
- FR2: Child is shown N illustrations as choices — must tap the correct one
- FR3: Correct tap gives positive feedback (animation + chime)
- FR4: Wrong tap gives gentle feedback (shake + try-again prompt) — no harsh sounds
- FR5: Quiz session tracks correct/total count, saved to DB by anonymous session ID
- FR6: Quiz draws items from the lesson the child just completed (same session)

### Non-Functional Requirements
- NFR1: No reading required — prompt is audio only
- NFR2: Touch targets must be large enough for toddler motor skills (minimum 88×88 pt)
- NFR3: Progress stored anonymously — no child name or identifier

### Out of Scope
- Timer per question (Phase 1 is untimed)
- Cross-lesson mixed quizzes
- Leaderboards or social features

### Open Questions
- [ ] How many choices per question? (2 for age 2–3, 3–4 for age 4–5?) or fixed?
- [ ] Maximum wrong attempts before the answer is revealed?
- [ ] How many questions per quiz session? (all items in lesson, or a subset of 5?)
- [ ] Is there a reward/celebration screen at the end of a perfect quiz?
- [ ] Who links the anonymous session ID to a child profile?

### BloomKid Checklist
- [x] Child-facing screen → session ID only, no PII
- [ ] No new AI pipeline dependency — reuses flashcard assets
- [ ] Does not affect parental gate

---

## Feature 4: Parental Insights Dashboard

### Problem
Parents have no visibility into what vocabulary their child is actively learning or how much they have retained.

### Users
- Primary: Parent (authenticated, behind parental gate)

### Functional Requirements
- FR1: Dashboard is locked behind a parental gate
- FR2: Parent sees count of new words learned this week
- FR3: Parent sees list of completed lessons with completion date
- FR4: Parent can tap any word to hear its pronunciation
- FR5: Dashboard data is linked to a child profile (parent-managed)

### Non-Functional Requirements
- NFR1: Parent account uses Supabase Auth (email only)
- NFR2: Child profiles store nickname and age range only — no photo, no full name, no DOB
- NFR3: Dashboard must work with zero data (empty state)
- NFR4: All parent data requests authenticated via JWT

### Out of Scope
- Detailed per-session analytics
- Push notifications to parents (Phase 2)
- Parent-configurable difficulty settings (Phase 2)
- Multiple child profiles per parent (Phase 2 — but DB schema must allow it)

### Open Questions
- [ ] What is the parental gate mechanism? (math problem / hold 3 seconds / purchase IAP?)
- [ ] Is parent account optional (guest mode) or required?
- [ ] What time periods to show? (today / this week / all-time)
- [ ] Does progress sync across devices?

### BloomKid Checklist
- [x] Parental gate required → compliance flag
- [ ] No AI pipeline dependency
- [x] Affects parental gate design → must meet Apple/Google Kids Category requirements

---

## Cross-Cutting Concerns

| Concern | Impact |
|---|---|
| Kids Category compliance | No 3rd-party ads, no external links, no social features |
| Anonymous sessions | Quiz + flashcard progress uses device UUID, never a child name |
| AI pipeline dependency | Features 1 & 2 require pipeline to run before launch |
| Offline caching | Last-played lesson must work offline |
| NestJS vs Fastify | Must decide before backend work starts (needs ADR) |
