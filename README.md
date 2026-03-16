# Record Collection

## Project Description

Record Collection is a web app for cataloging and sharing your vinyl collection. Sign in with Google, search Discogs to add records in seconds, and browse your collection from any device — including your phone at the record store.

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
pipenv run python manage.py runserver
```

Requires a `.env` file in `backend/` with:
```
SECRET_KEY=your-secret-key
MODE=dev
DATABASE_URL=postgresql://rc_user:records@localhost:5432/record_collection_be
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

**Frontend:** React 18, React Router 5, Vite, Axios

**Backend:** Django, Django REST Framework, PostgreSQL

**Auth:** Google OAuth via Clerk (planned)

<br>

## Data Model

**Artist**
- `artist` — name
- `photo_url` — optional
- `notes` — optional

**Album**
- `title`
- `artist` — foreign key to Artist (PROTECT — cannot delete artist with albums)
- `release_date` — optional
- `acquired_date` — optional
- `genre` — optional
- `label` — optional
- `catalog_number` — optional (planned)
- `country` — optional (planned)
- `pressing` — original / reissue (planned)
- `media_condition` — M / NM / VG+ / VG / G+ / G / F / P (planned)
- `sleeve_condition` — same scale (planned)
- `price_paid` — optional (planned)
- `photo_url` — optional; superseded by Discogs cover art once integrated
- `notes` — optional
- `discogs_id` — optional (planned)

**Song**
- `title`
- `track` — track number
- `artist` — foreign key to Artist, SET_NULL (used for featured artists)
- `album` — foreign key to Album
- `song_url` — optional

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
| P2 | Google OAuth / multi-user auth (Clerk) | Not started |
| P3 | Condition fields (media + sleeve) | Not started |
| P3 | Pressing details (catalog number, country, pressing) | Not started |
| P3 | Price paid field | Not started |
| P3 | Artist page | Not started |
| P3 | List view toggle | Not started |
| P4 | Discogs search-and-import | Not started |
| P4 | Discogs collection bulk import | Not started |
| P5 | Public collection profiles | Not started |
| P5 | Social layer (follows, activity feed) | Not started |

<br>

## Recent Improvements

UX polish shipped outside the main roadmap:

- **Vite + React 18 migration** — replaced Create React App with Vite; updated to React 18 `createRoot`; switched env vars to `VITE_*`; eliminated `NODE_OPTIONS` workaround
- **Bootstrap removal** — replaced React Bootstrap modal with a custom `BottomSheet` component; removed Bootstrap CDN; reduced bundle ~22KB
- **BottomSheet component** — slides up from the bottom on mobile, centered modal on desktop; portal-based (renders outside `.App`); body scroll lock; animated open/close
- **Artists management hub** — full create, edit, delete at `/artists`; protected delete (can't remove artist with albums); album count shown per artist; full-width search with Escape to clear
- **Tracklist search** — search now matches song titles in addition to album title and artist, using data already in state (no extra API calls)
- **Escape key handling** — Escape clears the search bar; in the artist combobox it is two-stage (clears typed text first, then closes dropdown); in the record sheet it does nothing if the form is dirty, preventing accidental loss of unsaved changes including track reordering
- **Artist exists notice** — when the inline new artist form finds a matching existing artist, it selects them and shows a brief confirmation ("X already exists — selected") rather than silently filling the field or showing an error

---

## Design Notes

**Featured artists on tracks**
The album artist remains a single FK — the primary credited artist on the cover (e.g. "Radiohead" for a Radiohead album, even if individual tracks have guests). Individual songs already have an `artist` field in the data model for this purpose. Proposed UI: an optional `+ featured artist` link below the track title in the inline track editor, which reveals an ArtistCombobox when clicked. Keeps the form uncluttered for the common case. Featured artist displays as "ft. [name]" in the tracklist read view only when set, and only for songs where a featured artist has been added.

**Photo URL field**
Album cover art will be populated automatically via the Discogs API once integrated — the `photo_url` field on albums will be deprecated in favour of Discogs-sourced art. The field on artists remains as a manual option.

**Monetisation model**
Free tier with a paid Pro tier (stats, advanced filters, collection analytics) modelled on Letterboxd. The collector demographic skews toward obsession — power users willing to pay for deeper insight into their own data.
