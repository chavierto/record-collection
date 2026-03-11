# Record Collection

## Project Description

Record Collection is an app for cataloging and organizing your record collection. Users can input albums into the database and fill out their information, including artist name, album title, release date, tracklist and other related fields.

Once the records are in the database, the user can browse and retrieve them and their information in an intuitive, easy to use interface.

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
NODE_OPTIONS=--openssl-legacy-provider npm start
```

Requires a `.env.local` file in `frontend/` with:
```
REACT_APP_DEV_URL=http://localhost:8000
REACT_APP_PROD_URL=https://your-deployed-backend-url.com
```

> Note: `NODE_OPTIONS=--openssl-legacy-provider` is required due to an incompatibility between the current Node.js version and the webpack version used by react-scripts 3.x. Upgrading to react-scripts 5 or migrating to Vite would eliminate this.

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

- _As a collector, I want to search my collection by artist or title so I can find a specific record quickly._

- _As a collector, I want to sort my records by genre, label, or acquisition date so I can browse by category._

- _As a collector, I want to edit or delete artists so I can manage my artist database._

### Gold Goals

- _As a collector, I want to search Discogs and auto-fill an album's details so I don't have to type everything manually._

- _As a collector, I want to mark records as favorites so I can quickly access the ones I love most._

### Deferred

- _As a user, I want to sign in to the app so I can have a personalized inventory_ — deferred until multi-user support is a clear goal.

<br>

## Tech Stack

**Frontend:** React 16, React Router 5, React Bootstrap, Axios

**Backend:** Django, Django REST Framework, PostgreSQL

<br>

## Data Model

**Artist**
- `artist` — name
- `photo_url` — optional
- `notes` — optional

**Album**
- `title`
- `artist` — foreign key to Artist
- `release_date` — optional
- `acquired_date` — optional
- `genre` — optional
- `label` — optional
- `photo_url` — optional
- `notes` — optional

**Song**
- `title`
- `track` — track number
- `artist` — foreign key to Artist
- `album` — foreign key to Album
- `song_url` — optional

<br>

## Roadmap

| Priority | Feature | Status |
|---|---|---|
| P0 | Edit and delete albums | Not started |
| P1 | Tracklist display and management | Not started |
| P1 | Search and sort | Not started |
| P2 | Discogs API integration | Not started |
| P3 | Favorites / want list | Not started |
| P3 | Authentication / multi-user | Not started |
