export type Recall = {
  id: string;
  campaign: string;
  when: string;
  models: string;
  defect: string;
  remedy: string;
  tell: string;
};

export const recalls: Recall[] = [
  {
    id: "23v519",
    campaign: "NHTSA 23V-519",
    when: "Filed 27 Jul 2023",
    models: "2023–2024 Globetrotter, and other 2023–24 Airstreams built 21 Jun–20 Jul 2023. Not a blanket 2024 recall.",
    defect: "SmartPlug 30 A inlet with bronze manganese-bronze D-rings can crack if torqued. Wires loosen and arc. Fire risk. A burning smell is the warning.",
    remedy: "Dealer inspects and replaces the inlet with the silver aluminum D-ring version, free.",
    tell: "Bronze-colored D-rings are the suspect parts. Silver aluminum rings are the fix. Equipment side is 23E-059, BM30xx inlets built 1 Jun–21 Jul 2023.",
  },
  {
    id: "24v664",
    campaign: "NHTSA 24V-664",
    when: "11 Sep 2024 · Transport Canada 2024-513",
    models: "2025 Classic, 21 units, built 8 Jul–26 Aug 2024. Units built after 28 Aug 2024 are not affected. VINs are not sequential.",
    defect: "Power hub firmware had the wrong e-fuse maximum. The hub can overheat. Fire risk. No owner warning sign.",
    remedy: "Dealer replaces the power hub, free.",
    tell: "Ask the dealer to run the VIN. Do not guess from the build month alone.",
  },
  {
    id: "25v143",
    campaign: "NHTSA 25V-143",
    when: "5 Mar 2025 · Transport Canada 2025-116",
    models: "2021–25 Classic 33', 2024–25 Classic 30', 2025 Classic 28'. Built 5 Mar 2021–24 Feb 2025. About 648 units.",
    defect: "Sofa footrest switch wiring is underrated. If the switch is held, it can overheat and melt. Fire risk. A burning smell is the warning.",
    remedy: "Do not use the footrest switch until the dealer installs a reverse relay, free. Production changed 27 Feb 2025.",
    tell: "One owner also reported an overheating sofa motor on a 2022 Classic 33. That report is not the same campaign, but it is a reason to take a hot smell seriously.",
  },
  {
    id: "26v401",
    campaign: "NHTSA 26V-401",
    when: "24 Jun 2026 · Transport Canada 2026-309",
    models: "2026 Classic with a MaxxAir N-Series Maxxfan, built 7 Jan–12 Jun 2026 (177 Classics).",
    defect: "Fan circuit board can fail and overheat. Fire risk. Smoke is the warning.",
    remedy: "Dealer replaces the PCB, free. Owner letters were mailed 22 Jul 2026. Fixed boards carry a QC-passed sticker.",
    tell: "Equipment recall 26E-036 covers the same fans even on a Globetrotter: P/Ns 00-04700NX, 00-04900NX, 00-04950NX, 00-08950N, 00-08900N, PCB 10B21275N, built 5 Jan–17 Jun 2026. Date code after week 51/2025 (“5125”) gets the board. Do not run the fan until it is checked. Airxcel 574-247-9235.",
  },
  {
    id: "24v656",
    campaign: "NHTSA 24V-656",
    when: "6 Sep 2024",
    models: "2024 Trade Wind with the GE air conditioner. Not Classic or Globetrotter.",
    defect: "A/C soft-start device can fail and overheat. Fire risk.",
    remedy: "Stop using it and follow the owner letter.",
    tell: "Included so a Trade Wind owner does not skip it. Smell or heat at the soft start is a stop.",
  },
];

export const tsbs = [
  {
    id: "sb201",
    title: "Service Bulletin 201",
    applies: "2025 Globetrotter built 29 Jul–21 Aug 2024, serials 573343–573897 only.",
    problem: "Coleman-Mach A/C thermostat controller problems. Dealer adds a terminating resistor at the A/C. About 0.25 hour. Airstream 877-344-1076 ext. 7491.",
  },
  {
    id: "tsb170",
    title: "TSB 170",
    applies: "30 ft Classic with Alde.",
    problem: "How to bleed air from the loop, where the expansion tank is, and the glycol part numbers. Fill to MAX with the same glycol. Do not overfill.",
  },
  {
    id: "sb180",
    title: "Service Bulletin 180",
    applies: "2018 through early 2020 Classic.",
    problem: "Replace Alde fluid with 360371-201C and add two grounds. Ask whether it was done before you buy a used one.",
  },
];

export const ownerIssues = [
  {
    title: "Inverter, Cerbo, and fans",
    models: "2024–25, various",
    issue: "Inverter errors, Victron screen faults, intermittent fans, tripped breakers, water-heater failures, and a disconnect that does not kill every 12 V load.",
    fix: "Warranty and dealer. Firmware and a wiring check before you replace parts.",
  },
  {
    title: "Alde Flow leaks",
    models: "Alde 3020 with the Flow, Classic",
    issue: "The Flow leaks, the pump short-cycles, and it is wet under the unit.",
    fix: "Temporary bypass, or a 3030 Plus which deletes the Flow.",
  },
  {
    title: "Disconnect solenoid",
    models: "Various late models",
    issue: "The battery-disconnect solenoid sticks.",
    fix: "Warranty replacement on some coaches.",
  },
];
