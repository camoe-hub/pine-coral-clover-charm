# RivetCare baseline (current). Replaces silverbullet-baseline.md as of r7, 2026-11-07
Final name: RivetCare (confirmed by Charles on Nov 7). The "Fix" tab name is intended. Storage keys: all rivetcare-* (Charles, Nov 8). No migration from silverbook-* is needed (no existing user data), so the r9 P0 is closed by decision.
History: silverbullet-baseline.md (Q01–Q69, N1–N6) and the dated copies.

| ID | Status (r7 upload, 2026.11.27, sha c19e0a7a…; live 525ff735 is behind) |
|---|---|
| Q07 http→https 500 | OPEN |
| Q08 no SRI on grok.com extensions.js | OPEN (low) |
| Q15 slice(0,200) | MOSTLY FIXED in upload (log uses LOG_MAX; 2 note trims remain, OK) |
| Q47 shops 23 no hours / 5 no lat | OPEN |
| Q53 print chip row, no scroll hint | OPEN (low) |
| Q69 shipped zip self-test | FIXED in upload (0 fail) |
| security.txt | OPEN (info) |
| Lint 13 warnings (new: store.ts:1212 unused `next`) | OPEN (low) |
| N4 CSP unsafe-inline | INFO (documented) |
| N5 SW update flow on a phone | not checked |
| 27FB 50 A converter row (20 A/10.90/38.90 vs manual 15 A/8.00/36.00, pp.8-28/8-29) | DECISION (Charles) |
| Name "RivetCare" conflict (UK staffing firm + Google Play app "Rivet Care") | DECISION (Charles); registers not checked |
| Copyright: charts MEDIUM; circuit tables LOW–MEDIUM; rest LOW | |
| FIXED: Q01, Q02, Q03/Q67, Q29, Q48, Q61 (live+source), Q62, Q64, Q66, Q68, N1, N2 (1.00 A CSA verified), N6 (silverbook-offline-set) | |
Tests upload: 256 / 252 pass / 0 fail / 4 skip on Node 20/22/24; TS 70/70; alias 13/13. Upload adds geolocation=(self) (fixes the blocked shop locator; not Q07/CSP). Pending: deploy the upload to live.
Tests r7 live build: 256 / 251 pass / 1 fail / 4 skip on Node 20/22/24; 252/0 fail after rebuild; TS 70/70; alias 13/13.


## Decisions (2026-11-07, Charles)
- 27FB 50 A converter row: change both the standard and CSA tables to match the 2025 Globetrotter manual (p.8-28/8-29): 15 A breaker, 8.00 A converter, 36.00 A Leg 1. Status: open fix for the code owner. Verify in the next zip.
- RivetCare name: no formal trademark search wanted. Closed as accepted risk (low to medium; not a legal conclusion).

## Decisions Nov 8, 2026 (r9, 2026.11.50)
1. Keep the rivetcare-* storage names. No data migration is needed. The r9 P0 "upgrade shows empty app" is closed as accepted by design. Future audits should not flag silverbook-* to rivetcare-* data loss. They should still flag any leftover silverbook-* key the code reads or writes.
2. Approved: add Privacy and Support to the offline save list (offline-save.ts) and replace the raw offline crash page with a friendly one. Verify both in the next build.
3. Not yet: stop the automatic 10 MB zip download on home. Keep it open as P2, deferred by Charles.
