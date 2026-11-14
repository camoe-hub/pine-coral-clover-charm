# RivetCare app-quality scripts
They do not edit source or deploy. Live checks only send GET and HEAD requests.

## live-check.sh [url] [expected_zip_sha256]
- version.txt and the sw.js cache name, to check the live version against the zip.
- Security headers (CSP, HSTS, nosniff, referrer, permissions, COOP).
- Q07: http:// should redirect to https with a 301 or 308.
- Q61: the home HTML should have exactly 1 manifest and 1 apple-touch-icon link. Both manifests should have the name "RivetCare" (or $APP_NAME) and no #000000.
- Q08: lists every `<script src>` that has no integrity attribute.
- Status codes for robots.txt, security.txt (both paths), the old icon-splash zip, and the book zip. Also prints the robots.txt body.
- Hashes the public project zip. It takes the zip path from the robots.txt Disallow line and only hashes the file if it returns HTTP 200. If you pass the expected sha, it prints CHANGED or UNCHANGED.

## audit-run.sh <zip> <workdir> [grok_fixture_dir]
Extracts the zip into <workdir>/src (scratch only). Then runs npm ci, tsc, eslint, and npm audit --omit=dev. Runs the script tests on Node 20, Node 22 and the system node, the TS and alias tests on Node 22, and a rerun with a restored .grok fixture (Q69). Finishes with data and code checks for Q47, Q02, Q15, and Q53.
Known gap: its TS and alias file lists are older than package.json `test`. Also run the two lists from package.json `test` by hand (Node 22 and 24; Node 20 has no --experimental-strip-types, so those are "not checked" there).
Example: `audit-run.sh /workspace/app-quality/r7/live.zip /workspace/app-quality/r7`
live-check.sh: set APP_NAME (default RivetCare) for the name to expect. The zip path is read from robots.txt (currently /rivetcare-book.zip).
Node: script tests run on Node 20 (/workspace/tools/node-v20.20.2, sha-checked against nodejs.org), Node 22, and the system node (v24). They use the TAP reporter so every version prints the same summary. A missing binary is reported as "not checked".

## Browser checks (Node + playwright-core + /usr/bin/google-chrome; read-only against live, fresh context, test data only)
Set PW_CORE to a playwright-core/index.mjs if the r9 scratch copy is gone. Shared helpers are in func-lib.mjs.
- route-crawl.mjs <base> <ids.json> <out> [phone|desktop]: visits every hash route (plain screens plus every procedure, part, checklist, flow, figure, symptom and table id) and records console errors, failed requests, page overflow and wide scroll boxes. ids.json comes from the src/data id lists.
- func-suite.mjs [phone|desktop]: the per-function suite (setup, photos, miles, schedule, checklists, notes, log, backup export/verify/restore/undo/keep, search, fix flows, codes, circuit tables, print, level, weights, shop finder, theme, .ics/.csv, coaches, delete-my-data). It removes showSaveFilePicker so Save file uses the download fallback.
- func-migration-offline.mjs: whether records under the old silverbook-v1 key are read, and SW install plus an offline reload.
- offline-sweep.mjs: taps Save for offline, goes offline, loads every screen. Read the first failure only (hash-only goto keeps the error page).
- axe-sweep.mjs [phone|desktop]: axe-core on 39 screens.
- zip-autoload-check.mjs: bytes of the project zip the home screen downloads by itself.
