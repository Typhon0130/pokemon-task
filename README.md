# Mini Pokédex

Angular SPA for browsing Pokémon (PokéAPI GraphQL) and building teams (local mock GraphQL).

## Setup

```bash
npm install
```

### Mock teams API

```bash
npm run mock:api
```

Runs `json-graphql-server` on [http://127.0.0.1:4000](http://127.0.0.1:4000). Keep this terminal open while using Teams.

### App

```bash
npm start
```

Opens on [http://127.0.0.1:4200](http://127.0.0.1:4200).

### Tests (Jest)

Dev deps: `jest`, `jest-preset-angular`, `jest-environment-jsdom`, `@types/jest`, `ts-node`.

```bash
npm test
```

### Docker (runtime parity)

For a shared local stack (built Angular app behind nginx + mock GraphQL):

```bash
docker compose up --build
```

- App: [http://127.0.0.1:4200](http://127.0.0.1:4200)
- Mock API: [http://127.0.0.1:4000](http://127.0.0.1:4000)

## Architecture

- `pokedex/` — PokéAPI GraphQL (`https://graphql.pokeapi.co/v1beta2`), `PokemonStore` + selectors, table + detail panel + radar chart
- `teams/` — local GraphQL mutations, `TeamStore` with optimistic create/delete, reactive team form
- `core/graphql` — shared HTTP GraphQL client
- `common/` — toast, skeleton, type badges, constants

State for lists lives in BehaviorSubject stores; UI flags use signals. Search uses `debounceTime(300)` → `distinctUntilChanged` → `switchMap`.

## With more time

- Virtual scroll for the full national dex
- Stronger typing around GraphQL documents
- Persist draft team form state
- Team workflow: Node version pin (`.nvmrc` / `engines`), `.env.example` for GraphQL URLs, CONTRIBUTING.md, PR checks on `main`
- CI first: pipeline with `npm ci` → lint → test → build, npm cache, optional Playwright/Cypress smoke (Pokédex load + team create)
- Keep Docker Compose for parity (`app` + `mock-api`); not a replacement for local `ng serve` during UI work
- Later scale: real teams backend (DB + auth), API gateway / caching if PokéAPI rate limits hurt, CDN for sprites
