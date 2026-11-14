import extraSymptoms from "@/data/extra-symptoms.json";
import checkAdditions from "@/data/check-additions.json";

export const systems = [
 "Electrical",
 "Plumbing",
 "Water heater",
 "Alde",
 "Furnace",
 "Air conditioning",
 "Refrigerator",
 "Running gear",
 "Propane",
 "Leaks",
 "Body & gear",
] as const;

export type Check = { look: string; action: string };

export type Symptom = {
 id: string;
 system: string;
 title: string;
 blurb: string;
 level: "stop" | "soon" | "watch";
 fit?: "classic" | "gt";
 checks: Check[];
 parts?: string[];
 procedures?: string[];
};

const extraChecks = checkAdditions as Record<string, Check[]>;

function withNewChecks(list: Symptom[]): Symptom[] {
 return list.map((s) => {
  const more = extraChecks[s.id];
  if (!more?.length) return s;
  return { ...s, checks: [...s.checks, ...more] };
 });
}

export const symptoms: Symptom[] = withNewChecks([

	{
		id: "no-12v",
		system: "Electrical",
		title: "No 12 V power / dead batteries",
		blurb: "Lights, pump, or jack are dead. Work the simplest checks first.",
		level: "soon",
		checks: [
			{
				look: "Is the battery disconnect ON?",
				action: "An LP detector that stays powered with the disconnect off is normal. On some 2024–25 units the disconnect does not isolate every 12 V load (owner-reported)."
			},
			{
				look: "No output from a 100 Ah Battle Born",
				action: "After a short, take the cables off and measure. Above 10 V, reconnect. Under 10 V, call Battle Born. A surge over 100 A for more than 30 seconds reconnects by itself after 5 seconds. A GC3 is the 270 Ah pack, part 514020-01, and its surge limit is about 500 A. Read the label. A Cerbo GX code, GX 42 through GX 60 or a VRM number, is in Fault codes. GX 42 is not a field repair."
			},
			{
				look: "Main fuse or breaker at the battery and converter",
				action: "Replace only with the same rating. A fuse that blows again needs a qualified tech."
			},
			{
				look: "Cables and the frame ground",
				action: "Clean to bare metal and re-torque. A dead tongue jack alone often traces to the ground at the three A-frame bolts."
			},
			{
				look: "Disconnect solenoid (often under a bed)",
				action: "Stuck solenoids have been replaced under warranty on some late units."
			},
			{
				look: "On shore power, is the converter charging?",
				action: "Converter should climb toward 14.x V in bulk. Check the cord, the pedestal breaker, and the EMS. A manual disconnect has to be ON to charge. An electronic one charges either way. On a Bambi or Basecamp, solar and the 7-way charge with the switch in either position."
			},
			{
				look: "State of charge is blank, but voltage still shows",
				action: "The SmartShunt lost calibration after a disconnect or a deep discharge. Charge to a peak near 14.3 V and wait about 3 minutes. Voltage and current keep working while it is blank. On flooded or AGM batteries, stay above about 12.4 V. Under about 40% can damage those."
			}
		],
		parts: ["fuses", "battery", "gc3"],
		procedures: ["lithium"]
	},
	{
		id: "converter",
		system: "Electrical",
		title: "Converter not charging",
		blurb: "Plugged in, but battery voltage never climbs.",
		level: "soon",
		checks: [
			{
				look: "Voltage at the battery while plugged in",
				action: "Three modes: about 14.4 V is boost, 13.6 V is normal, and 13.2 V after a long sit is storage. A lithium owner's manual says 14.4 V. The bench sheet says about 13.6 V, or 14.6 V on a lithium model. Those two lithium numbers do not agree. To test the converter, disconnect the battery and measure its output. If that voltage is in range, the converter is fine and the fault is the battery or the wiring."
			},
			{
				look: "Current in bulk",
				action: "With low batteries, expect more than about 30 A in bulk."
			},
			{
				look: "Disconnect type",
				action: "A manual disconnect must be ON to charge. Electronic disconnects usually still charge when off."
			},
			{
				look: "Fan and vents",
				action: "Overheat shutdown is common. Clear the vents."
			},
			{
				look: "Lithium profile and temperature",
				action: "The slider behind the power-center face is LA, or 1, for lead-acid and AGM, and LI, or ON, for lithium. Lithium is about 14.6 V for 1 to 4 hours, then 13.6 V, with no float. A deck-mounted WFCO needs the 14 AWG jumper before LI works. Do not leave a lithium battery on the lead-acid setting. Under 35 °F turn the battery heaters on. After a low-voltage disconnect, wake with shore power within 24 hours."
			}
		],
		parts: ["converter"],
		procedures: ["lithium"]
	},
	{
		id: "no-120",
		system: "Electrical",
		title: "No 120 V, breaker trips, or GFCI",
		blurb: "Shore power is dead, a breaker pops, or an outlet will not reset.",
		level: "stop",
		checks: [
			{
				look: "Pedestal breaker, trailer breakers, and a warm cord",
				action: "Reset breakers. Replace a heat-damaged plug. A burning smell at a SmartPlug inlet can be recall 23V-519 — stop and see Recalls."
			},
			{
				look: "Are you over 30 A?",
				action: "Air conditioning plus an electric water heater often exceeds a 30 A pedestal. A 30 A service is about 3,600 W. A 50 A service is about 12,000 W and does not charge the battery faster. On a 30 A pedestal a dual-air coach runs one air conditioner. A soft start only cuts the surge. Switch the water heater to gas. If a breaker keeps tripping after you shed the load, stop resetting it and have the circuit checked."
			},
			{
				look: "The plug does not match the pedestal",
				action: "Use a cord-style dogbone. Do not use a plug-style adapter, and never a dryer outlet. That outlet can damage the coach even when it looks the same."
			},
			{
				look: "GFCI that will not reset",
				action: "Unplug loads one at a time. Replace a GFCI that will not reset. Moisture in an outlet, the water-heater element, or the A/C is a common cause. Test GFCIs monthly."
			},
			{
				look: "Inverter outlets dead",
				action: "Turn the inverter on, reset its GFCI, check the inverter fuse and battery voltage. The battery disconnect must be ON for the inverter. A PD1600 shows E-1 through E-7. Those same numbers on a Progressive Industries shore protector are pedestal faults, not battery faults. Read the label. A MultiPlus overload light means reduce the load."
			}
		],
		parts: ["fuses", "smartplug"],
		procedures: ["shore"]
	},
	{
		id: "solar",
		system: "Electrical",
		title: "Solar not charging",
		blurb: "The panels are in the sun and the batteries are not rising.",
		level: "watch",
		checks: [
			{
				look: "Are the batteries already full?",
				action: "A controller that rests when full is normal. Draw the batteries down and check again."
			},
			{
				look: "0 V on the PV leads",
				action: "Look for shade, a loose MC4, or a blown fuse."
			},
			{
				look: "A strange voltage, such as 21 V",
				action: "The controller may have auto-sensed 24 V. Disconnect PV+, then battery+, wait, and reconnect in reverse order."
			},
			{
				look: "Victron SmartSolar lights",
				action: "Read the three LEDs. Blue blinking is not charging. Green blinking alone is too hot. Blue and green blinking is over-current. Yellow and green blinking is panel voltage too high. Yellow blinking alone is a network or BMS problem. Blue and yellow blinking together is an internal error. Confirm the controller says SmartSolar."
			},
			{
				look: "Roof wire clips",
				action: "The factory tape on the solar-wire clips lets go. Clean with alcohol and tape them back so the wires do not chafe on screws or scratch the roof. Look for a cracked panel while you are up there. Owner-reported."
			},
			{
				look: "Victron SmartShunt",
				action: "Current shown backwards means the two negative cables are swapped. A current reading with everything off needs a zero calibration, loads off. A state of charge that drifts is not seeing a full charge often enough. All negatives still have to pass through the shunt. Dashes, or a blank state of charge, mean the shunt lost calibration: charge to a peak near 14.3 V and wait about 3 minutes. Voltage and current still work. You may have to unplug and replug shore power, because the converter limits charge time. The controller has to be switched on, and a dirty or shaded panel will not keep up."
			}
		],
		parts: ["shunt", "gc3"],
		procedures: ["lithium"]
	},
	{
		id: "seven-way",
		system: "Electrical",
		title: "Brakes or lights flicker on the 7-way",
		blurb: "Running lights, turns, or brakes come and go.",
		level: "soon",
		checks: [{
			look: "Contacts and the ground",
			action: "Clean the pins with electrical contact cleaner, then add dielectric grease. Do not use WD-40 or Vaseline. They can soften the rubber. Check the ground. Cap the plug, or store it pointing down. View is looking into the tow-vehicle receptacle."
		}],
		procedures: ["breakaway"],
		parts: ["seven-way"]
	},
	{
		id: "no-water",
		system: "Plumbing",
		title: "No water / pump will not prime",
		blurb: "The pump runs dry, clicks, or nothing comes out of the faucet.",
		level: "soon",
		checks: [
			{
				look: "Is there water, and is the city valve open?",
				action: "Fill the fresh tank or open the city connection."
			},
			{
				look: "Pump is silent",
				action: "Check 12 V power and the pump fuse."
			},
			{
				look: "Strainer bowl",
				action: "Check the O-ring and cone washers for cross-threading. Prime the strainer with water and open a faucet. A cracked clear cap is common after winterizing. On a SHURflo 4008, skipping sanitizing is the main reason the pressure switch and bypass fail early."
			},
			{
				look: "Drains and winterize valves",
				action: "Low-point drains and the heater drain must be closed. Confirm the winterize kit is back on NORMAL USE."
			},
			{
				look: "Heater bypass valve position",
				action: "Normal use: the inlet and outlet are inline with the heater, and the bypass is perpendicular. Winterize: the bypass is inline, so water skips the heater. A bypass left inline gives cold taps, or no hot water. Turn it back to normal before you heat the tank."
			},
			{
				look: "Air lock or a kink",
				action: "Open faucets and run the pump. Residual antifreeze or a closed bypass can block flow. Do not run the pump dry more than a few minutes."
			}
		],
		parts: ["strainer", "city"],
		procedures: ["sanitize"]
	},
	{
		id: "pump-runs",
		system: "Plumbing",
		title: "Pump runs constantly, or city water fills the tank",
		blurb: "The pump never shuts off, or the fresh tank rises on city water.",
		level: "soon",
		checks: [
			{
				look: "Check valve, low-point, or winterize valve",
				action: "Temporary: disconnect city water, open faucets, run the pump, close them, reconnect. Permanent fix is an external discharge check valve, or rebuild or replace the pump. A SHURflo 4008 shuts off around 55 psi. Bypass starts near 40 psi and is full near 62. A pump that will not shut off, or that cycles with the faucet closed, is a leak, trapped air, or a switch set wrong. Pressure adjustment is a technician job."
			},
			{
				look: "Winterize valve installed backwards",
				action: "Backwards kits are a reported cause. Match the tag: WINTERIZING vs NORMAL USE."
			},
			{
				look: "City regulator",
				action: "A missing or failed regulator can over-pressurize the system. The 2027 manuals limit the inline regulator to 50 psi."
			}
		],
		parts: ["city", "strainer"]
	},
	{
		id: "pulsing",
		system: "Plumbing",
		title: "Pulsing, low flow, or a noisy pump",
		blurb: "Water hammers, surges, or the pump chatters.",
		level: "watch",
		checks: [{
			look: "Pressure switch, accumulator, and the pump hose",
			action: "Adjust the switch or add an accumulator. A short flexible hose at the pump helps. About 60 psi is common. Clean aerators and unkink lines."
		}]
	},
	{
		id: "black-tank",
		system: "Plumbing",
		title: "Black-tank odor or a bad dump",
		blurb: "Smell in a closet, or the tank will not empty.",
		level: "soon",
		checks: [
			{
				look: "Odor in a closet",
				action: "A failed toilet-flush check valve or vacuum breaker. Brass Valterra is the preferred replacement."
			},
			{
				look: "Gulp-gulp while dumping",
				action: "The vent stack is blocked. Clear it before you assume the valve is bad."
			},
			{
				look: "Valve will not seal",
				action: "Lubricate, soak, or replace it. Warped gates are common after a freeze."
			},
			{
				look: "What you put in the tank",
				action: "Only household ammonia and TSP, in small amounts. No petroleum distillates, dish detergent, or abrasives. No wipes, paper towels, or hygiene products."
			},
			{
				look: "Smell after a dump and a flush",
				action: "Put 3–5 gallons back in the tank. If the bowl will not hold water, or it leaks at the base, replace the bowl seal. Clear a blocked roof vent cap. A tank that still smells after that can be a leak, or buildup that needs a shop hydro-jet. Do not leave the black valve open at camp. Solids settle and the next dump will not wash them out."
			},
		],
		procedures: ["dump"]
	},
	{
		id: "tank-monitor",
		system: "Plumbing",
		title: "Tank monitor shows OPn, Sht, or a wrong level",
		blurb: "SeeLevel-style display. Read the label on the panel. Not every coach has one.",
		level: "watch",
		checks: [
			{
				look: "OPn on one tank",
				action: "Short the wires at that sender. If the display changes to Sht, that sender is bad or miswired. If it stays OPn, the wiring to that sender is open."
			},
			{
				look: "OPn on every tank",
				action: "Short the sender wires at the display. If it does not change to Sht, the display is bad. If it does, short the wires at the senders. No Sht there means the wiring is open. Sht there means the senders are bad. Check the fuse first."
			},
			{
				look: "Sht on the display",
				action: "The communications wire is shorted to ground. Unplug the senders one at a time. If Sht stays with every sender unplugged, disconnect the sender wire at the display. If it is still Sht, the display is bad."
			},
			{
				look: "Err, StA, nbo, or ntP",
				action: "Bad data or a mis-programmed sender. Use the code table for the model printed on the display."
			},
			{
				look: "CAL",
				action: "The display memory has failed. Replace the display. It is not a sender."
			},
			{
				look: "Display frozen",
				action: "Cut 12 V for a few seconds, then restore it."
			},
			{
				look: "A number when the tank is empty",
				action: "Tank-bottom shape, metal within about 2 inches of the sender, or buildup. Clean with an RV tank cleaner. Do not assume the sender is dead. Sender signal power is typically 50–60%. 20% is the minimum. The button sequence is in the manual for the display you have."
			},
			{
				look: "2015 Classic buttons",
				action: "Press a tank button to read it. Press it twice to hold the reading for 5 minutes. Pressing two buttons together opens the diagnostic functions."
			}
		]
	},
	{
		id: "no-hot-tank",
		system: "Water heater",
		title: "No hot water — tank heater",
		blurb: "Tank heater with a drain plug: cold water only, or the relief valve weeps. Will not light. A Classic through 2016 is Atwood in these notes, not a Suburban.",
		level: "soon",
		checks: [
			{
				look: "Bypass valve position",
				action: "Normal use: inlet and outlet inline with the heater, bypass perpendicular. Winterize: bypass inline so water skips the heater. A bypass left inline is cold water only."
			},
			{
				look: "Drain plug and a full tank",
				action: "Install the plug and fill completely before you apply heat."
			},
			{
				look: "Electric side",
				action: "Check 120 V, the breaker, element continuity, and the high-limit reset."
			},
			{
				look: "Gas side",
				action: "Confirm LP, the igniter, and the thermostat. A technician cleans the orifice."
			},
			{
				look: "Anode and sediment",
				action: "Suburban tanks need an anode. Atwood and Dometic aluminum tanks do not — do not install one. Flush sediment."
			},
			{
				look: "Pressure relief valve",
				action: "A drip from the relief means replace the valve. Never plug or cap it. Weeping after heat often means sediment, or the tank was heated before it was full."
			},
			{
				look: "Atwood DSI tank",
				action: "It holds about 140 °F and comes back on near 115 °F. Heat-up is about 20–25 minutes. After a thermal cut-off, look for spiders or mud wasps in the burner tube before you fit a new cut-off. The wide aluminum band on the access-door grill belongs at the bottom. A red light after it has already heated can be a loose igniter ground."
			}
		],
		parts: ["anode"],
		procedures: ["anode"]
	},
	{
		id: "tankless",
		system: "Water heater",
		title: "Tankless is weak, cold, or cycling",
		blurb: "Truma AquaGo, Girard, or a Suburban tankless starts then quits. Read the label before you use a code.",
		level: "soon",
		checks: [
			{
				look: "Flow and pressure",
				action: "Open the hot tap fully and take the shower restrictors out. Do not use a shower pause button. Suburban's spec table says 0.7 GPM. The same manual's owner page, and Airstream's 2027 Globetrotter text, say 0.4 GPM. Girard boards start at 0.70 GPM, later changed to 0.60 GPM, both ±10%. AquaGo wants strong flow, about 0.9 GPM."
			},
			{
				look: "Air, altitude, and scale",
				action: "Clear the intake. Above about 3,500 ft, slow the flow. Descale yearly: Suburban kit 521163; AquaGo tablets only — not vinegar. E9 on an ST-65RL is air in the recirculation loop."
			},
			{
				look: "Error code on the panel",
				action: "Read the heater label. The same E-number means different things on a Suburban ST and an IW60. Before a service call on an ST: switch on, 12 V on, gas not empty, a faucet open, then the manual ECO reset. AquaGo reset is off, wait 5 seconds, on. Code 30 is printed as below 27 °F (3 °C), and those two numbers do not agree."
			},
			{
				look: "Stove flame dips when the heater fires (owner-reported)",
				action: "Have the LP regulator and pressure tested. Lock-up should be at or under 14 in. water column."
			},
			{
				look: "Pressure relief valve",
				action: "A tankless relief can open near 125 psi. High campground pressure or a failed inlet regulator will do it. Fit a regulator and retest. Never plug the valve."
			}
		],
		parts: ["descale", "st65", "iw60"],
		procedures: ["descale"]
	},
	{
		id: "alde",
		system: "Alde",
		title: "Alde not heating, noisy, or losing fluid",
		blurb: "Classic hydronic heat: cold coach, gurgling, or the glycol level drops.",
		level: "soon",
		fit: "classic",
		checks: [
			{
				look: "Glycol level, cold",
				action: "About 0.4 in (1 cm) above MIN when cold. Top up with Alde fluid only. The wrong fluid makes a white precipitate. Part 360371-301C (1 gal) or 360371-201C (5 gal)."
			},
			{
				look: "Pump speed and the plug icon",
				action: "About 2–2.5 is normal running; speed 5 is for a flush. A missing plug icon means no 120 V — check the breaker, GFCI, and the cord under the dinette."
			},
			{
				look: "Air in the loop",
				action: "Run speed 5 for about 15 minutes, or use the yellow air-gap valves. Bleed rear to front. TSB 170: fill the expansion tank to MAX with the same glycol, bleed, repeat until heat returns. 28RB bleeders differ from the 30 ft diagram — ask Airstream for your floor plan."
			},
			{
				look: "Alde Flow leak (3020)",
				action: "Short-cycling and wet carpet under the unit. A temporary bypass uses flex hose and a SharkBite. A 3030 Plus eliminates the Flow."
			},
			{
				look: "Air cushion and burner",
				action: "Every 10–14 days of use: pump OFF, open the heating-system safety/drain valve a few seconds (under the dinette). Power-cycle a dead burner and check fuses. A clogged exhaust stops the burner. Panel messages are in Fault codes."
			},
			{
				look: "2018 through early 2020 Classic",
				action: "Service Bulletin 180 replaced the fluid with glycol 360371-201C and added two grounds. On a used trailer, ask the dealer whether that was done."
			}
		],
		parts: ["glycol"],
		procedures: ["alde", "valves"]
	},
	{
		id: "furnace",
		system: "Furnace",
		title: "Furnace will not run, or lights then quits",
		blurb: "Truma Combi on a Basecamp 16 through 2022, a Basecamp 20XE, and a World Traveler. A Basecamp 20 uses a Suburban furnace. Read the label.",
		level: "soon",
		checks: [
			{
				look: "Truma Combi or VarioHeat code",
				action: "Match the code in Fault codes. On a US Combi, W 17 H is hot water with an empty tank, E 44 H is under 10.0 V, and E 43 H is over 16.4 V. W 45 H is 120 V or the overheat reset: heater off, then a pen in the hole left of the board cover until it clicks. E 112 H, E 202 H, and E 211 H are gas or overheat. E 212 H also covers a blocked intake or exhaust. AquaGo codes are a different list. E 607 H means more than 4 resets in 15 minutes. Wait 15 minutes."
			},
			{
				look: "Fuse and a power cycle",
				action: "Cycle the battery disconnect. Then read the board LED."
			},
			{
				look: "Blink code",
				action: "1 = airflow, 2 = flame sense, 3 = ignition lockout, steady = controller. On a Dometic DF only, 4 flashes is high voltage (about 16–17 V) and 5 flashes is low (about 8–9 V). Older AFMD boards do not have those two codes. A hard lockout clears by cycling the thermostat off for 10 seconds, then on. If the LP line has air, repeat up to 3 times. Gas-valve work is for a technician."
			},
			{
				look: "Sail switch and gas",
				action: "The sail switch must close. LP should be about 11 in. water column. A collapsed pigtail starves the furnace. Owners report pet hair on the sail switch: the fan runs 20–30 seconds and quits, and one flash is an airflow fault. That is owner-reported, not a factory step."
			},
			{
				look: "E1 on the thermostat",
				action: "Reseat the RJ11. A broken blue wire has shown up on some Classics. A call test jumps the blue wires at the furnace."
			},
			{
				look: "Ignites, then shuts off",
				action: "Flame sensor. A limit trip means a restricted return or a weak blower. A Suburban furnace that locks out now and then can be moisture in the LP. The service manual says drain the cylinder, blow the lines, check the regulator, then add 1/2 pint of methanol per 100 lb. Never fill past 80%. That is a propane-shop job. To isolate it, feed the furnace from a separate upright bottle."
			},
			{
				look: "Below about 40 °F",
				action: "Use the propane heater. On a Classic that is the Alde. On the other coaches it is the furnace. Do not use the heat strip or the heat pump as the cold-weather heater. Leave the LP on, leave power on, and leave the battery disconnect ON so the heater and the water-heater safeguard can run. At a freeze, winterize an idle coach. A heat strip is the Bambi and Basecamp backup. A heat pump is the backup from Caravel through Classic, and only while the outside air is warm enough."
			},
		],
		parts: ["furnace-pn"],
		procedures: ["furnace"]
	},
	{
		id: "ac",
		system: "Air conditioning",
		title: "Air conditioner problems",
		blurb: "Will not start, blows warm, drips inside, or trips the breaker. Will not cool.",
		level: "soon",
		checks: [
			{
				look: "A code on a Dometic thermostat",
				action: "CCC2 E1 is a lost connection. E7 is no 120 V at the roof. E8 and E9 are DIP switches both on. No DC at the control is a PTC, not a fuse: clear the short, then disconnect DC positive for 30 seconds. Single-zone E1–E5 are in Fault codes. Read the thermostat label. A Globetrotter 9420 is the Coleman list, not this one."
			},
			{
				look: "CCC2 acts randomly, and there is no E-code",
				action: "Turn the thermostat off. Hold Mode and Zone until it says IniT. Then turn it on. A single-zone thermostat is different: off, hold Mode and + until it shows two dashes, then press Mode once. Factory defaults are heat 68 °F and cool 72 °F."
			},
			{
				look: "Filters, coils, and the drain",
				action: "Clean them. Thaw an iced coil completely before you restart. Never caulk the interior ceiling opening — clear the drain instead. On a Stetson, keep at least three ceiling vents open. Closing them all can freeze the coil."
			},
			{
				look: "Heat pump in the cold",
				action: "A Flying Cloud heat pump locks out below about 25 °F. Use the furnace, or heat pump plus furnace. A Stetson heat pump is only useful above about 45 °F. Academy’s rule for the whole line is simpler: once it is under about 40 °F, heat with the furnace."
			},
			{
				look: "Starts, then quits",
				action: "A failing capacitor is common. It must be within 10% of the rating printed on it. Power off and short the terminals before you touch it. A site under about 103.5 V or over 126.5 V will also make it quit. Wait about 2 minutes before a restart. If the overload opened, let it cool 15–20 minutes."
			},
			{
				look: "Compressor runs but the air is warm",
				action: "Reversing valve, low charge, or a weak capacitor — that is a technician job."
			},
			{
				look: "E1",
				action: "Reseat the RJ11 plugs at the roof boards."
			},
			{
				look: "Nothing runs on a rear unit",
				action: "Owners have found the wire insulation rubbed through where it crosses sheet metal. That matches the manufacturer's wiring check. Confirm the unit has 120 V before you open the shroud."
			},
			{
				look: "Breaker trips with the water heater on",
				action: "Switch the water heater to gas. A 2024 Trade Wind soft-start smell or heat is recall 24V-656 — stop using it."
			}
		],
		parts: ["ac-filter"],
		procedures: ["ac-filter"]
	},
	{
		id: "fridge",
		system: "Refrigerator",
		title: "Fridge warm, or freezing food",
		blurb: "12 V compressor fridge: freezer cold and the fridge warm is a known pattern. Will not cool.",
		level: "soon",
		checks: [
			{
				look: "Before a trip",
				action: "Pre-cool at least 12 hours. A normal box is about 34–40 °F. The Bambi manual suggests a setting of 3–4."
			},
			{
				look: "Norcold 12 V: freezer cold, fridge warm",
				action: "Often the control board or the evaporator fan. Pulling a fuse is only a temporary workaround. A new board is the lasting fix. Owners also check the eyebrow board behind the top panel and keep the rear vents clear (owner-reported). Do not run both compartments at 5, and confirm the door latch is not on the storage/vent tab."
			},
			{
				look: "Norcold N8 or N10: dark blue light, or it quits",
				action: "It starts around 10.9 V, shuts off around 10.4 V, and comes back around 11.8 V. A dark blue light is the fuse or reversed polarity, not the compressor. Above about 110 °F outside it can shut off near 212 °F and restart under 176 °F. Airstream parts books name a Norcold on the 2019 and 2020 Nest. They do not name an N8 or N10 on a Classic or Globetrotter. Read the badge."
			},
			{
				look: "Absorption fridge (older Dometic)",
				action: "Level the trailer. An absorption fridge will not cool if it is off level, and its LP tanks stay closed while you are towing. A 12 V compressor fridge can run on the road. Check LP / AC / Auto, the exterior fuse, and the front board. Clean the burner and flue. It struggles above about 85 °F. An ammonia smell: turn it off, keep the doors closed, ventilate, close the LP, unplug 120 V, and leave. A CHECK lamp means gas ignition failed. Press the main power button off, then on. After a new tank it can take 3 or 4 tries. Do not keep resetting it. A 2-way control fuse is not replaceable: fix the cause, then off, wait 5 seconds, on. The AC heater fuse is a 5 A, and only after the cord is unplugged and the 12 V wires are off."
			},
			{
				look: "Seals, vents, yellow residue",
				action: "Door seals and blocked vents first. Yellow residue can be a cooling-unit leak — stop and call a pro."
			},
			{
				look: "Freezes food",
				action: "Thermostat or thermistor. Secop/Danfoss flash codes are in Fault codes if your unit has that LED. A Dometic 12 V DMC that looks dead: check the cord and breaker, then hold the mode button for 3 seconds. Defrost with the food out and the fridge off. Use dry towels and warm pans of water. Do not use a hair dryer or a sharp tool."
			}
		],
		parts: ["fridge", "rm-igniter"]
	},
	{
		id: "brakes",
		system: "Running gear",
		title: "Brakes weak, grabby, or uneven",
		blurb: "Do not tow with brakes that fail to stop the trailer.",
		level: "stop",
		checks: [
			{
				look: "7-way, breakaway, and controller gain",
				action: "Connect the plug, test the breakaway (pin out no more than 20–30 seconds), and synchronize the controller per Dexter."
			},
			{
				look: "Wheel spin and magnet amps",
				action: "All wheels should lock similarly. Expect about 3 A per magnet — confirm against the Dexter chart for your brake size."
			},
			{
				look: "Adjustment and drag",
				action: "Star-wheel adjust if the brakes are not self-adjusting. After a drive, drums should be warm, not one cold and one hot. Self-adjusting / Nev-R-Adjust brakes still need a yearly inspection. Manual brakes: adjust at 200 miles, then every 3,000."
			},
			{
				look: "One side dead, or weak after sitting",
				action: "One dead side is an open circuit. Weak after storage is often surface rust — several moderate stops. Lock-up can be an out-of-round drum (TSB)."
			},
			{
				look: "Grabs hard (owner and NHTSA pattern)",
				action: "Gain set too high makes brakes harsh. A 2023 Globetrotter complaint was a right-rear brake that would not release; the assembly replaced was Dexter K23-459-00. Verify by VIN before you order."
			}
		],
		parts: ["brakes", "magnet"],
		procedures: ["brakes", "breakaway"]
	},
	{
		id: "tires",
		system: "Running gear",
		title: "Tire wear, vibration, or sway",
		blurb: "Uneven wear, a shake, or the trailer will not track.",
		level: "stop",
		checks: [
			{
				look: "Inside-edge wear",
				action: "Alignment. Spec on 2025–27 Classic and Globetrotter: toe-in 1/16 in each side (±1/8 in), camber 3/4° positive (±3/4°). Dexter will not weld torsion axles."
			},
			{
				look: "Vibration or one tire wearing",
				action: "Pressures, tongue weight, a bent axle, worn torsion arms, loose U-bolts, or bearing play."
			},
			{
				look: "Sway",
				action: "Set the weight-distribution hitch, hold about 10–15% tongue weight, and match tire pressures. Do not stab the brakes or the throttle while correcting."
			},
			{
				look: "Age and pressure",
				action: "Last four digits of the DOT code are week and year. Replace at 5 years. Check cold (idle at least 3 hours). Inflate for the load, not blindly to the max on the spec chart."
			}
		],
		procedures: [
			"tires",
			"lugs",
			"jack"
		],
		parts: ["tires"]
	},
	{
		id: "bearing",
		system: "Running gear",
		title: "Bearing noise or a hot hub",
		blurb: "Stop. A failing hub can destroy the spindle.",
		level: "stop",
		checks: [{
			look: "Which hub do you have?",
			action: "Nev-R-Lube is the 2027 spec on Caravel, Flying Cloud, International, Globetrotter, Classic, Trade Wind, Frank Lloyd Wright, and Stetson. Do not grease those. End play 0.001–0.010 in. Inspect at tire rotation or yearly / 12,000 miles. Cartridge replacement is a Dexter technician job."
		}, {
			look: "E-Z Lube or a conventional hub",
			action: "Repack at 12 months or 12,000 miles. The 2027 Bambi, Basecamp, and World Traveler manuals specify this service — only if the hub on the trailer is actually the serviceable type. Do not grease a Nev-R-Lube cartridge."
		}],
		procedures: ["bearings"],
		parts: ["nev-r-lube", "bearings"]
	},
	{
		id: "lp",
		system: "Propane",
		title: "Weak flame, smell, or the LP alarm",
		blurb: "If you smell propane, stop. Shut the cylinders. Ventilate. Do not reset the alarm until you find the source.",
		level: "stop",
		checks: [
			{
				look: "Smell or an alarm",
				action: "Put out every flame. Do not touch a switch. Close the tank valves, or use the detector’s remote shutoff. Open the door and windows and leave until the smell is gone. A detector alarm means do not go back in until a technician clears it. The alarm is a beep about every 5 seconds under 25% of the explosive limit. It uses a 1 A fuse and will not detect gas under about 8 V. Leave it connected in storage, or it can false-alarm for hours when power returns. Find a leak with soapy water. Never use a flame."
			},
			{
				look: "Weak flame at the stove",
				action: "Confirm the tank valves are open and the regulator knob points at a full tank, green and staying green. Bleed air by lighting the main burner until the flame is steady. If the excess-flow valve tripped because the tank was opened too fast: valves off, flames out, wait 3–5 minutes, reopen slowly, then wait at least 15 seconds before lighting. If it tripped from a leak, leave it shut. Pressure should be about 11 in. water column; lock-up at or under 14."
			},
			{
				look: "A quick-connect appliance",
				action: "Remove that appliance's own regulator or it will starve."
			},
			{
				look: "Regulator age",
				action: "Plan on replacement around 8–10 years. Check the 2021 Winntec recall if that regulator is fitted. Keep the regulator vent clear."
			}
		],
		parts: ["lp-reg"],
		procedures: ["lp-test"]
	},
	{
		id: "cooktop",
		system: "Propane",
		title: "Cooktop will not light, or the flame is wrong",
		blurb: "No flame, a flame only halfway around the burner, or a lazy orange flame.",
		level: "soon",
		checks: [
			{
				look: "It will not light",
				action: "Push the knob in and turn it fully. Open the LP supply. Hold the knob until the flame stays. Clean the ports with a small wire. A weak flame at every burner is the LP check, not the cooktop."
			},
			{
				look: "Flame only halfway around",
				action: "Dry the burner and clean the ports. A wet or clogged port leaves half the ring dark."
			},
			{
				look: "Orange flame",
				action: "Let it run a few minutes. It should turn blue. A slight orange near the coast is normal. A flame that lifts off the burner is pressure too high. A lazy yellow flame that stays is a pressure or air problem. Furrion wants about 10–13.8 in. water column. Atwood wants about 11 in. with two appliances running."
			},
			{
				look: "Oven pilot will not stay lit",
				action: "Hold the knob in for at least 30 seconds. The thermocouple has to sit in the flame. Clean a blocked pilot orifice with a toothpick. Uneven baking: leave about 1 inch of clearance, clear the vents, and preheat 15 minutes."
			}
		],
		parts: ["lp-reg"],
		procedures: ["lp-test"]
	},
	{
		id: "leaks",
		system: "Leaks",
		title: "Water leaks or a soft floor",
		blurb: "Find the source before the plywood goes.",
		level: "stop",
		checks: [
			{
				look: "Plumbing or rain?",
				action: "A plumbing leak shows up on a dry day, or as a floor puddle, and stops when the water is off. A rain leak shows above counter height, or after rain, snowmelt, dew, or a wash. Check P-traps, then the roof sealant."
			},
			{
				look: "Roof first",
				action: "Vents, skylights, fan flanges, and loose rivets. Sikaflex 221 or Adseal at fixtures. Most roofs are not a walking surface — use the stepped areas."
			},
			{
				look: "Hidden paths",
				action: "Double-wall shells move water away from the entry point. Check the rear bumper storage lids and, if needed, drop the belly pan."
			},
			{
				look: "Soft floor",
				action: "Stop using that area, probe it, and find the source. Dry a wet spot within a day or two. Mold can start in about 48 hours. A small dry spot can be dried and epoxied. Large areas are a specialist job. A moisture meter once a year is worth it. Keep indoor humidity at or under 60%, and about 35% when it is cold. A stove puts about a gallon of water vapor into the air for each gallon of propane, so run a fan."
			}
		],
		parts: ["sealant"],
		procedures: ["sealant"]
	},
	{
		id: "door",
		system: "Body & gear",
		title: "Door hard to latch, or it will not close",
		blurb: "Very often the trailer is twisted, not the lock.",
		level: "watch",
		checks: [
			{
				look: "Level and the stabilizers",
				action: "An out-of-level trailer twists the shell. The door is slightly over-bent on purpose so it seals. Check the fit before and after you lower the stabilizers. Stabilizers are not for leveling."
			},
			{
				look: "Striker and the screen door",
				action: "The striker bolt is adjustable. A rubbing screen door can push the main door. Dry graphite in the locks; paraffin or grease in the striker pockets."
			},
			{
				look: "Sheared rivets",
				action: "Rivets sheared on the interior door skin mean the door came open in the wind. Repair before the next trip."
			},
			{
				look: "Upper lock jammed shut",
				action: "Reported on a 2021 Globetrotter. Keep the escape window as a second exit and service a stiff lock immediately."
			}
		],
		parts: ["striker"],
		procedures: ["lube"]
	},
	{
		id: "awning",
		system: "Body & gear",
		title: "Awning stuck or will not retract",
		blurb: "Zip Dee manual, Relax, or a Lippert Solera.",
		level: "soon",
		checks: [{
			look: "Manual override",
			action: "Use the manual retraction procedure for that awning. Never force a power awning. After a power cut, a Flying Cloud power awning does a close and reset: the arms lower fully, then retract. Press retract once more to finish."
		}, {
			look: "Arms and fabric",
			action: "Silicone on manual arms and on Zip Dee pivots. Not WD-40 or grease on a Zip Dee. White lithium in power-awning pivot holes. Hose it monthly with water only. A deep clean every 2–3 years. In a light rain, lower one arm so water runs off. Roll it in for wind or heavy rain."
		}],
		procedures: ["lube"]
	},
	{
		id: "fan-jack",
		system: "Body & gear",
		title: "Fan dead, jack dead, or step will not lock",
		blurb: "Roof fan, tongue jack, or the entry step.",
		level: "watch",
		checks: [
			{
				look: "Fantastic or MaxxAir fan",
				action: "Check 12 V and the fuse at the fan and in the power center. The fan is built to blow that fuse if a blade jams. A rain sensor closes the lid when it is wet. Close the lid before you tow. Wind can tear it off. In storage you can crack the lid if no rain is coming, but do not leave the fan running. A lid that will not close is often a lift arm that opens too far and breaks the plastic tabs (owner-reported). 2026 MaxxAir N-Series fans can be recall 26V-401 / 26E-036 — smoke means stop. See Recalls. Once a year, wash the screen, and put 303 on the lid gasket."
			},
			{
				look: "Tongue jack only",
				action: "Ground at the three A-frame bolts, and loosen then retighten the head so it grounds to the post. Check the 30 A spade fuse in the battery box. Once a year, grease the drive-pin coupling with a high-melting-point grease. Mobilith SHC 460 or the equivalent on the gears. Never pour oil down the post. Pause between up and down so the breaker does not trip. Manual crank: unscrew the level cap, counterclockwise raises, clockwise lowers. Do not run the switch with the crank in, and do not get under the trailer when only the jack is holding it."
			},
			{
				look: "Folding step will not lock up",
				action: "Clean and dry-lube the rubbing surfaces. Sliding pins should drop in. Look for a bent part or a loose connector."
			}
		],
		parts: ["jack"],
		procedures: ["lube", "jack"]
	},
	{
		id: "app",
		system: "Electrical",
		title: "MyAirstream app will not pair",
		blurb: "2025 and newer Classic: “no communication” or the app will not connect.",
		level: "watch",
		fit: "classic",
		checks: [
			{
				look: "Loose DC connections (owner-reported)",
				action: "One 28RB owner cleared “no communication” by reseating panel connectors and tightening loose DC wires."
			},
			{
				look: "Pairing mode (owner-reported)",
				action: "Under the closet, right-hand panel: hold the button on the module with the blue light for about 30 seconds. Reboot the display with the 24/7 key. Force-quit the app. Use the app named MyAirstream."
			},
			{
				look: "Used trailer or Wi-Fi (owner-reported)",
				action: "The system registers to one owner — email Airstream support to release the previous owner. Members say first pairing is the coach LTE modem plus Bluetooth, not campground Wi-Fi."
			}
		]
	},
	{
		id: "victron",
		system: "Electrical",
		title: "Victron, Cerbo, or inverter display errors",
		blurb: "2024 and newer power centers. Shunt, firmware, or a hot cabinet.",
		level: "soon",
		checks: [
			{
				look: "Shunt wiring and firmware",
				action: "Power-cycle the way Victron describes. Every negative has to pass through the shunt or the state of charge lies. Update firmware in VictronConnect. A dealer job if it is still under warranty. Forum-reported on 2024–25 units."
			},
			{
				look: "Inverter overheating",
				action: "An aftermarket MultiPlus stuffed in a closed cabinet will shut down. Victron wants real airflow around the unit. Clear the vents before you keep resetting it."
			},
			{
				look: "PD inverter on a Globetrotter",
				action: "E-1 low battery, E-2 high battery, E-3 overload, E-4 temperature, E-5 internal, E-6 short, E-7 DC cables. Hold the remote power button about 5 seconds to actually turn it off. A buzz under 2 seconds when the fridge starts is normal."
			}
		]
	},
	{
		id: "window-stuck",
		system: "Body & gear",
		title: "Window will not open",
		blurb: "Do not force a stuck seal.",
		level: "watch",
		checks: [{
			look: "Unlatch, then ease the seal",
			action: "Wait a minute. Then work a plastic card between the glass and the rubber from outside. A nylon wedge with 303 Protectant, starting at a corner, is the other way. Then clean and treat the seal. Forcing a dry seal tears it. A dealer says Airstream recommends 303, and a little olive oil only if you do not have 303."
		}]
	},
	{
		id: "no-tv",
		system: "Electrical",
		title: "No TV picture",
		blurb: "The antenna booster is the usual miss, not the set.",
		level: "watch",
		checks: [{
			look: "Booster and 12 V on the coax",
			action: "The booster is ON for the antenna and OFF for cable or satellite. Confirm 12 V at the antenna coax, and that the fittings are tight. Shore power can be fine and the set still dark if the booster is off."
		}]
	},
	{
		id: "footrest",
		system: "Body & gear",
		title: "Sofa footrest switch smells hot",
		blurb: "2021–25 Classic. This is a recall, not a lube job.",
		level: "stop",
		fit: "classic",
		checks: [{
			look: "Stop using the switch",
			action: "NHTSA 25V-143: the footrest switch wiring is underrated and can melt if the switch is held. Do not use it. The dealer installs a reverse relay at no charge. Built 5 Mar 2021 through 24 Feb 2025 on Classic 33, 30, and 28."
		}]
	},
	{
		id: "brakes-lights",
		system: "Running gear",
		title: "Brakes come on with the running lights",
		blurb: "The trailer drags as soon as the lights are on.",
		level: "stop",
		checks: [{
			look: "Light seals and the harness",
			action: "A 2021 Flying Cloud complaint traced this to water in the running lights corroding the harness. Inspect the seals and the harness before the next tow."
		}, {
			look: "One brake not releasing",
			action: "A 2023 Globetrotter dragged on one side. Dropping controller gain only hid it. The repair was a right-rear brake, Dexter K23-459-00 (12×2 in. 6K right-hand Nev-R-Adjust). Confirm the brake size against the VIN before you order."
		}],
		parts: ["brakes"]
	},
	{
		id: "alde-cold",
		system: "Alde",
		title: "Alde is hot, but the coach stays cold",
		blurb: "The boiler reaches its set temperature and the living space does not. Airstream TSB 170.",
		level: "soon",
		fit: "classic",
		checks: [
			{
				look: "Expansion tank, cold",
				action: "On a 30 ft Classic the tank is behind a false panel above the toilet. Fill to MAX with the same glycol. Do not overfill. Airstream glycol is 360371-100 (1 qt) or 360371-200 (5 gal). Distilled water is only a short-term emergency — it can freeze."
			},
			{
				look: "Air in the loop",
				action: "Run the circulation pump about 15 minutes, stop, and bleed. Repeat until heat actually reaches the convectors."
			},
			{
				look: "Used 2018 to early 2020 Classic",
				action: "Bulletin 180: fluid changed to 360371-201C and two grounds added. Ask whether a dealer already did it."
			}
		],
		parts: ["glycol"],
		procedures: ["alde"]
	},
	{
		id: "st-hot",
		system: "Water heater",
		title: "Suburban tankless: no hot water, or hot then cold",
		blurb: "ST-65RL and the same family. Will not light. These steps are not the IW60 steps.",
		level: "soon",
		checks: [
			{
				look: "Flow too low to fire",
				action: "The Suburban spec table says at least 0.7 GPM and no more than 3.0. The same manual's owner page, and the 2027 Globetrotter text, say 0.4 GPM. Open the hot tap fully, take the shower restrictors out, and do not use the shower pause or trickle button. These ST steps are not the IW60 steps."
			},
			{
				look: "It needs more than about 0.5 GPM, then cycles",
				action: "Cold is crossing into the hot line. A shower pause button or an open winterize bypass does that. Close the bypass."
			},
			{
				look: "Supply",
				action: "Water 30–150 psi. LP 10.5–14 in. water column. 10.5–14 V DC at the heater."
			},
			{
				look: "No ignition",
				action: "Check LP and 12 V, then the ECO high-limit manual reset. Look for soot and a blocked vent."
			},
			{
				look: "Scale",
				action: "Descale yearly with kit 521163. The relief valve opens at 125 psi — do not plug it."
			},
			{
				look: "Lukewarm water and the stove flame dips",
				action: "On a 2022 Globetrotter this was a failing LP regulator. Have the regulator and the pressure tested. Owner-reported."
			}
		],
		parts: ["descale", "st65"],
		procedures: ["descale"]
	},
	{
		id: "fan-lid",
		system: "Body & gear",
		title: "Fantastic Fan lid will not close",
		blurb: "Plastic lid tabs broken. Reported on 27FB and other floor plans.",
		level: "watch",
		checks: [{
			look: "Lift arm opens too far",
			action: "Owners say the arm travels past the lid and snaps the plastic tabs. Fixes that have worked: a stop (a bolt or pads) so it cannot over-travel, and a new lid. Owner-reported."
		}]
	},
	{
		id: "step-lock",
		system: "Body & gear",
		title: "Folding step will not lock up",
		blurb: "The backflip step stays down or will not latch.",
		level: "soon",
		checks: [{
			look: "Pins, lube, and the connector",
			action: "Clean and dry-lube every rubbing surface. The sliding pins should drop into place. Look for a bent part. One 2025 Globetrotter had a loose connector. Owner-reported."
		}],
		procedures: ["lube"]
	},
	{
		id: "dinette",
		system: "Body & gear",
		title: "Dinette table wobbles",
		blurb: "Reported on 27FB tables.",
		level: "watch",
		checks: [{
			look: "The pedestal mount",
			action: "Owners added their own bracket, or replaced the post with a Springfield hydraulic pedestal. Owner-reported — not a factory procedure."
		}]
	},
	{
		id: "fes",
		system: "Body & gear",
		title: "Rivets popping, or a gap at the front seam",
		blurb: "Front locker rivets or a front-end separation gap. Do not just caulk it.",
		level: "stop",
		checks: [{
			look: "Front locker and the front seam",
			action: "Look for popped rivets and a seam that is opening. That pattern is front-end separation. Replace the rivets and have the seam inspected. Caulk alone hides it. Clean behind the rock guards every few washes. Blue threadlocker on the acorn nuts. A nut that spins without tightening means the bolt behind it is loose, and a rattling bolt can crack the front corner panel. Owner-reported."
		}],
		parts: ["rivets"],
		procedures: ["sealant"]
	},
	{
		id: "inverter-hot",
		system: "Electrical",
		title: "Inverter overheats or shuts down",
		blurb: "It quits under load, or the cabinet around it is hot.",
		level: "soon",
		checks: [{
			look: "Air around the inverter",
			action: "A 2023 Flying Cloud complaint was a dealer-installed Victron MultiPlus-II 3000 in a cabinet with no ventilation, against Victron’s rules. Any aftermarket install needs the airflow the maker specifies. Clear the vents, let it cool, then restart."
		}, {
			look: "PD code E-4",
			action: "Over-temperature on a Progressive Dynamics inverter clears when it cools. If E-1 cycles on and off, the batteries are tired or the DC cables are loose or undersized."
		}]
	},
	{
		id: "inverter-dead",
		system: "Electrical",
		title: "Inverter outlets are dead",
		blurb: "The other outlets work. Only the inverter outlets are dark.",
		level: "soon",
		checks: [{
			look: "Inverter switch and the battery disconnect",
			action: "Turn the inverter on. The disconnect has to be ON for the inverter to run. Then check battery voltage."
		}, {
			look: "Its own breaker and GFCI",
			action: "Reset the inverter fuse or breaker, then the GFCI. On one 2025 Globetrotter the breaker was under the curbside nightstand. On most newer trailers the path is panel, then inverter, then those outlets."
		}],
		parts: ["inverter"],
		procedures: ["lithium"]
	},
	{
		id: "pd-code",
		system: "Electrical",
		title: "Inverter shows an error code",
		blurb: "Progressive Dynamics PD1600. Read the label. The same numbers on a shore protector are pedestal faults.",
		level: "soon",
		checks: [
			{
				look: "E-1, low battery",
				action: "Under 10.5 V for several seconds. It restarts on its own near 12.0 V. Charge the bank. If E-1 keeps cycling, the batteries are near the end or the DC cables are loose or too small."
			},
			{
				look: "E-2, high battery",
				action: "Over 15.5 V. It clears under 15.0 V. Check the charger or solar controller."
			},
			{
				look: "E-3 or E-6, overload or a short",
				action: "Shed the loads. Press the power button to restart. E-6 means check the output wiring."
			},
			{
				look: "E-4, too hot",
				action: "It restarts when it cools. Clear the air around the inverter."
			},
			{
				look: "E-5 or E-7",
				action: "E-5 is an internal fault — check the remote harness. E-7 is DC voltage failing while it runs — check cable size and the connections. Hold power for 5 seconds to turn it off. A buzz under 2 seconds when the fridge starts is normal."
			}
		]
	},
	{
		id: "lithium-cold",
		system: "Electrical",
		title: "Lithium will not take a charge",
		blurb: "Shore power is on, but the bank stays flat once the nights are cold.",
		level: "soon",
		checks: [
			{
				look: "Battery temperature",
				action: "Factory lithium often will not charge below about 35 °F. Turn the battery heater on (red showing) when it will be that cold, and off for storage. Do not charge a lithium bank below 32 °F."
			},
			{
				look: "Voltage under about 11.5 V",
				action: "That is often a BMS cutoff. Apply shore power, or charge each battery, to wake it. A low-voltage disconnect should wake within about 24 hours."
			},
			{
				look: "Converter profile",
				action: "The converter has to be set for lithium. On shore power its output should sit around 13.6–14.0 V."
			}
		],
		parts: ["battery"],
		procedures: ["lithium"]
	},
	{
		id: "city-psi",
		system: "Plumbing",
		title: "City water is too strong, or a hose blows",
		blurb: "The hose jumps, the inlet weeps, or a fitting lets go after you hook up.",
		level: "soon",
		checks: [{
			look: "Campground pressure",
			action: "Owners have measured 80–100 psi, and it can change overnight. The 2027 manuals rate the factory inlet regulator at 50 psi. Manuals from 2014 through 2016 say 65 psi. 2017 through 2019 were not checked. A failed plastic regulator, on the inside wall behind the city inlet, can leak into the wall."
		}, {
			look: "An extra regulator at the spigot",
			action: "An adjustable regulator with a gauge, set near 50 psi, protects the hose. A cheap fixed regulator can starve a tankless heater. Turn the spigot off when you leave. Do not overfill the fresh tank."
		}],
		parts: ["city"]
	},
	{
		id: "toilet-bowl",
		system: "Plumbing",
		title: "Toilet bowl will not hold water",
		blurb: "The bowl drains itself. Common on Dometic 300, 310, and 320.",
		level: "watch",
		checks: [{
			look: "The flush-valve seal",
			action: "A slow leak at that seal is the usual cause. Rebuild it with the kit for that bowl. Keep the seal wet and close the lid."
		}, {
			look: "You are leaving the trailer",
			action: "A failed toilet valve on city water can flood the floor. Shut the city faucet off and use the tank and pump while you are away."
		}]
	},
	{
		id: "gray-shower",
		system: "Plumbing",
		title: "Gray water backs up into the shower",
		blurb: "The shower pan fills when the sink drains, then it slowly drops.",
		level: "soon",
		checks: [
			{
				look: "A brief gurgle versus a slow backup",
				action: "A short geyser when a full sink drains, with the gray valve closed, often clears in a minute. A backup that lingers, with the monitor jumping to full, points at a vent problem."
			},
			{
				look: "The vent and the level",
				action: "Look down the roof vent and clear a blocked pipe. Level the trailer. One owner’s backup stopped after the nose was raised. An uphill shower drain does the same thing."
			},
			{
				look: "What Airstream prescribed on one trailer",
				action: "A HepvO waterless valve after the sink P-trap stopped the small backups. It did not fix a blocked vent. On full hookups, leave the gray valve open."
			}
		]
	},
	{
		id: "relief",
		system: "Water heater",
		title: "Relief valve weeps or pops open",
		blurb: "Water drips from the heater relief. Do not cap it.",
		level: "soon",
		checks: [{
			look: "The valve itself",
			action: "Replace a weeping relief valve. Never plug it. On a tank heater, flush sediment and confirm the tank was full before you heated it."
		}, {
			look: "Pressure at the inlet",
			action: "A tankless relief can open near 125 psi. High campground pressure or a failed inlet regulator will do it. Fit a regulator and retest."
		}]
	},
	{
		id: "st-code",
		system: "Water heater",
		title: "Tankless shows an error code",
		blurb: "Read the heater label. An ST code and an IW60 code with the same number are different faults.",
		level: "soon",
		checks: [
			{
				look: "Which heater, then reset",
				action: "ST-65RL and IW60 are not the same table. Cycle 12 V, or the hot faucet. On an ST, also try the manual ECO reset. If the same code returns, stop."
			},
			{
				look: "ST-65RL",
				action: "E1 is no flame. E3 is the high limit. E5 is the fan. E6 is outlet water too hot. E8 is the pressure switch. E9 is air in the recirculation loop. En means it ran more than about 20 minutes. E0 and E4 are sensors. E7 is the gas-valve wire. EC is the controller link."
			},
			{
				look: "IW60",
				action: "E1 is no flame. E2 is flame lost. E3 is flame sensed before start. E4 is water over about 90 °C. E5 is the high limit. E6 is the air switch or the fan. E8 means replace the module, part 233232 in the service table. E7 and E9 are water sensors and can clear on their own. EC is the controller link. The 2025 Globetrotter book lists the ST-65RL, not an IW60."
			},
			{
				look: "Codes only at altitude",
				action: "2025 Globetrotter owners saw E-codes above about 4,500 ft. Slow the flow. Dealers have reprogrammed some control pads. That report is not a Suburban service bulletin."
			}
		],
		parts: ["st65", "iw60"],
		procedures: ["descale"]
	},
	{
		id: "alde-fault",
		system: "Alde",
		title: "Alde panel shows a fault",
		blurb: "Read the message before you reset. Cycling 12 V hides a leak.",
		level: "soon",
		fit: "classic",
		checks: [
			{
				look: "Overheat glycol, or overheat lockout",
				action: "Air in the loop, or the circulation pump. With the fluid cold, the expansion tank should be at least about 0.4 in above MIN. Bleed, let the glycol fall under 50 °C, then pull and reconnect 12 V once."
			},
			{
				look: "Gas failure",
				action: "Confirm propane is on (not butane in the cold). Cycle 12 V and turn gas back on at the panel. Light every burner: if the flames shrink, the supply is weak. Check the boiler fuse and that voltage is over 11 V. A clogged exhaust stops the burner."
			},
			{
				look: "Low battery",
				action: "The boiler stops under 10.8 V and starts again near 11 V. Other messages at the same time are from the low voltage. Charge first."
			},
			{
				look: "Window open",
				action: "A switch by the flue thinks a window is open. Gas stops. Electric heat still works. Shut the window."
			},
			{
				look: "Connector failure, or heater not found",
				action: "Check the red cable and the connectors on the boiler. Heater not found, fan failure, or a message that returns is a dealer job."
			},
			{
				look: "Overheat PCB, or panel failure",
				action: "Let a hot compartment cool, then cycle 12 V. Moisture in the panel: dry it. Do not keep resetting a message that comes straight back."
			}
		],
		parts: ["glycol"],
		procedures: ["alde"]
	},
	{
		id: "furnace-flash",
		system: "Furnace",
		title: "Furnace light is flashing",
		blurb: "Dometic DFMD board, as on the Globetrotter. Count the flashes.",
		level: "soon",
		checks: [
			{
				look: "Steady light",
				action: "The control board has failed. That is a hard lockout. Cycle the thermostat or the furnace switch once. If it stays on, the board needs service."
			},
			{
				look: "1 flash",
				action: "Limit switch or airflow. A soft lockout. Clear the return and the exhaust, then reset."
			},
			{
				look: "2 flashes",
				action: "Flame sense. Hard lockout. Gas-valve and burner work is for a qualified tech."
			},
			{
				look: "3 flashes",
				action: "Ignition lockout. Soft, and it retries in about an hour. Check LP and the sail switch. The board tries about three times first."
			},
			{
				look: "4 or 5 flashes",
				action: "4 is high voltage, about 16–17 V. 5 is low voltage, about 8–9 V. Both are soft. Fix the 12 V supply, then reset."
			}
		]
	},
	{
		id: "ac-drip",
		system: "Air conditioning",
		title: "Air conditioner drips inside",
		blurb: "Water comes through the ceiling opening, not just off the roof.",
		level: "soon",
		checks: [{
			look: "The drain path",
			action: "Clear the drain pan and the tube. Let an iced coil thaw all the way with the fan running. Never caulk the interior opening shut."
		}, {
			look: "Filters",
			action: "A packed filter ices the coil, and the melt comes inside. Clean the filter and the coils."
		}]
	},
	{
		id: "ac-warm",
		system: "Air conditioning",
		title: "Compressor runs, air stays warm",
		blurb: "You can hear it run. The air from the vents is not cold.",
		level: "soon",
		checks: [{
			look: "Filters, coils, and a frozen coil",
			action: "Clean them. If the coil is iced, thaw it fully before you call it a failed unit."
		}, {
			look: "It still blows warm",
			action: "A reversing valve, low charge, or a weak capacitor. Match the capacitor µF if you replace one, with power off and the terminals shorted. Charge work is for a tech."
		}]
	},
	{
		id: "ac-soft",
		system: "Air conditioning",
		title: "Soft start smells or gets hot",
		blurb: "2024 Trade Wind with the GE air conditioner. Stop using it.",
		level: "stop",
		checks: [{
			look: "Smell or heat at the soft start",
			action: "That is recall 24V-656. Stop using the air conditioner and contact Airstream or the dealer. Do not keep testing it."
		}]
	},
	{
		id: "ac-stat",
		system: "Air conditioning",
		title: "Thermostat light is not solid green",
		blurb: "Coleman-Mach status LED. Solid green means it is talking to the air conditioner.",
		level: "watch",
		checks: [
			{
				look: "Off, or solid red",
				action: "Off is no power or a failed thermostat. Solid red is offline. Check 12 V and the cable to the roof unit."
			},
			{
				look: "Fast or slow green",
				action: "Fast green (about 4 per second) is a first connection. Slow green (about 1 per second) means no valid message for 5 seconds."
			},
			{
				look: "Red/orange or green/orange",
				action: "Red/orange is offline and trying again. Green/orange has dropped offline more than once. Reseat the RJ11 at the roof boards, the same check as an E1 on the thermostat."
			}
		]
	},
	{
		id: "fridge-flash",
		system: "Refrigerator",
		title: "Fridge controller light is flashing",
		blurb: "Only if the fridge has a Secop or Danfoss BD unit with a diagnostic LED. Count the flashes. They repeat about every 4 seconds.",
		level: "soon",
		checks: [
			{
				look: "1 flash",
				action: "Battery protection. Voltage is outside the limits. Charge the bank and check the cables."
			},
			{
				look: "2 or 3 flashes",
				action: "2 is fan over-current or too many starts. 3 is a motor start error, a blocked rotor or high pressure. Clear the vents. If it repeats, it needs service."
			},
			{
				look: "4 or 5 flashes",
				action: "4 is overloaded, below minimum speed. 5 is the electronics too hot. Give it air and shade. Do not pack the compartment."
			},
			{
				look: "6 flashes",
				action: "The thermostat sensor has failed. That is a parts replacement, not a reset."
			}
		]
	},
	{
		id: "fridge-yellow",
		system: "Refrigerator",
		title: "Yellow residue behind the fridge",
		blurb: "A yellow stain at an absorption cooling unit. Treat it as a leak.",
		level: "stop",
		checks: [{
			look: "The cooling unit",
			action: "Yellow residue can mean the cooling unit is leaking. Stop using the fridge and have it checked. Do not keep running a leaking absorption unit."
		}]
	},
	{
		id: "sway",
		system: "Running gear",
		title: "The trailer sways",
		blurb: "It hunts or wags behind the tow vehicle. Do not stab the brakes or the throttle to straighten it.",
		level: "stop",
		checks: [{
			look: "While it is still moving",
			action: "Lift off the accelerator. Do not stomp the tow-vehicle brakes, and do not try to accelerate out of it. Apply the trailer brakes with the hand controller, gently, and hold the wheel as straight as you can. When it settles, stop and look. Do not go back to highway speed until you know why."
		}, {
			look: "Tongue weight and the hitch",
			action: "Target about 10–15% of trailer weight on the hitch. A weight-distribution hitch does not lower tongue weight. It shifts some of it toward the tow vehicle’s front axle. Measure hitch height with the trailer level: ground to the inside top of the coupler. Set the ball about 1/2 to 1 in higher so the truck can squat. Load about 60% of the cargo ahead of the axle center, and keep the sides even. Low tongue weight is the usual cause of sway."
		}, {
			look: "Tires and speed",
			action: "Set cold pressures from the placard. Ease off the throttle and steer straight. Do not brake hard, accelerate, or saw the wheel while it is still moving side to side. When a truck passes, a brief manual application of the trailer brakes can help. Do not brake the tow vehicle for that. Travel with the tanks full or empty, not half full, and do not add weight at the rear to cut tongue weight."
		}],
		procedures: ["tires"]
	},
	{
		id: "brakes-lock",
		system: "Running gear",
		title: "Brakes lock up or grab one wheel",
		blurb: "A wheel skids, or the trailer jerks when the controller comes in. Do not tow it that way.",
		level: "stop",
		checks: [
			{
				look: "The controller",
				action: "Gain set too high, or a controller that jumps straight to full output, feels grabby. Lower the gain and synchronize it the way Dexter describes."
			},
			{
				look: "One wheel",
				action: "A 2023 Globetrotter complaint was a right-rear brake that would not release. The repair was a Dexter assembly. Jack that wheel safely and see if it turns free with the controller off."
			},
			{
				look: "After a stop, the drums",
				action: "Lock-up that returns points at out-of-round drums. There is a service bulletin on that. Have the drums checked before the next tow."
			}
		],
		parts: ["brakes"],
		procedures: ["brakes"]
	},
	{
		id: "lp-alarm",
		system: "Propane",
		title: "The LP detector is alarming",
		blurb: "The alarm is sounding, or you smell gas. This is a stop.",
		level: "stop",
		checks: [
			{
				look: "First minute",
				action: "Open the doors and vents. Put out flames. Do not touch switches. Close the LP valves. Leave if the smell is strong."
			},
			{
				look: "Find it",
				action: "When the air is clear, search with soapy water only. Never a flame. A collapsed pigtail or a quick-connect that still has its own regulator will starve appliances, but a leak is the alarm’s job."
			},
			{
				look: "Reset",
				action: "Reset the detector only after you have found the source or confirmed there is no leak. Replace a detector that alarms with the tanks off and the air clear."
			}
		],
		procedures: ["lp-test"]
	},
	{
		id: "soft-floor",
		system: "Leaks",
		title: "The floor feels soft",
		blurb: "A spongy spot underfoot. Find the water before you cover it.",
		level: "stop",
		checks: [{
			look: "Stop and probe",
			action: "Do not keep walking it or lay new flooring over it. Probe the spot and find the source. A dry day that still drips is plumbing. Rain is the shell."
		}, {
			look: "How big",
			action: "A small dry area can be dried and repaired with epoxy. A large soft area needs a specialist. Check with a moisture meter once a year."
		}],
		procedures: ["sealant"]
	},
	{
		id: "shower-leak",
		system: "Leaks",
		title: "The shower leaks",
		blurb: "Water shows under or beside the pan, or the pan itself is cracked.",
		level: "soon",
		checks: [{
			look: "Run one fixture at a time",
			action: "Older Classics leaked from a cracked shower valve, a drain elbow with no support under the pan, or a failed seal. Run the shower alone, then the sink, and watch for the first drip."
		}, {
			look: "A cracked pan",
			action: "Gelcoat can repair a small crack. A crack that moves, or water under the pan, needs the pan out. Do not keep using it."
		}]
	},
	{
		id: "slide-leak",
		system: "Leaks",
		title: "A slide-out lets rain in",
		blurb: "Older Classic and Safari slides. Current trailers in this app do not have a slide.",
		level: "soon",
		checks: [
			{
				look: "Water on the slide roof",
				action: "Wind can drive rain under the slide awning. The top gasket does not wipe that roof as the room comes in. Squeegee the roof before you retract it."
			},
			{
				look: "The corner drain tubes",
				action: "Each front and rear corner of the slide frame has a small tube. Spiders and dirt block them. Clear the tube with a few feet of flexible wire. Hold the tube while you do it."
			},
			{
				look: "The seal and the caulk line",
				action: "Look with the slide in. One factory caulk line stopped an inch or two short where the slide roof tucks under the wall. A skylight or a loose top seal does the same drip."
			}
		],
		procedures: ["sealant"]
	},
	{
		id: "vent-fan",
		system: "Body & gear",
		title: "Roof fan will not run",
		blurb: "The dome is cracked open and the fan does nothing.",
		level: "watch",
		checks: [
			{
				look: "How far the lid is open",
				action: "Some fans will not run until the dome is open about 3 inches. Open it the rest of the way before you call the fan dead."
			},
			{
				look: "A rain-sensing lid",
				action: "Opening that lid by hand turns auto-close off. The fuse is a GMA 5 A fast-acting. Also check 12 V and the thermostat."
			},
			{
				look: "MaxxAir N-Series",
				action: "A lid that fails on a 2026 Classic with the N-Series fan can be recall 26V-401. Confirm the model and the build date before you ignore it."
			}
		]
	},
	 ...(extraSymptoms as Symptom[]),
]);

export function symptomById(id: string) {
 return symptoms.find((s) => s.id === id);
}
