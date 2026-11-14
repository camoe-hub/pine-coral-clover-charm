# Start the audit. RivetCare 2026.11.69

You are the app quality bot. Charles asked for an audit of this copy. Do not edit the app. Do not publish. Write only under `/workspace/app-quality/2026.11.69/`.

## The copy
- Version: 2026.11.69
- Zip: `/workspace/app-quality/2026.11.69/rivetcare-book.zip`
- sha256: `8bee7dc8dbc41b89b366eb372e7ff354ca2941f4f591c491e5a8c0dfc4ae981b`
- Size: 10,353,603 bytes
- The running app for browser checks is `http://127.0.0.1:8080/`. Leave that server running. A built preview, if you need one, goes on port 8081 only.
- The live site was not updated. Do not score this copy by whatever is on the public site. If you look, say the live site is behind and move on.

## How to work
Prior scripts and the decision baseline are in `/workspace/app-quality/2026.11.69/rivetcare-app-quality/`. Read `rivetcare-baseline.md` first. The scripts do not edit source. `audit-run.sh` expects Node 20 and Node 22 paths that may be missing here; the tools tree has `/workspace/tools/v22.23.3` and the system node. Say "not checked" when a binary is missing. Do not treat a missing old Node as a product failure.

Extract the zip into a scratch folder under this directory. Run the toolchain (install, typecheck, lint, npm audit, the tests the zip ships). Then browser-check the running app at phone 390×844 and desktop 1280×800. Screenshot evidence stays in this folder.

Write the report to `/workspace/app-quality/2026.11.69/rivetcare-audit-2026.11.69.md`. Lead with a conclusion, then findings ranked by whether an owner would be misled. Separate a real defect from an intended decision.

## Closed. Do not reopen
- Storage keys stay `rivetcare-*`. No silverbook migration. No existing user data to move.
- The tab name stays Fix.
- The home zip download is deferred. Note it if it still downloads by itself. Do not file it as a new surprise.
- No second navigation bar. No retint of the gray `#3a4550`.
- The dealer stays on Records.
- No weigh-in wizard, no go / caution / over lights, no safe-to-tow certificate, no photo scanner, no live tire sensors, no accounts.
- The placard wins over a calculated tire pressure.
- Do not split a scale-ticket axle group into a heavier-end tire load.
- With no year set, part numbers and notes stay as written.
- A floor-plan number with no year stays on the list.
- "Not this year's part" is intended when the only stated use is another year. The number stays on the card.
- One truck sticker is shared across coaches. That reuse is intended.
- Cold pressure is a published table for three trailer sizes. The truck side is a picked size or a typed row.
- Privacy and Support belong on the offline save list. A screen that is not saved should be a friendly page, not a raw crash.

## Verify in this version
- package.json, version.txt, and the service-worker cache all say 2026.11.69, and they match the zip.
- On a 2021 Classic, the list does not offer coupler 455653, city inlet 601392-06, or furnace 690732-02. Each says "Not this year's part." The number is still on the card.
- A 2026 Classic still shows the coupler. A 2025 coach still shows the inlet. A 2025 Globetrotter still shows the furnace. The lug nut and the inverter stay on a 2021 list.
- Tongue weight outside 10–15% of the loaded trailer gets one sentence stating the share and the usual band. A share from 10% through 15% gets no extra sentence. No pass, no fail, no colored light.
- The truck sticker is still there after switching coaches.
- Privacy, Support, and the friendly offline page still behave as approved.
