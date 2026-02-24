# FinLogic Portal — Project Analysis

## Overview

**FinLogic Portal** (package name: `finlogic-portal`) is a Next.js 14 web application for FinLogic Consulting & Training. It showcases accounting, HR, tax services, and SERP system integration, with an admin panel for content and user management.

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework   | Next.js 14 (App Router)              |
| Language    | TypeScript                           |
| Styling     | TailwindCSS                          |
| Icons       | Lucide React                         |
| Backend/BaaS| Supabase (Auth + PostgreSQL)         |
| Analytics   | Vercel Analytics (optional)          |

## Current Architecture

- **Frontend**: React SPA with server-side rendering; default dev port **3000**.
- **Backend**: Supabase (hosted). The app uses:
  - **Supabase Auth** — login, registration, session (PKCE, localStorage).
  - **Supabase Postgres** — tables: `profiles`, `news`, `trainings`.
- **Environment**: App expects `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no other required env vars for core run).

## Database Usage

- **profiles** — user profiles (id, email, name, phone, company, role); linked to Supabase Auth.
- **news** — news articles (admin CRUD, public read).
- **trainings** — training courses (admin CRUD, public read).
- **Row Level Security (RLS)** is used; admin access is gated by `profiles.role = 'teacher'`.

## Migration Direction

Database is currently on **Supabase (cloud)**. The goal is to move to **local PostgreSQL** on the same server as the app. Recommended approach for minimal code change: run **Supabase self-hosted** (Docker) on the server, which keeps the same API (Auth + Postgres). Alternatively, the app can be adapted later to use a plain PostgreSQL instance with a compatible API layer.

## Key Files

- `lib/supabase.ts` — Supabase client and env validation.
- `contexts/AuthContext.tsx` — Auth state and profile loading.
- `lib/admin.ts` — CRUD for news, trainings, profiles.
- `lib/profile.ts` — Profile read/update.

For full server and environment requirements to run the app and local DB, see **TECHNICAL_REQUIREMENTS_NETWORK_TEAM.md**.
