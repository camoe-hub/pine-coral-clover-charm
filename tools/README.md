# tools

Local helpers that are not part of the app. Nothing here ships: only `public/` is served.

- `offline-smoke.mjs`: headless Chromium check of offline support (precache, search and ZIP lookup offline,
  opt-in pictures, resumed install, old caches removed). Run `npm run build && npm run preview`, then
  `PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1 node tools/offline-smoke.mjs` (first time: `npx playwright install chromium`).
