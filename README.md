# DeepCuts

## Project Description

DeepCuts is a web app for cataloging and sharing your vinyl collection. Sign in with Google, search Discogs to add records in seconds, and browse your collection from any device — including your phone at the record store.

The long-term vision is a Letterboxd-style community for vinyl collectors: clean, modern, and collection-first, using Discogs as a data source rather than competing with it as a marketplace.

Built with Django REST Framework and PostgreSQL for the backend and React for the frontend.

<br>

[Backend repo](https://github.com/chavierto/record-collection-backend)

<br>

## Running Locally

**Backend:**
```bash
cd backend
pipenv install
pipenv run python manage.py migrate
pipenv run python manage.py runserver 0.0.0.0:8000
```

Requires a `.env` file in `backend/` with:
```
SECRET_KEY=your-secret-key
MODE=dev
DATABASE_URL=postgresql://rc_user:records@localhost:5432/record_collection_be
CLERK_JWKS_URL=https://your-clerk-frontend-api.clerk.accounts.dev/.well-known/jwks.json
DISCOGS_TOKEN=your-discogs-token
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Requires a `.env.local` file in `frontend/` with:
```
VITE_DEV_URL=http://localhost:8000
VITE_PROD_URL=https://your-deployed-backend-url.com
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

<br>

## Wireframes

<img src='./resources/record-collection-main-wireframes.svg' alt='Home view' width='500'/>

<br>
<br>

## Component Hierarchy

<img src='./resources/record-collection-component-hierarchy.svg' alt='Component hierarchy' width='500'/>

<br>

## User Stories

### MVP

- _As a collector, I want to see a list of all the records in my collection so I can browse what I own._
- _As a collector, I want to click on a record to see all its information including artist, title, genre, label, release date, and cover art._
- _As a collector, I want to add a new record to my collection with full metadata so I have a complete catalog._
- _As a collector, I want to add new artists to the database so I can associate albums with them._
- _As a collector, I want to edit or delete a record I've already added so I can keep my data accurate._
- _As a collector, I want to see the full tracklist of an album in the record detail view so I have a complete picture of what I own._

### Silver Goals

- _As a collector, I want to search my collection by artist, title, or song name so I can find a specific record quickly._
- _As a collector, I want to sort my records by genre, label, or acquisition date so I can browse by category._
- _As a collector, I want to edit or delete artists so I can manage my artist database._

### Gold Goals

- _As a collector, I want to search Discogs and auto-fill an album's details so I don't have to type everything manually._
- _As a collector, I want to import my entire Discogs collection so I can migrate without re-entering everything._
- _As a user, I want to sign in with Google so I can access my collection from any device._
- _As a collector, I want to record the condition of my records (media and sleeve) so I have an accurate picture of what I own._
- _As a collector, I want to log pressing details (catalog number, country, original vs. reissue) to distinguish between copies._
- _As a collector, I want to record what I paid for a record._
- _As a collector, I want to browse an artist page showing all records by that artist in my collection._
- _As a collector, I want to toggle between a grid view and a dense list view when browsing._

### Deferred

- _As a collector, I want a public profile page where I can share my collection with others._
- _As a collector, I want to follow other collectors and see what they've been adding._

<br>

## Tech Stack

**Frontend:** React 18, React Router 5, Vite, Axios, @clerk/clerk-react

**Backend:** Django 6, Django REST Framework, PostgreSQL, PyJWT

**Auth:** Google OAuth via Clerk (live)

**External APIs:** Discogs (search, release, master, image proxy)

<br>

## Data Model

**Artist**
- `user_id` — Clerk user ID (scopes data per user)
- `artist` — name (case-insensitive unique per user)
- `photo_url` — optional
- `notes` — optional

**Album**
- `user_id` — Clerk user ID (scopes data per user)
- `title`
- `artist` — foreign key to Artist (PROTECT — cannot delete artist with albums)
- `release_date` — optional
- `acquired_date` — optional
- `genre` — optional
- `label` — optional
- `photo_url` — optional
- `notes` — optional

**Song**
- `title`
- `track` — track number
- `artist` — foreign key to Artist, SET_NULL (used for featured artists)
- `album` — foreign key to Album

<br>

## Roadmap

| Priority | Feature | Status |
|---|---|---|
| P0 | Edit and delete albums | Complete |
| P1 | Tracklist display and management | Complete |
| P1 | Search and sort | Complete |
| P1 | Edit and delete artists (UI) | Complete |
| P2 | Vite + React 18 migration | Complete |
| P2 | Mobile UX — bottom sheet modal, tap targets | Complete |
| P2 | Google OAuth / multi-user auth (Clerk) | Complete |
| P2 | Discogs search and auto-fill | Complete |
| P3 | Condition fields (media + sleeve) | Not started |
| P3 | Pressing details (catalog number, country, pressing) | Not started |
| P3 | Price paid field | Not started |
| P3 | List view toggle | Not started |
| P4 | Discogs collection bulk import | Not started |
| P5 | Public collection profiles | Not started |
| P5 | Social layer (follows, activity feed) | Not started |

<br>

## Deployment

- **Frontend:** Vercel — `https://deep-cuts.vercel.app`
- **Backend:** Railway — `https://deepcuts.up.railway.app`

Railway env vars required: `SECRET_KEY`, `MODE=production`, `DATABASE_URL` (linked from Postgres service), `CORS_ALLOWED_ORIGINS`, `CLERK_JWKS_URL`, `DISCOGS_TOKEN`

Migrations run automatically on startup via `Procfile`.

<br>

## Recent Improvements

UX polish and features shipped:

- **Deployed** — live at `https://deep-cuts.vercel.app` (Vercel + Railway + PostgreSQL)
- **Discogs tracklist import** — tracks auto-imported when adding a record via Discogs search; imported silently on save with no intermediate state exposed to the user
- **Tracklist sort fix** — natural sort (`localeCompare` with `numeric: true`) so track 10 sorts after 9, not after 1
- **Edit modal dismiss fix** — X and swipe-down now correctly close the modal from edit mode when no changes have been made; dirty state comparison now uses sorted song order to prevent false positives on albums with tracklists
- **Discogs date normalization** — handles Discogs `00` month/day components (e.g. `1969-08-00`) that Django would otherwise reject
- **Pre-deployment hardening** — CORS locked to allowed origins in production; image proxy URL validation; serializer querysets scoped per user; submit button disabled while pending; lazy loading on album covers
- **Google OAuth via Clerk** — full multi-user auth; JWT middleware scopes all data per user; landing page with sign-in flow; protected routes; user avatar + sign-out in navbar
- **Discogs search and auto-fill** — debounced search widget on the Add Record form; toggle between "Any edition" (master) and "Exact pressing" (release); auto-fills title, genre, label, release date, and cover art; auto-creates or matches artist; cover art proxied server-side
- **Date field UX** — iOS zoom fix on date inputs; clear (✕) button on release and acquired date fields in both add and edit views
- **Delete confirmation layout** — stacked vertically so long album titles don't squish the Cancel/Delete buttons on mobile
- **Mobile hover fix** — hover styles on record cards scoped to `@media (hover: hover)` so touch-scroll no longer leaves cards stuck in hover state
- **Landing page** — app name, tagline, sign-in CTA, privacy policy link
- **Privacy policy** — publicly accessible at `/privacy`, linked from landing page
- **Sort improvements** — default sort is Artist A→Z; "Default" renamed to "Date added" and moved to end of list
- **Vite + React 18 migration** — replaced Create React App with Vite; updated to React 18 `createRoot`
- **Bootstrap removal** — replaced React Bootstrap modal with custom `BottomSheet`; reduced bundle ~22KB
- **Artists management hub** — full CRUD at `/artists`; protected delete; album count per artist; full-width search
- **Tracklist search** — search matches song titles in addition to album title and artist
