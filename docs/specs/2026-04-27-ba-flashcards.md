# BA Output — AI-Powered Flashcards
Date: 2026-04-27
Status: Complete — ready for /pm
Source: docs/specs/2026-04-27-analyst-phase1.md (Feature 1)

---

## Assumptions
- 8 cards per lesson
- Child controls pace — card does NOT auto-advance after audio
- Last card → celebration screen → "Play Again" or "Start Quiz"
- First play: fixed order; repeat play: randomized
- Progress shown as dots (not numbers)

---

## User Stories: AI-Powered Flashcards

### US-01: Select a lesson category [Must Have]
As a **child**, I want to see big colorful category tiles on the Home screen so that I can pick what I want to learn about.

**Acceptance Criteria:**
- Given the child opens the app
- When the Home screen loads
- Then they see a grid of category tiles (Animals, Colors, Family, Food, Numbers, Shapes)
- And each tile shows a large illustration only (no text label)
- And each tile has a minimum touch target of 88×88 pt
- And tapping a tile navigates to the Flashcard screen for that category

---

### US-02: View a flashcard [Must Have]
As a **child**, I want to see a full-screen illustration of the word so that the picture captures my attention.

**Acceptance Criteria:**
- Given the child has selected a category
- When the Flashcard screen loads
- Then the first card is displayed with a full-screen cartoon illustration
- And a word label appears below the illustration
- And the illustration loads within 1.5 seconds
- And if the image fails to load, a placeholder cartoon is shown (no broken image icon)

---

### US-03: Hear word pronunciation [Must Have]
As a **child**, I want to hear the word spoken when I tap the card so that I learn how it sounds.

**Acceptance Criteria:**
- Given a flashcard is displayed
- When the child taps anywhere on the card
- Then the AI-generated pronunciation audio plays immediately (< 300ms delay)
- And tapping again while audio is playing restarts the audio from the beginning
- And the audio volume respects the device volume setting

---

### US-04: Navigate to the next card [Must Have]
As a **child**, I want to swipe or tap an arrow to move to the next card so that I can go through the whole lesson.

**Acceptance Criteria:**
- Given a flashcard is displayed and it is not the last card
- When the child swipes left OR taps the next arrow
- Then the next flashcard animates in from the right
- And the audio for the new card does NOT auto-play
- Given it is the first card
- When the child swipes right
- Then nothing happens (no wrapping back)

---

### US-05: See progress through the lesson [Should Have]
As a **child**, I want to see how many cards are left so that I feel a sense of progress.

**Acceptance Criteria:**
- Given the Flashcard screen is open
- When any card is displayed
- Then a row of dots is shown at the bottom — filled dot for current card, empty for remaining
- And the dots update as the child advances
- And the row shows exactly 8 dots (one per card)

---

### US-06: Lesson completion celebration [Should Have]
As a **child**, I want to see something exciting when I finish all the cards so that I feel rewarded.

**Acceptance Criteria:**
- Given the child is on the last card
- When they swipe left or tap next
- Then a celebration screen appears with animation (confetti or stars)
- And a cheerful audio clip plays automatically
- And two large buttons appear: "Play Again" and "Quiz Time"
- And a "Home" icon is visible

---

### US-07: Use flashcards offline [Should Have]
As a **child** in a low-signal area, I want the app to still work so that I'm not stuck with a broken screen.

**Acceptance Criteria:**
- Given the child has previously completed a lesson while online
- When they open that lesson with no internet connection
- Then the cached images and audio play normally
- And no error message is shown
- Given no lesson has ever been cached
- When the child opens the app offline
- Then a friendly "no connection" illustration is shown with a retry button

---

### US-08: Randomized card order on replay [Could Have]
As a **child** replaying a lesson, I want the cards in a different order so that the experience feels fresh.

**Acceptance Criteria:**
- Given the child taps "Play Again" from the celebration screen
- When the lesson reloads
- Then the card order is shuffled from the previous play order
- And the same 8 cards are still shown

---

### US-09: AI pipeline generates lesson assets [Must Have — System]
As the **system**, it needs pre-generated assets in S3 + DB before any flashcard can be shown.

**Acceptance Criteria:**
- Given `packages/ai-pipeline/` is run for a category
- When the pipeline completes
- Then 8 `VocabularyItem` rows exist in DB with `word`, `imageUrl`, `audioUrl` populated
- And each image is a 512×512 PNG accessible via S3 URL
- And each audio file is an MP3 < 500KB accessible via S3 URL
- And the `Lesson` row for the category has `vocabularyItems` count = 8

---

## Priority Summary

| Story | Priority |
|---|---|
| US-01 Category selection | Must Have |
| US-02 View flashcard | Must Have |
| US-03 Hear pronunciation | Must Have |
| US-04 Navigate cards | Must Have |
| US-05 Progress dots | Should Have |
| US-06 Celebration screen | Should Have |
| US-07 Offline support | Should Have |
| US-08 Randomized replay | Could Have |
| US-09 AI pipeline (system) | Must Have |
