---
status: accepted
---

# Single-user, local-first stack: Next.js + SQLite, no auth

This app is built for one person (the repo owner) with no accounts, permissions, or multi-tenancy — a deliberate scope cut, not an oversight; adding multi-user support later would mean introducing an identity model that doesn't exist today. We chose Next.js (TypeScript, API routes in the same codebase) over a separate frontend/backend split, and SQLite via `better-sqlite3` over a hosted database (e.g. Postgres), so the app runs with zero infrastructure setup — no server process, no accounts, no network dependency — while keeping a clear migration path to Postgres if it's ever deployed for multi-device or multi-user access.
