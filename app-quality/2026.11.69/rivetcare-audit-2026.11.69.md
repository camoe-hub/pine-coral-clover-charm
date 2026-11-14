# RivetCare 2026.11.69

This copy is the right book, and the checks Charles asked to verify hold. An owner who stays inside the app sees RivetCare, the right year-specific part numbers, a tongue-weight sentence only outside the usual band, and the same truck sticker after changing coaches. Two things would still mislead or get in the way: the iPhone “add to Home Screen” page calls the app Grok App, and typing scale weights on a phone shoves the screen and the bottom tabs sideways.

Zip sha256 `8bee7dc8dbc41b89b366eb372e7ff354ca2941f4f591c491e5a8c0dfc4ae981b` (10,353,603 bytes). Version observed: **2026.11.69** in package.json, version.txt, the Support screen, and the built service-worker cache `rivetcare-shell-2026.11.69`. The public live site was not graded. It was not updated for this copy.

## Findings

### 1. The iPhone install page is not RivetCare

On a phone, Home offers “Add it to your Home Screen.” Tapping Add opens `/?install=1&platform=ios`. That page says **Add Grok App to your Home Screen**, shows a sample phone with a racing-game icon, and leaves the theme color as the raw placeholder `{{THEME_COLOR}}`. The same page is what the built copy serves. The in-app home screen is fine: one manifest, the name RivetCare, navy `#152A6A`, no extensions script, and no black `#000000`.

The six failing script tests are this same gap. They require the install page and the generated manifest to keep the name RivetCare and the navy color, including on a grok.me address. The code still names that page from the host. On this preview the host becomes “Grok App.” On a published grok.me address it would become the slug, not RivetCare. A side manifest at `/__grok/manifest.webmanifest` is still “Grok App” and black. The manifest the app actually links is the RivetCare one.

### 2. Weight results make a phone screen wider than the phone

Empty screens at 390×844 and 1280×800 stay inside the width. After axle weights are typed, the result lines do not wrap. The long line is “No steer rating entered. This measured weight is not room left under a limit, and it is not a safe-tow result.” On a 390-wide phone the page grows to about 682 pixels. The bottom tabs (Home, Maintain, Records, Fix, Library) slide sideways with it. The numbers themselves are not wrong. The tongue sentence stays ordinary text: no pass, no fail, no colored light.

### 3. The lint gate is red. An owner does not see it.

`eslint` exits with 1 error and 13 warnings. The error is a spacing rule in the year-part test (`src/lib/part-year.test.ts`), not in a screen. The old unused `next` warning in the records store is still there (now `store.ts` line 1278). Typecheck is clean. `npm audit` for production dependencies found 0 vulnerabilities. The year-part tests themselves pass.

## What I checked

The zip matches the hash above. Unpacked, it is the same 376 files as the app that is already running. Preview used for the phone and desktop checks: `http://127.0.0.1:8080/`. A built copy was started only on port 8081, long enough to read the stamped worker, then stopped. 8080 was left running.

**Version.** package.json, version.txt, and the Support screen say 2026.11.69. The source worker keeps the placeholder `__BOOK_VERSION__` on purpose; its own test forbids a baked-in year. The build replaces it. The built file, and the worker served from the 8081 preview, is `rivetcare-shell-2026.11.69`, and the token is gone. The dev server on 8080 still serves the placeholder, because the stamp runs only at build time. That is not a second version.

**Parts, on a phone, in the app.** A 2021 Classic 28RB list does not offer coupler 455653, city inlet 601392-06, or furnace 690732-02. Each row says “Not this year’s part.” Opening the card still shows the number. A 2026 Classic shows 455653. A 2025 Classic shows 601392-06. A 2025 Globetrotter 27FB shows 690732-02. The lug nut 400923 and the Classic inverter 514515 stay on the 2021 list as normal numbers.

**Tongue weight.** One sentence, and only outside the band. Checked in the app: 6.45% and 9.99% get “Tongue weight is … of the loaded trailer. The usual band is 10–15%.” 10%, 12%, and 15% show the share and no extra sentence. 16% gets the sentence again. No pass, no fail, and no colored light on that result.

**Truck sticker.** A truck name and GVWR typed on a Globetrotter were still there after switching to a Classic 28RB.

**Privacy, Support, offline.** Both screens open. Support names 2026.11.69. Both are on the offline save list in the code. With the network off, a Privacy screen that had not been opened showed “This screen isn't on the phone yet,” with Back to Home and Open Offline. It was not a raw crash and not the plain word Offline. The dev preview does not register the worker (that starts only in a production build). A full “Save for offline,” then every screen with no signal, was not repeated on the built copy.

**Other closed decisions, still holding.** The home screen does not download the project zip by itself. The zip is fetched only after the Support link “Save the project zip” is pointed at. The tab is still Fix. The dealer field is still on Records. No `silverbook` key is read or written. The tire screen says the placard still wins, asks for the heavier axle end rather than splitting a scale-ticket axle group, and offers the three published trailer sizes (the truck side is a picked size or a typed row). The 27FB 50 A sheets, standard and CSA, use a 15 A breaker, an 8.00 A converter, and 36.00 A on leg 1.

**Toolchain, on the unpacked zip, system Node v22.23.3.** Script tests as shipped: 260 total, 250 pass, 6 fail, 4 skip. The 6 failures are the install-page and manifest naming tests above. The 4 skips are builder-skill files that are not in this copy. TypeScript tests from package.json `test`: 108 pass, 0 fail. Alias tests: 40 pass, 0 fail. `tsc --noEmit` passed.

**Shops.** 116 shops. 23 still have no hours, and the card says “Hours unknown.” 5 have no map point, and the card says “no map point, call to confirm.” That does not invent a location.

**Headers on this preview.** CSP is present, with the known `unsafe-inline` scripts and styles. `nosniff`, `no-referrer`, and geolocation allowed for this origin. No HSTS on the local http preview. `security.txt` is still missing (404). Home has one manifest link and one apple-touch icon.

## What I could not check

- Node 20 (`/workspace/tools/node-v20.20.2-linux-x64`), the audit script’s Node 22.23.4 path, Node 24, and `/workspace/tools/v22.23.3`. Not present. Not a product failure. System Node is v22.23.3.
- The public live site. It is behind this copy, so it was not used as the grade. The old http-to-https failure on that host was not rechecked. This copy’s redirect code sends a non-local http request to https with 308.
- A phone install of the real service worker, the update prompt, and a full offline save of every screen after “Save for offline.” The worker is registered only in a production build. The built cache name was checked. The phone update flow was not.
- The print checklist’s sideways chip row was not reopened in the browser. The code still uses a horizontal chip row there. Empty main screens did not overflow.
