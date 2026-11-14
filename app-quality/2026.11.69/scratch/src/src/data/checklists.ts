export type CheckItem = { id: string; text: string; owner?: boolean };

export type Checklist = {
  id: string;
  title: string;
  intro: string;
  groups: { title: string; items: CheckItem[] }[];
};

export const checklists: Checklist[] = [
  {
    id: "pretrip",
    title: "Before every trip",
    intro: "The short list from the 2027 manuals and the glovebox card. Do it cold, before you roll.",
    groups: [
      {
        title: "Outside",
        items: [
          { id: "psi", text: "Cold tire pressure, including the spare. Look at the sidewalls." },
          { id: "lugs", text: "Lug nuts. If a wheel was off, this is the 5 / 10 / 25 / 50 mile re-torque, star pattern." },
          { id: "hitch", text: "Coupler on the ball, latch locked, pin in. Chains crossed under the tongue. Breakaway lanyard on the truck." },
          { id: "wd", text: "Weight-distribution bars pinned. Jack clear of the bars. Sway control connected." },
          { id: "lights", text: "7-way: running, brake, turn, backup. Pull forward about 50 ft and test the brakes." },
          { id: "stow", text: "Jack up, stabilizers up, chocks stowed, awning in, vents and antenna down, steps up." },
        ],
      },
      {
        title: "Inside",
        items: [
          { id: "fridge", text: "Fridge doors latched. Cabinets and the shower door latched." },
          { id: "windows", text: "Windows closed. Escape window operates. Roof vents closed, or fully open." },
          { id: "alarms", text: "Smoke and LP/CO alarms tested." },
          { id: "lp", text: "LP valves set for travel the way you run them. Nothing loose on the counters." },
        ],
      },
    ],
  },
  {
    id: "arrival",
    title: "Arrival and setup",
    intro: "Arrival steps written from the owner’s manual, plus the level-before-stabilizers habit. This is not an Airstream form.",
    groups: [
      {
        title: "Site",
        items: [
          { id: "obstacles", text: "Walk the site. Note obstacles, the hookups, and firm ground." },
          { id: "gps", text: "If you are boondocking, record the GPS location before you need it.", owner: true },
          { id: "level", text: "Park about a foot and a half short. Level side to side first, still hitched, with the whole tire on the boards. A single axle gets a chock on both sides of the tire. A tandem gets one in front of the front tire and one behind the rear tire, on the side that is not on boards. Chock before you unhitch. Then level front to back on the jack." },
          { id: "stab", text: "Stabilizers down only to stop movement. Recheck that the door still closes." },
        ],
      },
      {
        title: "Hookups",
        items: [
          { id: "power", text: "Shore power: pedestal breaker off, then cord, then breaker on. Wait out the EMS." },
          { id: "water", text: "City water through the regulator. 2020 and later manuals say 50 psi. 2014–2016 say 65 psi. 2017–2019 were not checked. Or fill fresh and turn the pump on." },
          { id: "lp", text: "Open both LP valves fully, then back them off a quarter turn. The regulator indicator should be green." },
          { id: "awning", text: "Awning out only if wind allows. Look inside for anything that shifted." },
        ],
      },
    ],
  },
  {
    id: "depart",
    title: "Departure",
    intro: "Departure steps written from the owner’s manual, plus the owner additions that keep people from leaving the hose behind. This is not an Airstream form.",
    groups: [
      {
        title: "Outside",
        items: [
          { id: "tanks", text: "Dump if you need to. Fresh water filled for the haul you want. Gray valves closed. Cap on." },
          { id: "hoses", text: "Hoses, cord, and EMS stowed. Look for damage." },
          { id: "compartments", text: "Compartments locked. LP as you travel. Stabilizers fully up." },
          { id: "hitch2", text: "Hitch, chains, breakaway. Jack stowed and clear of the WD bars." },
          { id: "lights2", text: "All lights tested, then exterior lights off. Lug nuts. TPMS on. Windows and mirrors. Awning in and latched." },
          { id: "fluids", text: "Flooded batteries: check the water. Tow-vehicle fluids. Lithium: skip the water check." },
          { id: "roll", text: "Pull forward about 50 feet, test the brakes, and look back at the site. Camera works. Second key set in the truck. After a wheel change, recheck lug torque at 10, 25, and 50 miles." },
        ],
      },
      {
        title: "Inside",
        items: [
          { id: "stow", text: "Loose items stowed. Fridge shelf guards up. Table stowed. Blinds down. Windows and roof vents closed. Cabinets, fridge, and shower door latched." },
          { id: "hvac", text: "HVAC off. TV latched. Antenna down." },
          { id: "water", text: "Pump off and pressure relieved. Toilet bowl empty." },
          { id: "door", text: "Step secured. Door locked, deadbolt on. Smoke/CO tested. Battery disconnect set the way your manual wants it for travel." },
        ],
      },
    ],
  },
  {
    id: "dump",
    title: "Dump station",
    intro: "Black first, gray second. Cap on before you move.",
    groups: [
      {
        title: "Sequence",
        items: [
          { id: "gloves", text: "Gloves on. Hose secure at both ends." },
          { id: "black", text: "Dump black. Flush if equipped. Close and latch the black valve." },
          { id: "gray", text: "Dump gray so it rinses the hose. Close and latch gray." },
          { id: "cap", text: "Cap the outlet. Rinse and stow the sewer hose and the flush hose." },
        ],
      },
    ],
  },
  {
    id: "pdi",
    title: "Pickup day / PDI",
    intro: "Defects should be reported within 10 days. The walk-through is the cheapest time to find them. Plan most of a day.",
    groups: [
      {
        title: "Paper and shell",
        items: [
          { id: "vin", text: "VIN on the title matches the trailer. Two key sets. Warranty registered. Ask the dealer to run open recalls on the VIN." },
          { id: "skin", text: "Dents, scratches, missing rivets at the front locker and front seam. Sealant at every roof penetration. Clearance lights. A/C shroud." },
          { id: "tires", text: "DOT date codes on all tires and the spare. Cold pressure versus the placard. Lug torque. Look for axle corrosion." },
          { id: "openings", text: "Every window, both door locks, the screen door, roof vents, fans, and the escape window." },
        ],
      },
      {
        title: "Systems",
        items: [
          { id: "water", text: "Fill fresh, pressurize, and listen. The pump should not cycle with every faucet closed. Run hot at every fixture." },
          { id: "heat", text: "Furnace or Alde on LP and on electric. On a Classic, look for glycol at the convectors." },
          { id: "electric", text: "Shore power, battery disconnect, inverter, every light and outlet. Pair MyAirstream if the coach has it." },
          { id: "apps", text: "Fridge cools both compartments. A/C cools. Microwave, cooktop, hood, TV." },
          { id: "tow", text: "7-way, brake controller, backup camera, and a short drive if the dealer will allow it." },
          { id: "lpdrop", text: "Owner tip: light a burner, close the cylinders, wait about 30 minutes, then try to relight. It should still light if the system is tight. A dealer manometer test is the real check.", owner: true },
          { id: "overnight", text: "Camp near the dealer the first night or two so morning problems are still their problem.", owner: true },
        ],
      },
    ],
  },
  {
    id: "winter",
    title: "Winterize",
    intro: "Full steps are in the Winterizing procedure. This is the punch list so you do not skip the bypass.",
    groups: [
      {
        title: "Water",
        items: [
          { id: "bypass", text: "Alde or tank heater bypassed before air or antifreeze. Classic: use the valve card." },
          { id: "drains", text: "Fresh tank empty. Low-point drains open, then closed when you are done blowing." },
          { id: "air", text: "Regulated air at the city inlet. 50 psi max on Bambi, Basecamp, Caravel, Flying Cloud, International, World Traveler, and Classic. 30 psi max on Globetrotter, Trade Wind, Frank Lloyd Wright, and Stetson. If unsure, 30." },
          { id: "pink", text: "RV antifreeze in every trap. Toilet and sprayers done. Kit handle back to NORMAL USE if you used it." },
          { id: "tanks", text: "Black and gray dumped and flushed. Alde drain left open in storage (Classic)." },
        ],
      },
      {
        title: "Power and LP",
        items: [
          { id: "lp", text: "LP cylinders off. Do not lock the tank cover. Leave the LP detector connected. Disconnecting it can make it alarm for hours when you power up." },
          { id: "batt", text: "Lithium stored full, negative off, heater switch OFF. Lead-acid removed and charged every 30–60 days. Do not charge lithium below 32 °F." },
          { id: "fridge", text: "Fridge and freezer empty, off, doors propped." },
          { id: "sanitize", text: "Sanitize the fresh system before storage, and again before anyone drinks the water in the spring. In a cold closed coach, keep humidity around 35% or under." },
        ],
      },
    ],
  },
  {
    id: "boondock",
    title: "Boondocking",
    intro: "Dry camping. Water and amp-hours are the two budgets.",
    groups: [
      {
        title: "Before you leave pavement",
        items: [
          { id: "full", text: "Fresh tank full. Gray and black empty. Batteries full, and you can see state of charge on the shunt." },
          { id: "inv", text: "Inverter off unless you need it. About 1,000 W only charges the batteries. Microwave or A/C wants about 4,000 W or more. A small generator needs a soft start for the A/C." },
        ],
      },
      {
        title: "On site",
        items: [
          { id: "navy", text: "Navy showers. Catch warm-up water. Wipe dishes before washing." },
          { id: "gps", text: "Record GPS on arrival." },
          { id: "clear", text: "Watch ground clearance. An axle lift is an owner modification — ask about warranty before you do it." },
        ],
      },
    ],
  },
  {
    id: "storage",
    title: "Storage",
    intro: "Short version. Do the sealant inspection before the trailer sits in the weather.",
    groups: [
      {
        title: "Lockup",
        items: [
          { id: "chock", text: "Wheels chocked. Hitch lock on. Optional: wheel boot, locking lugs, GPS tracker." },
          { id: "doors", text: "Fridge empty, off, doors cracked for air. LP off. Front locker, rear hatch, and door locked." },
          { id: "power", text: "Batteries stored per the lithium procedure. No parasitic loads you did not intend." },
          { id: "skin", text: "Sealant looked at. Lube list done. No soft cover. Wind can rub it through the clear coat. A little water in the toilet and the traps if you are only gone a few days. Humid storage: a moisture absorber. Hot and dry: a bucket of water inside." },
        ],
      },
    ],
  },
];

export function checklistById(id: string) {
  return checklists.find((c) => c.id === id);
}
