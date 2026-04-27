# ADR-002: NestJS as Backend Framework
Date: 2026-04-27
Status: Accepted

## Decision
Use NestJS (not Fastify standalone) as the backend framework for `apps/backend/`.

## Rationale
- The tech stack brief listed "NestJS or Fastify" — this ADR resolves the ambiguity.
- NestJS provides TypeORM integration, dependency injection, and feature-module scaffolding out of the box, all of which the sprint plan relies on (LessonsModule, entities, `@InjectRepository`).
- NestJS compiles to a standard Node.js app and deploys to Lambda via `aws-serverless-express` with minimal shim code.
- The team is already writing NestJS-style decorators in T-07 and T-08 — changing to Fastify would require a full rewrite of those tasks.

## Trade-offs
- NestJS cold-start on Lambda is ~300–500ms heavier than a bare Fastify handler due to the DI container initialization.
- Mitigation: use Lambda Provisioned Concurrency for the `/lessons` route (most-hit endpoint) once traffic warrants it.
- NestJS abstractions add boilerplate (module/controller/service trinity per feature). Acceptable for a growing codebase — worse for a one-file prototype.
