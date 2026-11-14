export type Cadence =
  | { type: "trip" }
  | { type: "days"; every: number }
  | { type: "miles"; every: number; alsoDays?: number }
  | { type: "season" }
  | { type: "years"; every: number };

export type Task = {
  id: string;
  title: string;
  detail: string;
  system: string;
  cadence: Cadence;
  fit?: "classic" | "gt";
  procedureId?: string;
};

export const tasks: Task[] = [
  {
    id: "tires-cold",
    title: "Cold tire pressure and a walk-around",
    detail: "Idle at least 3 hours. Read the placard for the load. Look for cuts, bulges, and dry rot. Include the spare.",
    system: "Running gear",
    cadence: { type: "trip" },
    procedureId: "tires",
  },
  {
    id: "lugs-look",
    title: "Lug nuts and coupler",
    detail: "Lugs snug in the star pattern. Coupler latched, pin in, chains crossed under the tongue, breakaway lanyard on the truck.",
    system: "Running gear",
    cadence: { type: "trip" },
    procedureId: "lugs",
  },
  {
    id: "lights",
    title: "7-way lights and a short brake test",
    detail: "Running, turn, brake, and backup. Pull forward about 50 ft and confirm the controller. Escape window latches work. Detectors self-test.",
    system: "Running gear",
    cadence: { type: "trip" },
    procedureId: "breakaway",
  },
  {
    id: "sixty-day",
    title: "Escape window, GFCI, hitch, and battery water",
    detail:
      "Factory interval is 1,000 miles or 60 days, whichever comes first. Check escape-window latches and the upper hinge. Test the smoke alarm and the CO detector, and replace a battery that fails the test. Test each GFCI and write down the date (a Bambi manual asks for a monthly GFCI test). Look for loose hitch bolts or odd wear. Lead-acid only: check the water and top up with distilled water. Skip that water check on lithium — a 2027 Classic does not list it.",
    system: "Safety",
    cadence: { type: "miles", every: 1000, alsoDays: 60 },
    procedureId: "shore",
  },
  {
    id: "ac-filter",
    title: "A/C return-air filter",
    detail: "Pop the grille, rinse or air-blow, dry fully, reinstall. Every 2 weeks while the A/C is in use.",
    system: "Air conditioning",
    cadence: { type: "days", every: 14 },
    procedureId: "ac-filter",
  },
  {
    id: "extinguisher",
    title: "Extinguisher gauge and tire pressure",
    detail: "Needle in the green. Disposable extinguishers are replaced 12 years after manufacture. Recheck cold tire pressure.",
    system: "Safety",
    cadence: { type: "days", every: 30 },
  },
  {
    id: "awning-hose",
    title: "Hose off the awning",
    detail: "Rinse fabric and arms. Do not let it stay wet and rolled.",
    system: "Body",
    cadence: { type: "days", every: 30 },
  },
  {
    id: "humidity-wash",
    title: "Wash the shell and check indoor humidity",
    detail: "Wash with the grain, in horizontal strokes. Keep indoor humidity at or under 60% (about 35% in a cold climate). A stove adds about a gallon of water vapor for each gallon of propane, so run a fan. Do not drop the thermostat 10 degrees at night in a closed coach. That fogs the glass. In storage, open cabinets and give the mattress some airflow.",
    system: "Body",
    cadence: { type: "days", every: 30 },
    procedureId: "sealant",
  },
  {
    id: "glycol-level",
    title: "Alde glycol level (cold)",
    detail: "About 0.4 in above MIN. Alde fluid only. Every 1–2 months while you are using heat.",
    system: "Alde",
    cadence: { type: "days", every: 45 },
    fit: "classic",
    procedureId: "alde",
  },
  {
    id: "air-cushion",
    title: "Alde hot-water air cushion",
    detail: "Every 10–14 days of Alde use. Pump OFF. Open the heating-system safety/drain valve a few seconds, then close it.",
    system: "Alde",
    cadence: { type: "days", every: 14 },
    fit: "classic",
    procedureId: "alde",
  },
  {
    id: "breakaway",
    title: "Breakaway switch",
    detail: "Pull the pin, spray contact cleaner, oil the pin, reinsert within 20–30 seconds. Brakes must lock. Every 90 days.",
    system: "Running gear",
    cadence: { type: "days", every: 90 },
    procedureId: "breakaway",
  },
  {
    id: "locks",
    title: "Locks, hinges, regulator vent",
    detail:
      "Dry graphite in locks. A little household oil on hinges, the LP-tank hold-down, and roof-vent elevator screws (not on a Globetrotter). On a Bambi, clean the exhaust-fan blades and wash the filter. On a Caravel, that same job is the range hood. Wipe oil off the aluminum. Regulator vent clear. 7-way sprayed. Hitch ball greased. Lube the main step. A World Traveler hitch jack is inspected here; it is not the Barker power jack.",
    system: "Body",
    cadence: { type: "days", every: 90 },
    procedureId: "lube",
  },
  {
    id: "sealant",
    title: "Sealant inspection and wax",
    detail: "Spring and fall, and at winterize. Roof penetrations, windows, marker lights, seams. Clear-coat-safe wax such as Walbernize. 303 or olive oil on window gaskets — never petroleum.",
    system: "Body",
    cadence: { type: "season" },
    procedureId: "sealant",
  },
  {
    id: "belly",
    title: "Belly pan and tank pans",
    detail: "Owner practice, once a year. No factory interval was found. Look for gaps, torn rivets, and loose bolts on the tank pans. Do not seal the pan shut unless a dealer says to.",
    system: "Body",
    cadence: { type: "years", every: 1 },
    procedureId: "sealant",
  },
  {
    id: "winterize",
    title: "Winterize the plumbing",
    detail:
      "Before a freeze. Blow out at the city inlet, or use the pink method. Bypass the heater first. The pressure cap depends on the model.",
    system: "Plumbing",
    cadence: { type: "season" },
    procedureId: "winterize",
  },
  {
    id: "rotate",
    title: "Rotate tires and inspect bearings",
    detail:
      "Every 10,000 miles or 6 months. Swap front and rear on the same side. Look at Nev-R-Lube end play. A Caravel is Nev-R-Lube, same as a Globetrotter. Lube the spare-carrier pivots. Silicone grease on the escape-window latches. 303 on window and door seals, except a World Traveler: that glass is acrylic and the manual calls for 3M silicone, not 303. On a 2027 Classic, update the TPMS gateway after a tire changes position.",
    system: "Running gear",
    cadence: { type: "miles", every: 10000, alsoDays: 180 },
    procedureId: "tires",
  },
  {
    id: "brakes-year",
    title: "Brakes, bearings, and the power jack",
    detail:
      "Inspect linings, magnets, drums, and wiring. Nev-R-Lube end play 0.001–0.010 in — do not repack those hubs. Bambi, Basecamp, and World Traveler manuals call for a yearly clean and repack; read the hub before you grease anything. Barker jack: high-melting-point grease on the drive-pin coupling. Do not pour oil down the post. Yearly or 12,000 miles.",
    system: "Running gear",
    cadence: { type: "miles", every: 12000, alsoDays: 365 },
    procedureId: "brakes",
  },
  {
    id: "house-year",
    title: "Battery terminals, cabinets, and the A/C coil",
    detail:
      "Yearly or 12,000 miles. Coupler and ball: every part should move freely. Replace a worn one. On a Classic, confirm the battery terminals are tight — that book does not call for petroleum jelly. On a flooded battery, clean, neutralize, and coat the posts with petroleum jelly. Silicone spray on cabinet latches, hinges, and slides. A/C condenser coil with the power off.",
    system: "Electrical",
    cadence: { type: "miles", every: 12000, alsoDays: 365 },
    procedureId: "ac-filter",
  },
  {
    id: "lp-year",
    title: "LP system check",
    detail: "Leak test with soapy water or a manometer. Regulator lock-up. Have tanks purged by the supplier. Gas-valve work is a technician job. On an Alde Classic, that includes the Alde.",
    system: "Propane",
    cadence: { type: "years", every: 1 },
    procedureId: "lp-test",
  },
  {
    id: "lp-reg",
    title: "Replace the LP regulator",
    detail: "Plan on 8–10 years, sooner if it will not hold lock-up. No sealant on flare threads.",
    system: "Propane",
    cadence: { type: "years", every: 8 },
    procedureId: "lp-test",
  },
  {
    id: "anode",
    title: "Water-heater anode and flush",
    detail: "Suburban tank models only — not tankless. 1-1/16 in socket. Replace the anode if it is more than about 75% gone. Tankless: descale instead (kit 521163).",
    system: "Water heater",
    cadence: { type: "years", every: 1 },
    procedureId: "anode",
  },
  {
    id: "descale-year",
    title: "Tankless descale",
    detail: "Once a year if the heater is an ST, AquaGo, or Girard. Suburban kit 521163. AquaGo tablets only, not vinegar. This is not the tank anode.",
    system: "Water heater",
    cadence: { type: "years", every: 1 },
    procedureId: "descale",
  },
  {
    id: "furnace-season",
    title: "Furnace vent and a test fire",
    detail: "Clear the exhaust of insect nests before the first cold night. A Dometic hard lockout is thermostat off for 10 seconds. A Truma code is a different list. Gas-valve work is a technician job.",
    system: "Furnace",
    cadence: { type: "season" },
    procedureId: "furnace",
  },
  {
    id: "alarms",
    title: "Alarm batteries",
    detail: "Test the LP/CO detector weekly, and after the coach comes out of storage. The 2025 International manual says replace the smoke alarm 10 years after purchase, and the LP/CO detector at the Replace By date, 5 years from manufacture. 2027 Bambi says replace the alarm batteries once a year. The International schedule only says as required.",
    system: "Safety",
    cadence: { type: "years", every: 1 },
  },
  {
    id: "glycol-swap",
    title: "Alde glycol exchange",
    detail: "Every 2 years (5 years only if the fluid is Alde Premium G12 EVO). Dealer or Alde-trained tech. Never mix glycol types. 60% distilled water / 40% glycol.",
    system: "Alde",
    cadence: { type: "years", every: 2 },
    fit: "classic",
    procedureId: "alde",
  },
  {
    id: "awning-deep",
    title: "Awning deep clean",
    detail: "Every 2–3 years, plus anytime it looks mildewed.",
    system: "Body",
    cadence: { type: "years", every: 3 },
  },
  {
    id: "tires-replace",
    title: "Replace tires and the detectors",
    detail: "Tires at 5 years from the DOT date, even with tread left. Smoke and LP/CO detectors at 5 years.",
    system: "Running gear",
    cadence: { type: "years", every: 5 },
    procedureId: "tires",
  },
  {
    id: "cylinders",
    title: "LP cylinder requalification",
    detail: "12 years from manufacture, then on the interval stamped on the cylinder.",
    system: "Propane",
    cadence: { type: "years", every: 12 },
  },
  {
    id: "retorque",
    title: "Re-torque after a wheel change",
    detail: "Star pattern at 5, 10, 25, and 50 miles. Not an impact wrench for the final pass.",
    system: "Running gear",
    cadence: { type: "trip" },
    procedureId: "lugs",
  },
];

export function cadenceLabel(c: Cadence) {
  switch (c.type) {
    case "trip":
      return "Every trip";
    case "days":
      return c.every === 14 ? "Every 2 weeks" : c.every === 30 ? "Monthly" : c.every === 45 ? "Every 1–2 months" : c.every === 90 ? "Every 90 days" : `Every ${c.every} days`;
    case "miles": {
      if (!c.alsoDays) return `Every ${c.every.toLocaleString()} mi`;
      const also = c.alsoDays === 60 ? "60 days" : c.alsoDays >= 365 ? "year" : c.alsoDays === 180 ? "6 months" : `${c.alsoDays} days`;
      return `Every ${c.every.toLocaleString()} mi or ${also}`;
    }
    case "season":
      return "Spring & fall";
    case "years":
      return c.every === 1 ? "Yearly" : c.every === 8 ? "Every 8–10 years" : `Every ${c.every} years`;
  }
}
