# ADR-004: expo-file-system for Offline Asset Caching
Date: 2026-04-27
Status: Accepted

## Decision
Use `expo-file-system` to download and persist lesson JSON, images, and audio files to the device's local filesystem. On launch, attempt network fetch first; fall back to cached files if offline.

## Rationale
- AsyncStorage (the alternative) stores strings only — images and audio would need base64 encoding, bloating storage 33% and slowing decode.
- `expo-file-system` writes binary files directly, matching how `expo-av` and `Image` expect to consume them (local `file://` URIs).
- Cache-key pattern: `<lessonId>/<vocabularyItemId>/<word>.(png|mp3)` — deterministic, easy to invalidate per lesson.
- Fits the Kids Category UX requirement: no broken images or audio in airplane mode after first play.

## Trade-offs
- Local filesystem storage is limited (~100–200MB on most devices for app sandbox). At ~500KB audio + ~200KB image per item × 8 items × 6 categories = ~33MB max for Phase 1 — well within limits.
- Cache invalidation is manual: if S3 assets are regenerated, the old cached version stays until the user clears app data or the app explicitly re-downloads. Acceptable for Phase 1 — content rarely changes post-generation.
- Add a `cacheVersion` field to `Lesson` in a future phase to trigger re-downloads when content updates.
