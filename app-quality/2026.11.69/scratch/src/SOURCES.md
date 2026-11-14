# Source and attribution register

Checked 4 November 2026. This is a record of what the app contains. It is not a license from any manufacturer, and it is not legal advice.

## Original

Text, flowcharts, maintenance wording, and the application code written for RivetCare. Copyright © 2026 Charles Moe. See LICENSE and OWNERSHIP.md.

The icon and the splash are an original trailer silhouette on a navy field. They are not an Airstream photograph.

Diagrams in `public/figures` were drawn for this app by `scripts/gen-figure-diagrams.py`, except where this file says otherwise. The script’s note says they are teaching diagrams, not tracings of factory pages. The file names still use the old `pNN` numbers so existing links keep working. Those numbers are not page citations.

The 28RB 120 V / 50 A table, and its CSA twin, is a simplified list of circuit names, wire colors, and breaker sizes taken from a factory diagram. It is not a copy of that drawing. The 27FB Globetrotter 30 A and 50 A tables, and their CSA twins, are the same kind of list. The figure titles say each list is simplified and is not the factory page. `scripts/gen-figure-diagrams.py` does not redraw these six files. Read the coach manual.

Charts in `public/figures/charts` are twenty-one Mermaid-style redraws of manufacturer troubleshooting flows. They are not scans of those pages. The manuals they follow are: Garnet SeeLevel; Suburban ST, IW60, and furnace; Truma AquaGo and Combi; Atwood DSI water heater and Hydro Flame furnace; Dometic DF/AFMD furnace, CCC2, single-zone air conditioner, and absorption refrigerator; Norcold N8/N10; the cooktop and oven sheet; SHURflo 4008; Progressive Dynamics converter; Victron SmartSolar, SmartShunt, and MultiPlus; Battle Born GC3 and 100 Ah. Each chart title says the flow is after that manual. Two boxes still print a page cite that was not opened again for this copy: the Battle Born GC3 chart says p.22, and the Dometic furnace chart says dmdiag p.10. Do not treat those as checked pages.

## Fonts

Barlow and Source Serif 4 ship in `public/fonts` under the SIL Open Font License 1.1. The license text is `OFL-Barlow.txt` and `OFL-SourceSerif4.txt`.

## Not original

- Airstream, Truma, Dometic, Atwood, Suburban, Alde, Dexter, Victron, and Battle Born are trademarks of their owners. The app names the equipment. It does not use their logos.
- Factory manuals and parts books are not stored in the app. A link opens Airstream’s site. The pages are not saved on the phone.
- Fault codes, torque, pressure, and end-play figures are copied only where a step names the manual or the maker sheet they came from. If a step does not name a source, it is not a factory specification.
- Owner-reported steps are labeled in the app. They are not factory procedures.
- Shop names and addresses were taken from the Airstream locator and from public shop listings. Last checked 27 Oct 2026. A listing is not permission to republish a dealer’s own site, and it is not a visit.

## Figures that were checked, and figures that were not

This pass did not open each drawing against a factory page. The generator script is the claim that the drawings are original. Do not treat a figure as cleared for sale on that sentence alone if you did not look at the file.

No factory page scan is intended to ship. If a file in `public/figures` is later found to be a scan, remove it.

## Critical numbers

Lug torque of 110 ft-lb on aluminum wheels and 100 ft-lb on the steel spare, and the three-wheel tow limit of 100 miles at 30 mph, match the Academy maintenance notes used while writing the procedures. Those notes are not a factory owner’s manual. The procedure tells you the wheel spec and the placard govern if they disagree.

Cold tire pressures named for 2027 sizes, and bearing end-play (0.001–0.010 in in one manual, 0.006 in on a Dexter cartridge), were not re-read from a factory PDF in this pass. The steps already say the placard governs, and that the two hub methods disagree. Those numbers were not changed.

## What is not in the app

The factory parts catalog is not in the app, and it is not in the public project zip. Factory parts-book extracts, appliance-code archives, Academy reading notes, audit reports, and development screenshots stay in the workspace only. `scripts/pack-source.mjs` is what writes that zip, and it leaves `attachments/`, `screenshots/`, and `.grok/` out. The shop list the app uses (`src/data/shops.json`) is part of the app, not that research drawer. Forum handles are not used, except one recall sentence that names 68 Overlander as the person who posted NHTSA campaign 06E076000. That name is the citation for the campaign. It is not a profile link. The trailer photograph that showed the Airstream wordmark was deleted. It is not in this copy.

## Network

The app loads from its own address. It does not send the log, the VIN, or photos with that load. A manual link goes to Airstream. A recall check goes to NHTSA. A map link opens the map app. There is no analytics request. Production connections are limited to this site and grok.com. The theme script is a file on this site. Production scripts still allow unsafe-inline because the framework writes a hydration script on each response. A fixed hash cannot cover that script.

## Delete

Privacy removes `rivetcare-v1`, the unreadable copy, the before-trim copy, scale tickets, the theme, the reminder day, and the saved shop search. It also deletes the photo store and a saved parts list. A backup file already saved in Files is not deleted. The installed app shell can remain until the browser’s site data is cleared.

## Not tested on a phone

Offline install and restore were not run on an iPhone. Home Screen storage is separate from Safari. A backup file is the copy you save yourself.

## Asset ledger

Checked 5 November 2026. This list says what each class of file is and whether permission is on file. It is not a license, and it is not an IP-counsel review. Nothing here is cleared for commercial use.

| Asset | What it is | Permission on file |
| --- | --- | --- |
| App text, flowcharts, and code | Original writing for RivetCare | Copyright © 2026 Charles Moe. Personal use is in LICENSE. Commercial use is not granted. |
| `public/figures` drawings other than the six circuit lists | Teaching diagrams from `scripts/gen-figure-diagrams.py` | Claimed original. Not compared to a factory page in this pass. Not cleared for sale. |
| Six 28RB and 27FB circuit lists | Simplified names, colors, and breaker sizes. Not the factory drawing. | No manufacturer permission on file. |
| `public/figures/charts` (21 files) | Redrawn troubleshooting flows after the manuals named above | No manufacturer permission on file. Two boxes still cite pages that were not re-opened. |
| Fonts in `public/fonts` | Barlow and Source Serif 4 | SIL Open Font License 1.1, text in the OFL files. |
| npm libraries | Declared in `package.json` | Each package’s own license. Not re-audited in this pass. |
| Fault codes and procedure numbers | Used where a step names the sheet they came from | No copy license from the maker. A step that does not name a source is not a factory fact. |
| Owner-reported steps | Labeled in the app | Not a factory procedure. No forum permission beyond that label. |
| `src/data/shops.json` | Shop names and addresses from the Airstream locator and public listings, last checked 27 Oct 2026 | Not permission to republish a dealer’s site. |
| ZIP list used for shop distance | Saved on the phone for distance only | No separate dataset license on file. |
| Logos | Not used | Airstream and appliance logos are not in the app. |
| Factory manuals, parts books, and photos of manual pages | Not stored | A link opens Airstream’s site. |

Commercial use is a no-go until each row that says “no permission on file” has evidence a lawyer has accepted. This file is not that evidence.

## Before accounts

Sign-in stays off (`VITE_AUTH_ENABLED=false`). Better Auth in this copy is 1.7, not 1.6.33. Magic Link is not loaded. Turning accounts on still needs a separate pass: session expiry and sign-out, one user cannot read another user’s records, origin checks on the real host, cookie flags on that host, and a nonce for the hydration script so production `script-src` can drop `unsafe-inline`. That nonce is not in this copy. The framework writes a new hydration script on each response, and a fixed hash cannot cover it.

## Release call

No-go for accounts and for commercial sale. The open items are the auth pass above, the hazard labels now on the steps (they still need a person to read them against the manual), and this ledger. A weekly check of the live site is not running from this tree.
