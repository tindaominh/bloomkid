# ADR-003: S3 Public URLs for AI-Generated Assets
Date: 2026-04-27
Status: Accepted

## Decision
Store AI-generated images and audio as **publicly readable S3 objects** with stable URLs. The backend returns these URLs directly in API responses. The mobile app fetches assets directly from S3 — not proxied through the backend.

## Rationale
- Content is child-safe educational material with no PII — public access carries no privacy risk.
- Direct S3 fetch from mobile avoids Lambda cold-start latency on every image/audio load, keeping the ≤ 1.5s load-time NFR achievable.
- Presigned URLs expire and require a round-trip to the backend to refresh — unnecessary complexity for non-sensitive static content.
- S3 + CloudFront CDN can be added later for global edge caching with zero API changes (same URL pattern).

## Trade-offs
- Public bucket means anyone with a URL can access assets — acceptable for educational images/audio, not for any user data.
- Rule: **only AI-generated lesson assets go in this bucket**. User data (if any is ever added) must use a separate private bucket with presigned URLs.
- Bucket policy must block public `ListBucket` — only `GetObject` is public.
