# ADR 001: pnpm Workspaces Monorepo

**Date:** 2026-04-27  
**Status:** Accepted

## Decision
Use a pnpm workspaces monorepo with `apps/` and `packages/` directories.

## Rationale
- Single repo for mobile, backend, and AI pipeline keeps shared types in sync without a separate package publishing step.
- pnpm's strict `node_modules` layout prevents phantom dependency bugs.
- Cheaper CI than separate repos (one checkout, shared cache).

## Trade-offs
- Large surface area; contributors must understand the whole repo layout.
- Expo and NestJS have different build toolchains — scripts must use `--filter` to target the right workspace.
