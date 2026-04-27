# ADR-005: DALL-E 3 for Illustration Generation
Date: 2026-04-27
Status: Accepted

## Decision
Use DALL-E 3 (via OpenAI API) for generating vocabulary item illustrations. Midjourney is not used in Phase 1.

## Rationale
- DALL-E 3 has a fully programmable REST API — no Discord bot interaction required. The AI pipeline (T-04) runs as a Node.js script and needs a stable, automatable endpoint.
- Midjourney has no official public API as of 2026-04. Third-party wrappers are fragile and violate Midjourney ToS for automated use.
- DALL-E 3 supports detailed text prompts that can specify "cartoon style, child-safe, single object, white background" reliably — matching the image quality NFR.
- OpenAI billing is per-image (~$0.04/image at standard quality) — predictable cost for bulk generation.

## Trade-offs
- DALL-E 3 art style is less painterly than Midjourney v6. For cartoon-style children's flashcards, this difference is acceptable.
- Consistency across regenerations: DALL-E 3 does not support a "seed" parameter for deterministic output. If an image is regenerated, it may look different. Mitigation: treat generated images as final and never regenerate unless flagged by a human reviewer.
- Revisit Midjourney if they launch an official API with automation support in Phase 2.
