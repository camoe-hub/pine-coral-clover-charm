# RivetCare

An independent checklist for Airstream owners. Not affiliated with Airstream, Inc.
Records stay on the phone. This copy is 2026.11.98.

## Setup

You need Node.js 22 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

`npm run dev` also reads `.grok/app-env.json` when that file is present. The copy in this tree sets `VITE_AUTH_ENABLED` to `false`. Leave it that way unless you mean to turn accounts on.

```bash
npm test
npm run typecheck
npm run build
npm run preview
```

The production preview listens on port 8081.

## Environment

Copy `.env.example`. Every secret is a placeholder. Do not put a real key in the repo.

| Name | When you need it |
|---|---|
| `VITE_AUTH_ENABLED` | `false` keeps sign-in off. `true` turns it on. |
| `GROK_AUTH_CLIENT_ID` | Only if accounts are on. |
| `GROK_AUTH_CLIENT_SECRET` | Only if accounts are on. |
| `BETTER_AUTH_SECRET` | Only if accounts are on. |
| `BETTER_AUTH_URL` | The public https origin, if accounts are on. |
| `DATABASE_URL` | A Postgres URL, only if accounts are on. |
| `GROK_PREVIEW_CLIENT_ID` | Preview sign-in. `grok_preview` is the public id. |
| `GROK_PREVIEW_CLIENT_SECRET` | Preview sign-in. Set it in the host, never in git. |

Without those values the checklist still runs. Sign-in does not.

## Folder structure

```
README.md              this file
LICENSE                ownership and personal-use terms
OWNERSHIP.md           what is claimed and what is not
SOURCES.md             third-party materials that were checked
.env.example           placeholders, no real keys
.gitignore
package.json
vite.config.ts
vercel.json
tsconfig.json
src/                   the app
  routes/              home, privacy, support
  components/          screens
  data/                coaches, codes, figures, shops, procedures
  lib/                 backup, auth, schedule, search
public/                icons, fonts, figures, service worker
  figures/             diagrams
  fonts/               Barlow and Source Serif 4, with their licenses
server/middleware/     https redirect and install-file helper
scripts/               tests, packing, and the dev wrapper
migrations/            database files, used only if accounts are on
```

`node_modules/`, research notes, and screenshots are not part of the app. `.gitignore` leaves them out.

## Pack the source again

```bash
node scripts/pack-source.mjs
```

That writes `artifacts/rivetcare-book.zip`. It is not part of the app and it is not published. It keeps `.grok/app-env.json` and leaves the rest of the builder folder out.
