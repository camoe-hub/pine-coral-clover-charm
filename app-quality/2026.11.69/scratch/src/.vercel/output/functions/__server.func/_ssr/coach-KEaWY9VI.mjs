//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/coach-KEaWY9VI.js
var tasks = [
	{
		id: "tires-cold",
		title: "Cold tire pressure and a walk-around",
		detail: "Idle at least 3 hours. Read the placard for the load. Look for cuts, bulges, and dry rot. Include the spare.",
		system: "Running gear",
		cadence: { type: "trip" },
		procedureId: "tires"
	},
	{
		id: "lugs-look",
		title: "Lug nuts and coupler",
		detail: "Lugs snug in the star pattern. Coupler latched, pin in, chains crossed under the tongue, breakaway lanyard on the truck.",
		system: "Running gear",
		cadence: { type: "trip" },
		procedureId: "lugs"
	},
	{
		id: "lights",
		title: "7-way lights and a short brake test",
		detail: "Running, turn, brake, and backup. Pull forward about 50 ft and confirm the controller. Escape window latches work. Detectors self-test.",
		system: "Running gear",
		cadence: { type: "trip" },
		procedureId: "breakaway"
	},
	{
		id: "sixty-day",
		title: "Escape window, GFCI, hitch, and battery water",
		detail: "Factory interval is 1,000 miles or 60 days, whichever comes first. Check escape-window latches and the upper hinge. Test the smoke alarm and the CO detector, and replace a battery that fails the test. Test each GFCI and write down the date (a Bambi manual asks for a monthly GFCI test). Look for loose hitch bolts or odd wear. Lead-acid only: check the water and top up with distilled water. Skip that water check on lithium — a 2027 Classic does not list it.",
		system: "Safety",
		cadence: {
			type: "miles",
			every: 1e3,
			alsoDays: 60
		},
		procedureId: "shore"
	},
	{
		id: "ac-filter",
		title: "A/C return-air filter",
		detail: "Pop the grille, rinse or air-blow, dry fully, reinstall. Every 2 weeks while the A/C is in use.",
		system: "Air conditioning",
		cadence: {
			type: "days",
			every: 14
		},
		procedureId: "ac-filter"
	},
	{
		id: "extinguisher",
		title: "Extinguisher gauge and tire pressure",
		detail: "Needle in the green. Disposable extinguishers are replaced 12 years after manufacture. Recheck cold tire pressure.",
		system: "Safety",
		cadence: {
			type: "days",
			every: 30
		}
	},
	{
		id: "awning-hose",
		title: "Hose off the awning",
		detail: "Rinse fabric and arms. Do not let it stay wet and rolled.",
		system: "Body",
		cadence: {
			type: "days",
			every: 30
		}
	},
	{
		id: "humidity-wash",
		title: "Wash the shell and check indoor humidity",
		detail: "Wash with the grain, in horizontal strokes. Keep indoor humidity at or under 60% (about 35% in a cold climate). A stove adds about a gallon of water vapor for each gallon of propane, so run a fan. Do not drop the thermostat 10 degrees at night in a closed coach. That fogs the glass. In storage, open cabinets and give the mattress some airflow.",
		system: "Body",
		cadence: {
			type: "days",
			every: 30
		},
		procedureId: "sealant"
	},
	{
		id: "glycol-level",
		title: "Alde glycol level (cold)",
		detail: "About 0.4 in above MIN. Alde fluid only. Every 1–2 months while you are using heat.",
		system: "Alde",
		cadence: {
			type: "days",
			every: 45
		},
		fit: "classic",
		procedureId: "alde"
	},
	{
		id: "air-cushion",
		title: "Alde hot-water air cushion",
		detail: "Every 10–14 days of Alde use. Pump OFF. Open the heating-system safety/drain valve a few seconds, then close it.",
		system: "Alde",
		cadence: {
			type: "days",
			every: 14
		},
		fit: "classic",
		procedureId: "alde"
	},
	{
		id: "breakaway",
		title: "Breakaway switch",
		detail: "Pull the pin, spray contact cleaner, oil the pin, reinsert within 20–30 seconds. Brakes must lock. Every 90 days.",
		system: "Running gear",
		cadence: {
			type: "days",
			every: 90
		},
		procedureId: "breakaway"
	},
	{
		id: "locks",
		title: "Locks, hinges, regulator vent",
		detail: "Dry graphite in locks. A little household oil on hinges, the LP-tank hold-down, and roof-vent elevator screws (not on a Globetrotter). On a Bambi, clean the exhaust-fan blades and wash the filter. On a Caravel, that same job is the range hood. Wipe oil off the aluminum. Regulator vent clear. 7-way sprayed. Hitch ball greased. Lube the main step. A World Traveler hitch jack is inspected here; it is not the Barker power jack.",
		system: "Body",
		cadence: {
			type: "days",
			every: 90
		},
		procedureId: "lube"
	},
	{
		id: "sealant",
		title: "Sealant inspection and wax",
		detail: "Spring and fall, and at winterize. Roof penetrations, windows, marker lights, seams. Clear-coat-safe wax such as Walbernize. 303 or olive oil on window gaskets — never petroleum.",
		system: "Body",
		cadence: { type: "season" },
		procedureId: "sealant"
	},
	{
		id: "belly",
		title: "Belly pan and tank pans",
		detail: "Owner practice, once a year. No factory interval was found. Look for gaps, torn rivets, and loose bolts on the tank pans. Do not seal the pan shut unless a dealer says to.",
		system: "Body",
		cadence: {
			type: "years",
			every: 1
		},
		procedureId: "sealant"
	},
	{
		id: "winterize",
		title: "Winterize the plumbing",
		detail: "Before a freeze. Blow out at the city inlet, or use the pink method. Bypass the heater first. The pressure cap depends on the model.",
		system: "Plumbing",
		cadence: { type: "season" },
		procedureId: "winterize"
	},
	{
		id: "rotate",
		title: "Rotate tires and inspect bearings",
		detail: "Every 10,000 miles or 6 months. Swap front and rear on the same side. Look at Nev-R-Lube end play. A Caravel is Nev-R-Lube, same as a Globetrotter. Lube the spare-carrier pivots. Silicone grease on the escape-window latches. 303 on window and door seals, except a World Traveler: that glass is acrylic and the manual calls for 3M silicone, not 303. On a 2027 Classic, update the TPMS gateway after a tire changes position.",
		system: "Running gear",
		cadence: {
			type: "miles",
			every: 1e4,
			alsoDays: 180
		},
		procedureId: "tires"
	},
	{
		id: "brakes-year",
		title: "Brakes, bearings, and the power jack",
		detail: "Inspect linings, magnets, drums, and wiring. Nev-R-Lube end play 0.001–0.010 in — do not repack those hubs. Bambi, Basecamp, and World Traveler manuals call for a yearly clean and repack; read the hub before you grease anything. Barker jack: high-melting-point grease on the drive-pin coupling. Do not pour oil down the post. Yearly or 12,000 miles.",
		system: "Running gear",
		cadence: {
			type: "miles",
			every: 12e3,
			alsoDays: 365
		},
		procedureId: "brakes"
	},
	{
		id: "house-year",
		title: "Battery terminals, cabinets, and the A/C coil",
		detail: "Yearly or 12,000 miles. Coupler and ball: every part should move freely. Replace a worn one. On a Classic, confirm the battery terminals are tight — that book does not call for petroleum jelly. On a flooded battery, clean, neutralize, and coat the posts with petroleum jelly. Silicone spray on cabinet latches, hinges, and slides. A/C condenser coil with the power off.",
		system: "Electrical",
		cadence: {
			type: "miles",
			every: 12e3,
			alsoDays: 365
		},
		procedureId: "ac-filter"
	},
	{
		id: "lp-year",
		title: "LP system check",
		detail: "Leak test with soapy water or a manometer. Regulator lock-up. Have tanks purged by the supplier. Gas-valve work is a technician job. On an Alde Classic, that includes the Alde.",
		system: "Propane",
		cadence: {
			type: "years",
			every: 1
		},
		procedureId: "lp-test"
	},
	{
		id: "lp-reg",
		title: "Replace the LP regulator",
		detail: "Plan on 8–10 years, sooner if it will not hold lock-up. No sealant on flare threads.",
		system: "Propane",
		cadence: {
			type: "years",
			every: 8
		},
		procedureId: "lp-test"
	},
	{
		id: "anode",
		title: "Water-heater anode and flush",
		detail: "Suburban tank models only — not tankless. 1-1/16 in socket. Replace the anode if it is more than about 75% gone. Tankless: descale instead (kit 521163).",
		system: "Water heater",
		cadence: {
			type: "years",
			every: 1
		},
		procedureId: "anode"
	},
	{
		id: "descale-year",
		title: "Tankless descale",
		detail: "Once a year if the heater is an ST, AquaGo, or Girard. Suburban kit 521163. AquaGo tablets only, not vinegar. This is not the tank anode.",
		system: "Water heater",
		cadence: {
			type: "years",
			every: 1
		},
		procedureId: "descale"
	},
	{
		id: "furnace-season",
		title: "Furnace vent and a test fire",
		detail: "Clear the exhaust of insect nests before the first cold night. A Dometic hard lockout is thermostat off for 10 seconds. A Truma code is a different list. Gas-valve work is a technician job.",
		system: "Furnace",
		cadence: { type: "season" },
		procedureId: "furnace"
	},
	{
		id: "alarms",
		title: "Alarm batteries",
		detail: "Test the LP/CO detector weekly, and after the coach comes out of storage. The 2025 International manual says replace the smoke alarm 10 years after purchase, and the LP/CO detector at the Replace By date, 5 years from manufacture. 2027 Bambi says replace the alarm batteries once a year. The International schedule only says as required.",
		system: "Safety",
		cadence: {
			type: "years",
			every: 1
		}
	},
	{
		id: "glycol-swap",
		title: "Alde glycol exchange",
		detail: "Every 2 years (5 years only if the fluid is Alde Premium G12 EVO). Dealer or Alde-trained tech. Never mix glycol types. 60% distilled water / 40% glycol.",
		system: "Alde",
		cadence: {
			type: "years",
			every: 2
		},
		fit: "classic",
		procedureId: "alde"
	},
	{
		id: "awning-deep",
		title: "Awning deep clean",
		detail: "Every 2–3 years, plus anytime it looks mildewed.",
		system: "Body",
		cadence: {
			type: "years",
			every: 3
		}
	},
	{
		id: "tires-replace",
		title: "Replace tires and the detectors",
		detail: "Tires at 5 years from the DOT date, even with tread left. Smoke and LP/CO detectors at 5 years.",
		system: "Running gear",
		cadence: {
			type: "years",
			every: 5
		},
		procedureId: "tires"
	},
	{
		id: "cylinders",
		title: "LP cylinder requalification",
		detail: "12 years from manufacture, then on the interval stamped on the cylinder.",
		system: "Propane",
		cadence: {
			type: "years",
			every: 12
		}
	},
	{
		id: "retorque",
		title: "Re-torque after a wheel change",
		detail: "Star pattern at 5, 10, 25, and 50 miles. Not an impact wrench for the final pass.",
		system: "Running gear",
		cadence: { type: "trip" },
		procedureId: "lugs"
	}
];
function cadenceLabel(c) {
	switch (c.type) {
		case "trip": return "Every trip";
		case "days": return c.every === 14 ? "Every 2 weeks" : c.every === 30 ? "Monthly" : c.every === 45 ? "Every 1–2 months" : c.every === 90 ? "Every 90 days" : `Every ${c.every} days`;
		case "miles": {
			if (!c.alsoDays) return `Every ${c.every.toLocaleString()} mi`;
			const also = c.alsoDays === 60 ? "60 days" : c.alsoDays >= 365 ? "year" : c.alsoDays === 180 ? "6 months" : `${c.alsoDays} days`;
			return `Every ${c.every.toLocaleString()} mi or ${also}`;
		}
		case "season": return "Spring & fall";
		case "years": return c.every === 1 ? "Yearly" : c.every === 8 ? "Every 8–10 years" : `Every ${c.every} years`;
	}
}
var lug = "Aluminum 110 ft-lb · steel spare 100 ft-lb";
var ball = "2-5/16 in";
var st = {
	tire: "ST225/75R15",
	psi: "80 psi max cold",
	load: "2,830 lb"
};
var lt16 = {
	tire: "LT225/75R16",
	psi: "80 psi max cold",
	load: "2,680 lb"
};
function m(row) {
	return row;
}
/** 2027 owner's-manual specs. Your weight sticker governs. Earlier years: confirm in that year's manual. */
var models = [
	m({
		id: "b16",
		family: "Bambi",
		short: "16RB",
		name: "Bambi 16RB",
		alde: false,
		length: "16' 3\"",
		ubw: "3,150 lb",
		hitch: "475 lb",
		gvwr: "3,500 lb",
		ncc: "350 lb",
		fresh: "23",
		gray: "30 combined",
		black: "with gray",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Two 12 V batteries in a box behind the LP tanks. The power center auto-detects lead-acid, AGM, or lithium.",
		drains: "Same as Caravel 16RB: brass system drains and a stainless tank drain on the underbelly, roadside. Pump under the galley.",
		lug
	}),
	m({
		id: "b20",
		family: "Bambi",
		short: "20FB",
		name: "Bambi 20FB",
		alde: false,
		length: "20' 7\"",
		ubw: "3,900 lb",
		hitch: "600 lb",
		gvwr: "5,000 lb",
		ncc: "1,100 lb",
		fresh: "23",
		gray: "30",
		black: "18",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Two 12 V batteries in a box behind the LP tanks. The power center auto-detects lead-acid, AGM, or lithium.",
		drains: "Same as Caravel 20FB: internal low-point drains under the front dinette seat panel; stainless tank drain on the underbelly, roadside. Pump under the roadside dinette seat nearest the lavatory.",
		lug
	}),
	m({
		id: "b22",
		family: "Bambi",
		short: "22FB",
		name: "Bambi 22FB",
		alde: false,
		length: "21' 11\"",
		ubw: "3,850 lb",
		hitch: "500 lb",
		gvwr: "5,000 lb",
		ncc: "1,150 lb",
		fresh: "23",
		gray: "30",
		black: "17",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Two 12 V batteries in a box behind the LP tanks. The power center auto-detects lead-acid, AGM, or lithium. Tankless water heater.",
		drains: "Same as Caravel 22FB: internal drains under the bottom wardrobe shelf; stainless tank drain on the underbelly, roadside. Pump under the roadside wardrobe. Winterization kit under the galley.",
		lug
	}),
	m({
		id: "bc16",
		family: "Basecamp",
		short: "16X",
		name: "Basecamp 16X",
		alde: false,
		length: "16' 3\"",
		ubw: "—",
		hitch: "—",
		gvwr: "3,500 lb",
		ncc: "—",
		fresh: "21",
		gray: "—",
		black: "24",
		tire: "ST235/75R15",
		psi: "Placard / sidewall",
		load: "—",
		ball,
		ballHeight: "See Specifications",
		blowPsi: "50 psi max",
		powerCenter: "Through 2022 the parts books name a Truma Combi Eco Plus, not a Suburban heater. The 2026 book drops Truma for a Dometic 12,000 BTU furnace and a Suburban IW60. Coleman-Mach. Nova Kool from 2020. Progressive Dynamics power center in the 2022 and 2026 books. Weights left blank here disagree between listings. Read the sticker.",
		drains: "Confirm the low points in that year’s book. This is not the 20X layout.",
		lug
	}),
	m({
		id: "bc20",
		family: "Basecamp",
		short: "20X",
		name: "Basecamp 20X",
		alde: false,
		length: "20' 2\"",
		ubw: "3,500 lb",
		hitch: "535 lb",
		gvwr: "4,300 lb",
		ncc: "800 lb",
		fresh: "23",
		gray: "28",
		black: "21",
		tire: "LT235/85R16",
		psi: "80 psi max cold",
		load: "3,042 lb",
		ball,
		ballHeight: "22.75 in",
		blowPsi: "50 psi max",
		powerCenter: "Open the bench seat or the panel under the roadside bench for the pump. Confirm the labeled power center in the 2027 manual.",
		drains: "Insulated galvanized tank pan, roadside: brass low-point drains and a stainless fresh-tank drain. The water heater has its own drain.",
		lug
	}),
	m({
		id: "bcxe",
		family: "Basecamp",
		short: "20XE",
		name: "Basecamp 20XE",
		alde: false,
		length: "20' 2\"",
		ubw: "3,750 lb",
		hitch: "506 lb",
		gvwr: "4,500 lb",
		ncc: "750 lb",
		fresh: "23",
		gray: "28",
		black: "21",
		tire: "LT235/85R16",
		psi: "80 psi max cold",
		load: "3,042 lb",
		ball,
		ballHeight: "22.75 in",
		blowPsi: "50 psi max",
		powerCenter: "Victron MultiPlus-II, 810 Ah Battle Born, 600 W solar. A 400 A main inlet fuse protects the 12 V system. Set the shore limit to 10 A on a household outlet, 30 A at a campground. Do not tow with the 24-hour breaker tripped. The breakaway brakes will not work.",
		drains: "Pump under the roadside bench: cushions off, hinged boards out, lift the access board. Combination furnace and water heater.",
		lug
	}),
	m({
		id: "cv16",
		family: "Caravel",
		short: "16RB",
		name: "Caravel 16RB",
		alde: false,
		length: "16' 7\"",
		ubw: "3,450 lb",
		hitch: "520 lb",
		gvwr: "4,300 lb",
		ncc: "850 lb",
		fresh: "23",
		gray: "30 combined",
		black: "with gray",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Pump under the galley. Pull the access panel at the back of the lower cabinet.",
		drains: "Brass system drains and a stainless tank drain on the underbelly, roadside.",
		lug
	}),
	m({
		id: "cv19",
		family: "Caravel",
		short: "19CB",
		name: "Caravel 19CB",
		alde: false,
		length: "19' 1\"",
		ubw: "—",
		hitch: "—",
		gvwr: "—",
		ncc: "—",
		fresh: "—",
		gray: "—",
		black: "—",
		tire: "Read the tire placard",
		psi: "Placard / sidewall",
		load: "—",
		ball,
		ballHeight: "See Specifications",
		blowPsi: "50 psi max",
		powerCenter: "Not in the 2027 spec set used for the other Caravels. Confirm the power center in that year’s manual.",
		drains: "Rear-corner bed and rear-corner bath. Not the 16, 20, or 22 layout. Confirm the low points in that year’s manual.",
		lug: "Confirm torque in your manual."
	}),
	m({
		id: "cv20",
		family: "Caravel",
		short: "20FB",
		name: "Caravel 20FB",
		alde: false,
		length: "21'",
		ubw: "4,200 lb",
		hitch: "630 lb",
		gvwr: "5,000 lb",
		ncc: "800 lb",
		fresh: "23",
		gray: "30",
		black: "18",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Pump under the roadside dinette seat nearest the lavatory.",
		drains: "Internal low-point drains under the front dinette seat panel. Stainless tank drain on the underbelly, roadside.",
		lug
	}),
	m({
		id: "cv22",
		family: "Caravel",
		short: "22FB",
		name: "Caravel 22FB",
		alde: false,
		length: "22' 2\"",
		ubw: "4,175 lb",
		hitch: "525 lb",
		gvwr: "5,000 lb",
		ncc: "825 lb",
		fresh: "23",
		gray: "30",
		black: "17",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Pump under the roadside wardrobe. Winterization kit under the galley.",
		drains: "Internal drains under the bottom wardrobe shelf. Stainless tank drain on the underbelly, roadside.",
		lug
	}),
	m({
		id: "wt17",
		family: "World Traveler",
		short: "17RB",
		name: "World Traveler 17RB",
		alde: false,
		length: "17' 4\"",
		ubw: "3,150 lb",
		hitch: "375 lb",
		gvwr: "3,500 lb",
		ncc: "350 lb",
		fresh: "19",
		gray: "24",
		black: "12",
		...st,
		ball,
		ballHeight: "18 in",
		blowPsi: "50 psi max",
		powerCenter: "Truma Combi furnace and water heater, CP Plus panel. US figures. The Europe/UK chart is metric.",
		drains: "Pump and winterization kit under the curbside bed, in front of the A/C. Stainless tank drain and low-point drains on the roadside tank pan.",
		lug
	}),
	m({
		id: "wt22",
		family: "World Traveler",
		short: "22RB",
		name: "World Traveler 22RB",
		alde: false,
		length: "22' 2\"",
		ubw: "3,700 lb",
		hitch: "450 lb",
		gvwr: "4,500 lb",
		ncc: "800 lb",
		fresh: "19",
		gray: "24",
		black: "12",
		...st,
		ball,
		ballHeight: "18 in",
		blowPsi: "50 psi max",
		powerCenter: "Truma Combi furnace and water heater, CP Plus panel. US figures. The Europe/UK chart is metric.",
		drains: "Pump and winterization kit under the curbside bed, in front of the A/C. Stainless tank drain and low-point drains on the roadside tank pan.",
		lug
	}),
	m({
		id: "fc23",
		family: "Flying Cloud",
		short: "23FB",
		name: "Flying Cloud 23FB",
		alde: false,
		length: "23' 11\"",
		ubw: "5,000 lb",
		hitch: "500 lb",
		gvwr: "6,000 lb",
		ncc: "1,000 lb",
		fresh: "37",
		gray: "37",
		black: "17",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Stainless tank drain on the tank pan in front of the roadside tires. Two low-point drains in the pantry, behind the lower face panel. Pump under the removable bottom wardrobe shelf.",
		lug
	}),
	m({
		id: "fc25",
		family: "Flying Cloud",
		short: "25FB",
		name: "Flying Cloud 25FB",
		alde: false,
		length: "26' 2\"",
		ubw: "5,750 lb",
		hitch: "860 lb",
		gvwr: "7,300 lb",
		ncc: "1,550 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the wardrobe, behind the bottom panel.",
		lug
	}),
	m({
		id: "fc27",
		family: "Flying Cloud",
		short: "27FB",
		name: "Flying Cloud 27FB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,050 lb",
		hitch: "875 lb",
		gvwr: "7,600 lb",
		ncc: "1,550 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the wardrobe, behind the bottom panel.",
		lug
	}),
	m({
		id: "fc28",
		family: "Flying Cloud",
		short: "28RB",
		name: "Flying Cloud 28RB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,000 lb",
		hitch: "875 lb",
		gvwr: "7,600 lb",
		ncc: "1,600 lb",
		fresh: "39",
		gray: "37",
		black: "35",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the cooktop: bottom cabinet panel, then a screwed panel.",
		lug
	}),
	m({
		id: "fc30",
		family: "Flying Cloud",
		short: "30FB",
		name: "Flying Cloud 30FB Bunk",
		alde: false,
		length: "31' 2\"",
		ubw: "6,700 lb",
		hitch: "900 lb",
		gvwr: "8,800 lb",
		ncc: "2,100 lb",
		fresh: "53",
		gray: "40",
		black: "35",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Two low-point drains under an access panel beneath the mattress. Toilet drain under the pantry. Two brass in-line drains on the tank, roadside between the tires. Pump under the pantry.",
		lug
	}),
	m({
		id: "i23",
		family: "International",
		short: "23FB",
		name: "International 23FB",
		alde: false,
		length: "23' 11\"",
		ubw: "5,000 lb",
		hitch: "500 lb",
		gvwr: "6,000 lb",
		ncc: "1,000 lb",
		fresh: "37",
		gray: "37",
		black: "17",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Stainless tank drain on the tank pan in front of the roadside tires. Two low-point drains in the pantry, behind the lower face panel. Pump under the removable bottom wardrobe shelf.",
		lug
	}),
	m({
		id: "i25",
		family: "International",
		short: "25FB",
		name: "International 25FB",
		alde: false,
		length: "26' 2\"",
		ubw: "5,800 lb",
		hitch: "860 lb",
		gvwr: "7,300 lb",
		ncc: "1,500 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the wardrobe, behind the bottom panel.",
		lug
	}),
	m({
		id: "i27",
		family: "International",
		short: "27FB",
		name: "International 27FB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,100 lb",
		hitch: "875 lb",
		gvwr: "7,600 lb",
		ncc: "1,500 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the wardrobe, behind the bottom panel.",
		lug
	}),
	m({
		id: "i28",
		family: "International",
		short: "28RB",
		name: "International 28RB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,100 lb",
		hitch: "875 lb",
		gvwr: "7,600 lb",
		ncc: "1,500 lb",
		fresh: "39",
		gray: "37",
		black: "35",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Brass low-point drains on the exterior tank pan, roadside between the tires, plus a separate stainless tank drain. Pump under the cooktop: bottom cabinet panel, then a screwed panel.",
		lug
	}),
	m({
		id: "i30",
		family: "International",
		short: "30RB",
		name: "International 30RB",
		alde: false,
		length: "31' 2\"",
		ubw: "6,800 lb",
		hitch: "925 lb",
		gvwr: "8,800 lb",
		ncc: "2,000 lb",
		fresh: "53",
		gray: "36",
		black: "36",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "50 psi max",
		powerCenter: "Inverter outlets are 2,000 W. On shore power the converter should read 13.6–14.0 V.",
		drains: "Two low-point drains under the rear dinette seat cushion. Tank-pan drain curbside between the tires. Pump under the removable bottom wardrobe shelf.",
		lug
	}),
	m({
		id: "g25",
		family: "Globetrotter",
		short: "25FB",
		name: "Globetrotter 25FB",
		alde: false,
		length: "26' 2\"",
		ubw: "6,100 lb",
		hitch: "900 lb",
		gvwr: "7,300 lb",
		ncc: "1,200 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "30 psi max",
		powerCenter: "Near the floor, behind the decorative front panel. Every breaker and fuse is labeled inside.",
		drains: "Interior drain plus brass drains on the roadside, between the wheels.",
		lug
	}),
	m({
		id: "g27",
		family: "Globetrotter",
		short: "27FB",
		name: "Globetrotter 27FB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,400 lb",
		hitch: "900 lb",
		gvwr: "7,600 lb",
		ncc: "1,200 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "30 psi max",
		powerCenter: "Near the floor, behind the decorative front panel. Every breaker and fuse is labeled inside.",
		drains: "Interior drain plus brass drains on the roadside, between the wheels.",
		lug
	}),
	m({
		id: "g30",
		family: "Globetrotter",
		short: "30RB",
		name: "Globetrotter 30RB",
		alde: false,
		length: "31' 2\"",
		ubw: "7,000 lb",
		hitch: "950 lb",
		gvwr: "8,800 lb",
		ncc: "1,800 lb",
		fresh: "53",
		gray: "36",
		black: "36",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "30 psi max",
		powerCenter: "Near the floor, behind the decorative front panel. Every breaker and fuse is labeled inside.",
		drains: "Two interior drains under the rear dinette, in front of the water heater.",
		lug
	}),
	m({
		id: "tw23",
		family: "Trade Wind",
		short: "23FB",
		name: "Trade Wind 23FB",
		alde: false,
		length: "23' 11\"",
		ubw: "5,575 lb",
		hitch: "600 lb",
		gvwr: "6,500 lb",
		ncc: "925 lb",
		fresh: "37",
		gray: "37",
		black: "17",
		...lt16,
		ball,
		ballHeight: "22.5 in",
		blowPsi: "30 psi max",
		powerCenter: "Victron MultiPlus-II, 3,000 W, Cerbo GX. 810 Ah under the trailer, in front of the wheels. Solar 480 W. Tankless recirculating water heater, 60,000 BTU.",
		drains: "Brass drains from the tank pan, roadside behind the wheels, plus a stainless tank drain. Hot and cold low-point drains under the pantry. Pump under the roadside wardrobe.",
		lug
	}),
	m({
		id: "tw25",
		family: "Trade Wind",
		short: "25FB",
		name: "Trade Wind 25FB",
		alde: false,
		length: "26' 2\"",
		ubw: "6,225 lb",
		hitch: "725 lb",
		gvwr: "7,600 lb",
		ncc: "1,375 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...lt16,
		ball,
		ballHeight: "22.5 in",
		blowPsi: "30 psi max",
		powerCenter: "Victron MultiPlus-II, 3,000 W, Cerbo GX. 810 Ah under the trailer, behind the wheels. Solar 720 W. Tankless recirculating water heater, 60,000 BTU.",
		drains: "Brass drains roadside between the wheels, plus a stainless tank drain. Extra low-point drain in the front curbside exterior compartment by the water heater. Pump under the wardrobe, behind the hinged bottom panel.",
		lug
	}),
	m({
		id: "tw27",
		family: "Trade Wind",
		short: "27FB",
		name: "Trade Wind 27FB",
		alde: false,
		length: "28' 2\"",
		ubw: "7,025 lb",
		hitch: "925 lb",
		gvwr: "8,300 lb",
		ncc: "1,275 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...lt16,
		ball,
		ballHeight: "22.5 in",
		blowPsi: "30 psi max",
		powerCenter: "Harbinger APS under the trailer behind the rear axle: 16 kWh usable, 6 kW inverter, plus two 100 Ah Battle Born batteries in the A-frame box. Solar 720 W. Leave the converter profile on magenta. Do not charge the high-voltage pack while moving, spray the APS fans, or open the coolant reservoir. Store the pack at 25% or more and keep it plugged in when it is cold. Storage without that care: the coach notes say it can cost up to about 20% of capacity. For travel, battery disconnect OFF unless the fridge must run. If it does, turn the air conditioner thermostat and the inverter off. Below 35 °F, leave the disconnect on and the battery heater on.",
		drains: "Brass drains roadside between the wheels, plus a stainless tank drain. Extra low-point drain in the lavatory lower cabinet. Pump under the wardrobe, behind the hinged bottom panel.",
		lug
	}),
	m({
		id: "c28",
		family: "Classic",
		short: "28RB",
		name: "Classic 28RB",
		alde: true,
		length: "28' 10\"",
		ubw: "7,550 lb",
		hitch: "925 lb",
		gvwr: "8,800 lb",
		ncc: "1,250 lb",
		fresh: "39",
		gray: "37",
		black: "35",
		tire: "LT225/75R16",
		psi: "90 psi max cold",
		load: "2,680 lb",
		ball,
		ballHeight: "19.5 in",
		blowPsi: "50 psi max",
		powerCenter: "Behind the wood panel at the bottom of the refrigerator. Pull the panel edge to release the catches.",
		drains: "Two brass line drains plus a stainless tank drain, in a galvanized box between the tires.",
		lug
	}),
	m({
		id: "c30",
		family: "Classic",
		short: "30RB",
		name: "Classic 30RB",
		alde: true,
		length: "31' 5\"",
		ubw: "7,850 lb",
		hitch: "850 lb",
		gvwr: "10,000 lb",
		ncc: "2,150 lb",
		fresh: "53",
		gray: "34",
		black: "39",
		tire: "LT225/75R16",
		psi: "90 psi max cold",
		load: "2,680 lb",
		ball,
		ballHeight: "19.5 in",
		blowPsi: "50 psi max",
		powerCenter: "Bottom of the wardrobe.",
		drains: "Two brass line drains plus a stainless tank drain, in a galvanized box between the tires.",
		lug
	}),
	m({
		id: "c33",
		family: "Classic",
		short: "33FB",
		name: "Classic 33FB",
		alde: true,
		length: "33' 3\"",
		ubw: "8,550 lb",
		hitch: "1,200 lb",
		gvwr: "10,000 lb",
		ncc: "1,450 lb",
		fresh: "53",
		gray: "34",
		black: "39",
		tire: "LT225/75R16",
		psi: "90 psi max cold",
		load: "2,680 lb",
		ball,
		ballHeight: "19.5 in",
		blowPsi: "50 psi max",
		powerCenter: "Behind the upholstered side panel of the aft booth seat.",
		drains: "Two brass line drains plus a stainless tank drain, in a galvanized box between the tires.",
		lug
	}),
	m({
		id: "flw",
		family: "Frank Lloyd Wright",
		short: "28RB",
		name: "Frank Lloyd Wright 28RB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,900 lb",
		hitch: "800 lb",
		gvwr: "7,600 lb",
		ncc: "700 lb",
		fresh: "37",
		gray: "40",
		black: "33",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "30 psi max",
		powerCenter: "100 Ah LiFePO4 in a box behind the LP tank cover on the A-frame. Inverter outlets are 2,000 W.",
		drains: "Interior drains in the lavatory cabinet near the water heater. Brass drains on the roadside tank pan between the wheels, plus a separate stainless tank drain. Pump inside the roadside exterior compartment.",
		lug
	}),
	m({
		id: "stetson",
		family: "Stetson",
		short: "27FB",
		name: "Stetson 6666 27FB",
		alde: false,
		length: "28' 2\"",
		ubw: "6,700 lb",
		hitch: "900 lb",
		gvwr: "7,600 lb",
		ncc: "900 lb",
		fresh: "39",
		gray: "39",
		black: "39",
		...st,
		ball,
		ballHeight: "19 in",
		blowPsi: "30 psi max",
		powerCenter: "Inverter outlets are 2,000 W. The heat pump is effective only above about 45 °F.",
		drains: "Interior low-point drain under the lavatory sink. Brass drains and a stainless tank drain on the exterior tank pan, roadside between the wheels. Pump under the wardrobe; the lower front panel swings open.",
		lug
	}),
	m({
		id: "other",
		family: "Other",
		short: "Other",
		name: "Other Airstream",
		alde: false,
		length: "See your manual",
		ubw: "—",
		hitch: "—",
		gvwr: "—",
		ncc: "—",
		fresh: "—",
		gray: "—",
		black: "—",
		tire: "Read the tire placard",
		psi: "Placard / sidewall",
		load: "—",
		ball: "Usually 2-5/16 in",
		ballHeight: "See Specifications",
		blowPsi: "Use your manual",
		powerCenter: "Find the labeled power center. Locations differ by floor plan and year.",
		drains: "Confirm low-point drains in your owner's manual.",
		lug: "Confirm torque in your manual. These 2027 trailers: 110 / 100 ft-lb."
	})
];
function modelById(id) {
	return models.find((m) => m.id === id) ?? models.find((m) => m.id === "c28");
}
function modelGroups() {
	const order = [];
	const map = /* @__PURE__ */ new Map();
	for (const model of models) {
		const list = map.get(model.family);
		if (list) list.push(model);
		else {
			map.set(model.family, [model]);
			order.push(model.family);
		}
	}
	return order.map((family) => ({
		family,
		models: map.get(family)
	}));
}
var bookCatalog = [
	{
		id: "CL",
		label: "Classic",
		year: "2026",
		family: "Classic"
	},
	{
		id: "GT",
		label: "Globetrotter",
		year: "2025",
		family: "Globetrotter"
	},
	{
		id: "FC",
		label: "Flying Cloud",
		year: "2025",
		family: "Flying Cloud"
	},
	{
		id: "IN",
		label: "International",
		year: "2025",
		family: "International"
	},
	{
		id: "AI",
		label: "International EU",
		year: "2025",
		family: "International"
	},
	{
		id: "TW",
		label: "Trade Wind",
		year: "2025",
		family: "Trade Wind"
	},
	{
		id: "PB",
		label: "Pottery Barn",
		year: "2024",
		family: "Flying Cloud"
	},
	{
		id: "BA",
		label: "Bambi",
		year: "2026",
		family: "Bambi"
	},
	{
		id: "CV",
		label: "Caravel",
		year: "2026",
		family: "Caravel"
	},
	{
		id: "C5",
		label: "Caravel",
		year: "2025",
		family: "Caravel"
	},
	{
		id: "BC",
		label: "Basecamp",
		year: "2026",
		family: "Basecamp"
	},
	{
		id: "BX",
		label: "Basecamp XE",
		year: "2026",
		family: "Basecamp"
	}
];
function bookMeta(id) {
	return bookCatalog.find((b) => b.id === id) ?? bookCatalog[0];
}
function bookLabel(id) {
	const b = bookMeta(id);
	return `${b.year} ${b.label}`;
}
Object.fromEntries(models.map((m) => [m.id, m.short]));
var row = (family, from, to, show, note, id) => ({
	family,
	from,
	to,
	show,
	note,
	id
});
/** Named appliances only. A year with no book uses the nearest opened year, and the note says so. */
var fitmentRows = [
	row("Classic", 2010, 2010, ["Atwood tank"], "2010 manual names an Atwood tank. The furnace is Hydroflame with no maker, and the air and fridge makers were not named."),
	row("Classic", 2011, 2015, [
		"Atwood tank",
		"Dometic CCC2",
		"Dometic RM fridge",
		"SeeLevel II",
		"WFCO",
		"Parallax"
	], "2011–2015 were not opened. This is the 2016 pre-Alde list: Atwood tank, CCC2, Dometic RM, SeeLevel, WFCO, and Parallax. No Alde. Read the plate."),
	row("Classic", 2016, 2016, [
		"Atwood tank",
		"Dometic CCC2",
		"Dometic RM fridge",
		"SeeLevel II",
		"WFCO",
		"Parallax"
	], "2016 parts book: Atwood tank, CCC2, Dometic RM3962, Parallax, WFCO 1000 W. No Alde. Furnace maker not named."),
	row("Classic", 2017, 2017, [
		"Alde 3030",
		"Dometic CCC2",
		"SeeLevel II",
		"Firefly",
		"Parallax"
	], "2017 parts book: Alde 3010, CCC2, Firefly, Parallax. A late 2017 build can already be a 3020. Fridge maker not named."),
	row("Classic", 2018, 2018, ["Alde 3030", "Firefly"], "2018 parts book: Alde 3020. Firefly that year is an owner report, not a parts-book line."),
	row("Classic", 2019, 2019, [
		"Alde 3030",
		"CZone",
		"SeeLevel II"
	], "2019 parts book: Alde 3020 and CZone. No separate CCC2."),
	row("Classic", 2020, 2021, ["Alde 3030", "CZone"], "Manual years. The 2021 fridge changed mid-year. Do not assume Norcold or Dometic."),
	row("Classic", 2022, 2022, [
		"Alde 3030",
		"CZone",
		"Coleman-Mach"
	], "2022 parts book: Alde 3020, Coleman-Mach 8, CZone. Mach 8 has no numbered codes. Do not use VS-18 numbers."),
	row("Classic", 2023, 2023, ["CZone", "12 V fridge"], "Dealer listing: a 12 V fridge, maker not named, and CZone. The Alde model was not verified. It is not a 3030."),
	row("Classic", 2024, 2024, ["Alde 3030"], "A 2024 owner still had a 3020, not a 3030. Air, the tank monitor, and CZone were not verified for 2024 and are not copied."),
	row("Classic", 2025, 2025, ["Alde 3030", "Coleman-Mach"], "Coleman-Mach 8 Signature is an owner report. The 2025 Alde model was not in a parts book. CZone was not verified."),
	row("Classic", 2026, 2026, [
		"Alde 3030",
		"Coleman-Mach",
		"CZone"
	], "A 3030 is confirmed on a 2026 28 only. Coleman-Mach 8 Plus. CZone that year is an owner report."),
	row("Classic", 2027, 2027, ["Alde 3030"], "The 2027 boiler model, air conditioner, and control system were not opened. Nothing is copied from 2026."),
	row("Globetrotter", 2019, 2019, ["Dometic CCC2", "Dometic RM fridge"], "Dealer spec: absorption fridge. The parts-book appliance pages were not extracted. No Girard."),
	row("Globetrotter", 2020, 2020, ["Dometic RM fridge"], "Provisional. A 6-gallon tank is a spec note, and the maker was not named. Suburban is not copied onto it."),
	row("Globetrotter", 2021, 2021, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"Nova Kool"
	], "2021 parts book: Girard and SeeLevel II. Nova Kool is named on the 25. The 27 and 30 makers are not. Not a Norcold letter code."),
	row("Globetrotter", 2022, 2022, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"Nova Kool",
		"PD1600 inverter"
	], "2022 parts book: Girard, CCC2, SeeLevel, Progressive Dynamics 1000 W. Nova Kool is named on the 23 and 25. Furnace maker not named."),
	row("Globetrotter", 2023, 2024, ["Girard GSWH-2", "12 V fridge"], "Those parts books were not extracted. Girard is the hypothesis from the surrounding years."),
	row("Globetrotter", 2025, 2026, [
		"Suburban ST-65RL",
		"Suburban IW60",
		"12 V fridge"
	], "Owners report Suburban from 2025, under both ST65RL and IW60RL. One 2025 lot still showed a Girard. The 2026 book was not opened separately. Read the plate."),
	row("Globetrotter", 2027, 2027, ["Unnamed tankless", "12 V fridge"], "2027 brochure: recirculating tankless, maker not named. Suburban and Girard codes are not copied onto it. The 12 V compressor maker was not named. Read the plate before you use a code."),
	row("Flying Cloud", 2010, 2012, ["Dometic CCC2"], "Spec sheets name a CCC thermostat. The tank and the fridge makers were not named, so those lists stay in search."),
	row("Flying Cloud", 2013, 2013, ["Dometic RM fridge"], "2013 parts book prints RM2451, RM3762, and DM2862. The water heater and air pages were not extracted."),
	row("Flying Cloud", 2014, 2015, [
		"Atwood tank",
		"Dometic CCC2",
		"Dometic RM fridge"
	], "Listings: Atwood tank and a Dometic absorption fridge."),
	row("Flying Cloud", 2017, 2017, ["Dometic CCC2", "Dometic RM fridge"], "Listings name a Dometic tank heater and a Dometic absorption fridge. That is not a Suburban tank. 2016 was not found and is not copied from either side."),
	row("Flying Cloud", 2018, 2018, ["Dometic CCC2"], "2018 parts book: Comfort Control Center. The 6-gallon tank and the fridge maker were not named."),
	row("Flying Cloud", 2019, 2020, [
		"Suburban tank",
		"Dometic CCC2",
		"Dometic RM fridge",
		"SeeLevel II"
	], "SeeLevel II is verified in the 2019 manual."),
	row("Flying Cloud", 2021, 2021, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"12 V fridge"
	], "2021 parts book: Girard. The fridge maker is not named."),
	row("Flying Cloud", 2022, 2022, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"Nova Kool"
	], "2022 parts book: Girard, Nova Kool, SeeLevel, Progressive Dynamics 1000 W."),
	row("Flying Cloud", 2023, 2023, [
		"Girard GSWH-2",
		"12 V fridge",
		"PD1600 inverter"
	], "A 2023 review names Girard and a Progressive Dynamics 1000 W inverter. Not a parts book."),
	row("Flying Cloud", 2024, 2024, ["Girard GSWH-2", "12 V fridge"], "An owner listing names Girard. The fridge maker is a conflict and was not picked. The inverter was not named."),
	row("Flying Cloud", 2025, 2025, ["12 V fridge"], "The 2025 water-heater maker is not named. Suburban was not copied over from the Globetrotter."),
	row("Flying Cloud", 2026, 2026, [
		"12 V fridge",
		"SeeLevel II",
		"GE Profile"
	], "The 2026 manual points the thermostat at GE and names SeeLevel. The water-heater maker is still not named."),
	row("Flying Cloud", 2027, 2027, ["12 V fridge"], "No 2027 parts book. A dealer page says 12 V, maker not named. A press GE claim and an AquaHot claim were not adopted."),
	row("International", 2019, 2019, ["Dometic CCC2"], "2019 listings did not name the furnace, fridge, air, or tank. A 6-gallon tank in the next book does not name the maker, so no tank brand is shown."),
	row("International", 2020, 2020, ["Dometic CCC2"], "2020 book: 6-gallon tank, maker not named, and CCC2. A Dometic fridge is one owner report and is not shown as factory."),
	row("International", 2021, 2021, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II"
	], "The manual uses the Girard model code and CCC2. The fridge that year is absorption in the manual and 12 V in some listings. Neither is shown."),
	row("International", 2022, 2023, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"Nova Kool"
	], "Parts books: Girard, CCC2, SeeLevel, Progressive Dynamics 1000 W. Nova Kool is named on the 23."),
	row("International", 2024, 2024, [
		"Girard GSWH-2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"Nova Kool",
		"GE Profile",
		"Victron SmartSolar"
	], "2024 book: Girard, GE Profile, Progressive Dynamics 2000 W. Victron is the solar option, not the inverter."),
	row("International", 2025, 2025, ["Girard GSWH-2", "12 V fridge"], "An owner was winterizing a Girard. Not a parts book. GE was not copied forward."),
	row("International", 2026, 2026, [
		"12 V fridge",
		"SeeLevel II",
		"GE Profile"
	], "The manual points the thermostat at GE. The water-heater maker is not named. 2027 was not found."),
	row("Caravel", 2021, 2021, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"Nova Kool"
	], "2021 parts book: Girard, CCC, Nova Kool, Progressive Dynamics 1000 W."),
	row("Caravel", 2023, 2024, [
		"Girard GSWH-2",
		"Dometic CCC2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"Nova Kool",
		"Vitrifrigo"
	], "Parts books: Girard and CCC. 2024 inverter is a Progressive Dynamics 2000 W. 2022 was not opened."),
	row("Caravel", 2025, 2025, [
		"Girard GSWH-2",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"GE Profile",
		"Nova Kool",
		"Vitrifrigo"
	], "2025 parts book: Girard, GE Profile, Progressive Dynamics 2000 W."),
	row("Caravel", 2026, 2026, [
		"Fogatti",
		"SeeLevel II",
		"12 V fridge",
		"PD1600 inverter",
		"GE Profile",
		"Nova Kool",
		"Vitrifrigo"
	], "2026 parts book: Fogatti replaces Girard. No Fogatti codes were found."),
	row("Bambi", 2022, 2022, [
		"Girard GSWH-2",
		"SeeLevel II",
		"12 V fridge",
		"Nova Kool"
	], "2022 parts book: Girard and Nova Kool. No inverter in that book. 2020, 2021, 2024, and 2027 were not opened."),
	row("Bambi", 2023, 2023, [
		"SeeLevel II",
		"12 V fridge",
		"Vitrifrigo"
	], "2023 manual: tankless, maker not named, and SeeLevel. Vitrifrigo is from press and a forum, not a parts book."),
	row("Bambi", 2025, 2025, ["GE Profile"], "2025 GE is an owner quote of a parts book. The fridge and the water heater were not named."),
	row("Bambi", 2026, 2026, ["12 V fridge"], "2026 spec: 12 V fridge, maker not named. The water heater and the air conditioner were not named."),
	row("Basecamp", 2017, 2017, ["Truma Combi", "Coleman-Mach"], "2017 parts book, 16 only: Truma Combi Eco Plus and a Mach 8 Polar Cub. The fridge maker was not named. The converter and the tank monitor were not in that extract.", "bc16"),
	row("Basecamp", 2020, 2020, [
		"Truma Combi",
		"Coleman-Mach",
		"Nova Kool"
	], "2020 parts book, 16 only: Truma Combi Eco Plus, Mach 8, Nova Kool 3.1. The 20 was not in that extract.", "bc16"),
	row("Basecamp", 2022, 2022, [
		"Truma Combi",
		"Coleman-Mach",
		"Nova Kool",
		"SeeLevel II",
		"Progressive Dynamics"
	], "2022 parts book, 16: Truma Combi Eco Plus, Nova Kool 3.1, SeeLevel, Progressive Dynamics power center 513802. The 20 that year is Suburban, not this row.", "bc16"),
	row("Basecamp", 2023, 2025, [
		"Truma Combi",
		"Dometic furnace",
		"Suburban IW60",
		"Coleman-Mach",
		"Nova Kool",
		"SeeLevel II",
		"Progressive Dynamics"
	], "2023–2025 books were not opened. The 16 still had a Truma in 2022 and a Dometic furnace plus Suburban IW60 in 2026. Both lists are here. Read the heater plate. Do not use Truma codes on a Suburban, or IW60 codes on a Combi.", "bc16"),
	row("Basecamp", 2026, 2026, [
		"Dometic furnace",
		"Suburban IW60",
		"Coleman-Mach",
		"Nova Kool",
		"SeeLevel II",
		"Progressive Dynamics"
	], "2026 parts book, 16: Truma is gone. Dometic 12,000 BTU furnace 690798-01, Suburban IW60, Mach 8, Nova Kool, SeeLevel, Progressive Dynamics 513802. Read the furnace-board decal before you use the flash list.", "bc16"),
	row("Basecamp", 2022, 2022, [
		"Suburban IW60",
		"Suburban NT furnace",
		"SeeLevel II",
		"12 V fridge",
		"Nova Kool",
		"Coleman-Mach",
		"Progressive Dynamics"
	], "2022 Basecamp 20: Suburban 16,000 BTU furnace and IW60, Mach 8, Nova Kool, SeeLevel, Progressive Dynamics 513802. This row is not the 16, which still had a Truma.", "bc20"),
	row("Basecamp", 2026, 2026, [
		"Suburban IW60",
		"Suburban NT furnace",
		"SeeLevel II",
		"12 V fridge",
		"Nova Kool",
		"Coleman-Mach",
		"Progressive Dynamics"
	], "2026 Basecamp 20: Suburban 19,000 BTU furnace, IW60, Mach 8 Plus, Nova Kool, SeeLevel, Progressive Dynamics 513802. The 16 dropped Truma the same year.", "bc20"),
	row("Basecamp", 2026, 2027, [
		"Truma Combi",
		"Victron MultiPlus",
		"Victron SmartSolar",
		"Cerbo GX",
		"Battle Born GC3",
		"12 V fridge"
	], "2027 Basecamp 20XE manual: Truma Combi is the furnace and the water heater. Victron, Cerbo, and Battle Born are on this card from the coach spec. The parts book was not opened.", "bcxe"),
	row("Trade Wind", 2024, 2024, [
		"Suburban IW60",
		"Victron MultiPlus",
		"Victron SmartSolar",
		"Cerbo GX",
		"GE Profile",
		"12 V fridge"
	], "2024 manual and recall: GE air, Victron, Suburban tankless. The exact Suburban model and SeeLevel were not confirmed. The fridge maker was not picked."),
	row("Trade Wind", 2025, 2025, [
		"Suburban IW60",
		"Victron MultiPlus",
		"Victron SmartSolar",
		"Cerbo GX",
		"GE Profile",
		"12 V fridge",
		"SeeLevel II",
		"Battle Born GC3",
		"Nova Kool"
	], "2025 parts book: IW60RL, MultiPlus-II, Cerbo, SeeLevel, Battle Born. Nova Kool is named on the 23."),
	row("Trade Wind", 2026, 2026, [
		"Suburban IW60",
		"Victron MultiPlus",
		"Victron SmartSolar",
		"Cerbo GX",
		"GE Profile",
		"12 V fridge",
		"SeeLevel II",
		"Battle Born GC3",
		"Nova Kool"
	], "2026 brochure does not name the water heater, air, inverter, or tank monitor. The 2025 parts book and the 2027 manual on the 23 and 25 agree on Victron and GE, so those lists are shown. Harbinger is the 2027 27FB only. Read the plate."),
	row("Trade Wind", 2027, 2027, [
		"Victron MultiPlus",
		"Victron SmartSolar",
		"Cerbo GX",
		"GE Profile",
		"12 V fridge"
	], "2027 manual: Victron on the 23 and 25. The thermostat page points at GE. The water heater is tankless, maker not named. SeeLevel was not confirmed."),
	row("Trade Wind", 2027, 2027, [
		"Harbinger",
		"GE Profile",
		"12 V fridge"
	], "2027 27FB only: Harbinger replaces Victron. The water heater maker was not named. The Harbinger screen has its own alarms. Victron numbers do not apply.", "tw27"),
	row("World Traveler", 2026, 2027, ["Truma Combi"], "Brochure and dealer lists: Truma Combi Eco Plus is the furnace and the water heater. No separate inverter."),
	row("Frank Lloyd Wright", 2026, 2026, ["12 V fridge"], "Spec sheet: 12 V fridge, unnamed furnace, unnamed tankless. Probeless is not recorded as SeeLevel. 2027 was not confirmed."),
	row("Stetson", 2026, 2027, ["12 V fridge"], "Dealer specs: 12 V fridge and an unnamed tankless heater. The inverter maker is not named.")
];
var ALDE_3030_ONLY = /* @__PURE__ */ new Set([
	"alde-conn",
	"alde-nf",
	"alde-ohg",
	"alde-ohl",
	"alde-fail",
	"alde-panel",
	"alde-zone",
	"alde-alt",
	"alde-ci",
	"alde-bac",
	"alde-load",
	"alde-dongle"
]);
var ALDE_EARLY = /* @__PURE__ */ new Set([
	"alde-red",
	"alde-blue",
	"alde-ext",
	"alde-redc",
	"alde-yel",
	"alde-nomatch"
]);
function rowsFor(model) {
	return fitmentRows.filter((r) => r.family === model.family && (!r.id || r.id === model.id));
}
function fitmentPick(model, year) {
	const rows = rowsFor(model);
	if (!rows.length) return {
		row: null,
		gap: false,
		assumed: false,
		carried: false
	};
	const y = year ?? 2027;
	const specific = rows.find((r) => r.id === model.id && y >= r.from && y <= r.to);
	if (specific) return {
		row: specific,
		gap: false,
		assumed: year == null,
		carried: false
	};
	const hit = rows.find((r) => !r.id && y >= r.from && y <= r.to);
	if (hit) return {
		row: hit,
		gap: false,
		assumed: year == null,
		carried: false
	};
	if (year == null) return {
		row: rows[rows.length - 1],
		gap: false,
		assumed: true,
		carried: false
	};
	const prev = [...rows].reverse().find((r) => r.to < y);
	if (prev) return {
		row: prev,
		gap: false,
		assumed: false,
		carried: true
	};
	const next = rows.find((r) => r.from > y);
	if (next) return {
		row: next,
		gap: false,
		assumed: false,
		carried: true
	};
	return {
		row: null,
		gap: true,
		assumed: false,
		carried: false
	};
}
function matrixAllows(name, model, year) {
	if (model.family === "Other") return true;
	if (name === "TST TPMS") return model.family === "Classic";
	if (name === "TireMinder" || name === "Progressive Industries EMS") return false;
	const picked = fitmentPick(model, year);
	if (!picked.row) return !picked.gap;
	return picked.row.show.includes(name);
}
function matrixNote(model, year) {
	if (model.family === "Other") return "Every code list is open until you pick a floor.";
	const picked = fitmentPick(model, year);
	if (picked.gap) return "No parts book for this year was opened, and there is no neighboring year to carry. Search still finds every code.";
	if (!picked.row) return "No fitment row for this floor.";
	if (picked.carried && year != null) {
		const span = picked.row.from === picked.row.to ? String(picked.row.from) : `${picked.row.from}–${picked.row.to}`;
		return `No book for ${year} was opened. These codes are the ${year < picked.row.from ? "next" : "previous"} opened year (${span}). Read the plate. ${picked.row.note}`;
	}
	return (picked.assumed ? "No VIN year, so this is the latest row on file. " : "") + picked.row.note;
}
/** One reading of the fitment row: factory book, mixed with an owner report, or not established. */
function fitmentStanding(model, year) {
	const note = matrixNote(model, year);
	const picked = fitmentPick(model, year);
	if (model.family === "Other" || picked.gap || picked.assumed || picked.carried || !picked.row) return {
		standing: "unknown",
		line: `Fit is not established for this coach. ${note}`
	};
	if (/owner report|not verified|not opened|was not opened|not in a parts book|not a parts book/i.test(picked.row.note)) return {
		standing: "mixed",
		line: `This year mixes a parts book with an owner report or an item that was not opened. ${note}`
	};
	return {
		standing: "factory",
		line: note
	};
}
function aldeCodeOn(id, year, modelId) {
	if (ALDE_3030_ONLY.has(id)) return year === 2026 && modelId === "c28";
	if (ALDE_EARLY.has(id) && (year == null || year >= 2025)) return false;
	return true;
}
/** What the fault list prints. "Alde 3030" in a fitment row is only the code key. */
function aldeShownName(year, modelId) {
	if (year === 2017) return "Alde 3010";
	if (year === 2018 || year === 2019 || year === 2022 || year === 2024) return "Alde 3020";
	if (year === 2026 && modelId === "c28") return "Alde 3030";
	return "Alde";
}
var recalls = [
	{
		id: "23v519",
		campaign: "NHTSA 23V-519",
		when: "Filed 27 Jul 2023",
		models: "2023–2024 Globetrotter, and other 2023–24 Airstreams built 21 Jun–20 Jul 2023. Not a blanket 2024 recall.",
		defect: "SmartPlug 30 A inlet with bronze manganese-bronze D-rings can crack if torqued. Wires loosen and arc. Fire risk. A burning smell is the warning.",
		remedy: "Dealer inspects and replaces the inlet with the silver aluminum D-ring version, free.",
		tell: "Bronze-colored D-rings are the suspect parts. Silver aluminum rings are the fix. Equipment side is 23E-059, BM30xx inlets built 1 Jun–21 Jul 2023."
	},
	{
		id: "24v664",
		campaign: "NHTSA 24V-664",
		when: "11 Sep 2024 · Transport Canada 2024-513",
		models: "2025 Classic, 21 units, built 8 Jul–26 Aug 2024. Units built after 28 Aug 2024 are not affected. VINs are not sequential.",
		defect: "Power hub firmware had the wrong e-fuse maximum. The hub can overheat. Fire risk. No owner warning sign.",
		remedy: "Dealer replaces the power hub, free.",
		tell: "Ask the dealer to run the VIN. Do not guess from the build month alone."
	},
	{
		id: "25v143",
		campaign: "NHTSA 25V-143",
		when: "5 Mar 2025 · Transport Canada 2025-116",
		models: "2021–25 Classic 33', 2024–25 Classic 30', 2025 Classic 28'. Built 5 Mar 2021–24 Feb 2025. About 648 units.",
		defect: "Sofa footrest switch wiring is underrated. If the switch is held, it can overheat and melt. Fire risk. A burning smell is the warning.",
		remedy: "Do not use the footrest switch until the dealer installs a reverse relay, free. Production changed 27 Feb 2025.",
		tell: "One owner also reported an overheating sofa motor on a 2022 Classic 33. That report is not the same campaign, but it is a reason to take a hot smell seriously."
	},
	{
		id: "26v401",
		campaign: "NHTSA 26V-401",
		when: "24 Jun 2026 · Transport Canada 2026-309",
		models: "2026 Classic with a MaxxAir N-Series Maxxfan, built 7 Jan–12 Jun 2026 (177 Classics).",
		defect: "Fan circuit board can fail and overheat. Fire risk. Smoke is the warning.",
		remedy: "Dealer replaces the PCB, free. Owner letters were mailed 22 Jul 2026. Fixed boards carry a QC-passed sticker.",
		tell: "Equipment recall 26E-036 covers the same fans even on a Globetrotter: P/Ns 00-04700NX, 00-04900NX, 00-04950NX, 00-08950N, 00-08900N, PCB 10B21275N, built 5 Jan–17 Jun 2026. Date code after week 51/2025 (“5125”) gets the board. Do not run the fan until it is checked. Airxcel 574-247-9235."
	},
	{
		id: "24v656",
		campaign: "NHTSA 24V-656",
		when: "6 Sep 2024",
		models: "2024 Trade Wind with the GE air conditioner. Not Classic or Globetrotter.",
		defect: "A/C soft-start device can fail and overheat. Fire risk.",
		remedy: "Stop using it and follow the owner letter.",
		tell: "Included so a Trade Wind owner does not skip it. Smell or heat at the soft start is a stop."
	}
];
var tsbs = [
	{
		id: "sb201",
		title: "Service Bulletin 201",
		applies: "2025 Globetrotter built 29 Jul–21 Aug 2024, serials 573343–573897 only.",
		problem: "Coleman-Mach A/C thermostat controller problems. Dealer adds a terminating resistor at the A/C. About 0.25 hour. Airstream 877-344-1076 ext. 7491."
	},
	{
		id: "tsb170",
		title: "TSB 170",
		applies: "30 ft Classic with Alde.",
		problem: "How to bleed air from the loop, where the expansion tank is, and the glycol part numbers. Fill to MAX with the same glycol. Do not overfill."
	},
	{
		id: "sb180",
		title: "Service Bulletin 180",
		applies: "2018 through early 2020 Classic.",
		problem: "Replace Alde fluid with 360371-201C and add two grounds. Ask whether it was done before you buy a used one."
	}
];
var ownerIssues = [
	{
		title: "Inverter, Cerbo, and fans",
		models: "2024–25, various",
		issue: "Inverter errors, Victron screen faults, intermittent fans, tripped breakers, water-heater failures, and a disconnect that does not kill every 12 V load.",
		fix: "Warranty and dealer. Firmware and a wiring check before you replace parts."
	},
	{
		title: "Alde Flow leaks",
		models: "Alde 3020 with the Flow, Classic",
		issue: "The Flow leaks, the pump short-cycles, and it is wet under the unit.",
		fix: "Temporary bypass, or a 3030 Plus which deletes the Flow."
	},
	{
		title: "Disconnect solenoid",
		models: "Various late models",
		issue: "The battery-disconnect solenoid sticks.",
		fix: "Warranty replacement on some coaches."
	}
];
var YEAR_LETTERS = "ABCDEFGHJKLMNPRSTVWXY";
var TRANSLIT = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
	E: 5,
	F: 6,
	G: 7,
	H: 8,
	J: 1,
	K: 2,
	L: 3,
	M: 4,
	N: 5,
	P: 7,
	R: 9,
	S: 2,
	T: 3,
	U: 4,
	V: 5,
	W: 6,
	X: 7,
	Y: 8,
	Z: 9
};
var WEIGHTS = [
	8,
	7,
	6,
	5,
	4,
	3,
	2,
	10,
	0,
	9,
	8,
	7,
	6,
	5,
	4,
	3,
	2
];
function cleanVin(vin) {
	return vin.trim().toUpperCase();
}
function vinYear(vin) {
	const v = cleanVin(vin);
	if (v.length < 10) return null;
	const code = v[9];
	const modern = /[A-HJ-NPR-Z]/.test(v[6] ?? "");
	if (code >= "1" && code <= "9") return (modern ? 2030 : 2e3) + Number(code);
	const index = YEAR_LETTERS.indexOf(code);
	if (index < 0) return null;
	return (modern ? 2010 : 1980) + index;
}
function checkDigit(vin) {
	if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return null;
	let sum = 0;
	for (let i = 0; i < 17; i++) {
		const value = vin[i] >= "0" && vin[i] <= "9" ? Number(vin[i]) : TRANSLIT[vin[i]];
		if (value === void 0) return null;
		sum += value * WEIGHTS[i];
	}
	const remainder = sum % 11;
	return remainder === 10 ? "X" : String(remainder);
}
function vinProblem(vin) {
	const v = cleanVin(vin);
	if (!v) return null;
	if (/[IOQ]/.test(v)) return "A VIN cannot use I, O, or Q";
	if (v.length < 17) return "Enter all 17 characters";
	if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return "Use only letters and numbers";
	if (v[8] !== checkDigit(v)) return "Check digit does not match";
	if (vinYear(v) === null) return "Year character is not valid";
	return null;
}
function vinOk(vin) {
	return cleanVin(vin).length === 17 && vinProblem(vin) === null;
}
/** The year on the coach. A typed year wins. Otherwise the year comes from a valid VIN. */
function coachYear(vin, typed) {
	if (typeof typed === "number" && typed >= 1960 && typed <= 2039) return typed;
	return vinOk(vin) ? vinYear(vin) : null;
}
var SPEC_YEAR = 2027;
function vinMismatch(vin, model) {
	if (!vinOk(vin)) return null;
	const year = vinYear(vin);
	if (year == null || year === 2027) return null;
	if (model.id === "other") return `VIN says ${year}. Other is not a ${SPEC_YEAR} floor plan. Use that year’s manual.`;
	return `VIN says ${year}. This card is a ${SPEC_YEAR} ${model.name}.`;
}
function coachPart(part, model) {
	const base = {
		hide: false,
		pn: part.pn,
		name: part.name,
		note: ""
	};
	if (part.book) {
		const meta = bookMeta(part.book);
		const label = bookLabel(part.book);
		if (model.family !== "Other" && model.family !== meta.family) return {
			...base,
			hide: true,
			note: `This number is in the ${label} book.`
		};
		if (part.floors && part.floors.length && model.family === meta.family && !part.floors.includes(model.id)) return {
			...base,
			hide: true,
			note: "Listed for a different floor plan. Confirm the plate before you order."
		};
		return base;
	}
	if (model.family === "Other") return base;
	if (part.id === "glycol" || part.id === "alde-boiler") return {
		...base,
		hide: !model.alde,
		note: model.alde ? "This coach has Alde." : ""
	};
	if (part.id === "anode" || part.id === "heater-board" || part.id === "tool-anode-socket") return {
		...base,
		hide: model.alde,
		note: model.alde ? "An Alde coach does not use a Suburban tank anode." : ""
	};
	if (part.id === "descale" || part.id === "st65") {
		const truma = model.id === "wt17" || model.id === "wt22" || model.id === "bcxe";
		const off = model.alde || truma;
		const note = model.alde ? "This coach is Alde, not a Suburban tankless." : truma ? "This coach is Truma, not a Suburban tankless." : "";
		return {
			...base,
			hide: off,
			note
		};
	}
	if (part.id === "inverter") {
		if (model.family === "Trade Wind" || model.id === "bcxe") return {
			...base,
			hide: true,
			note: "This coach uses a Victron, not this Progressive Dynamics inverter."
		};
		if (model.family === "Classic") return {
			...base,
			pn: "514515",
			note: "Classic inverter. Globetrotter is 514263."
		};
		if (model.family === "Globetrotter") return {
			...base,
			pn: "514263",
			note: "Globetrotter inverter. Classic is 514515."
		};
	}
	if (part.id === "toilet") {
		if (model.id === "g30") return {
			...base,
			pn: "602334",
			name: "Thetford Aqua-Magic toilet",
			note: "Globetrotter 30RB. Other GT and Classic floors use the Dometic 690621-BOX."
		};
		if (model.id === "c33") return {
			...base,
			pn: "602659",
			name: "Dometic macerator toilet",
			note: "Classic 33FB. 28RB and 30RB use the Dometic china 690621-BOX."
		};
		if (model.family === "Globetrotter" || model.family === "Classic") return {
			...base,
			pn: "690621-BOX",
			name: "Dometic toilet",
			note: "Not the 30RB Thetford or the 33FB macerator."
		};
	}
	if (part.id === "brakes") {
		if (model.family === "Globetrotter") return {
			...base,
			pn: "410980-102 LH / 410980-103 RH",
			note: "12 in Nev-R-Adjust. Quote the VIN before you order shoes."
		};
		if (model.id === "c28") return {
			...base,
			pn: "411262-02",
			name: "Classic axle, 4,000 lb",
			note: "28RB. 30RB and 33FB use axle 411262-01."
		};
		if (model.id === "c30" || model.id === "c33") return {
			...base,
			pn: "411262-01",
			name: "Classic axle, 5,000 lb",
			note: "30RB and 33FB. The 28RB uses 411262-02."
		};
	}
	if (part.id === "fridge") {
		const pn = model.id === "g25" ? "690770" : model.id === "g27" ? "690771-02" : model.id === "c28" ? "690771-01" : model.id === "c33" ? "690735-02" : "";
		if (pn) return {
			...base,
			pn,
			note: "Matched to this floor plan. Confirm the plate on the fridge."
		};
	}
	return base;
}
var TRUMA = /* @__PURE__ */ new Set([
	"wt17",
	"wt22",
	"bcxe"
]);
function bearingsAreRepack(model) {
	return model.family === "Bambi" || model.family === "Basecamp" || model.family === "World Traveler";
}
function bearingNote(model) {
	if (model.family === "Other") return "Read the hub. Nev-R-Lube is sealed. Bambi, Basecamp, and World Traveler manuals call for a yearly repack.";
	if (bearingsAreRepack(model)) return "This manual says clean and repack yearly. Confirm the hub first. Do not grease a Nev-R-Lube cartridge.";
	return "Nev-R-Lube on this coach. End play 0.001–0.010 in. Do not repack. Inspect at tire rotation or yearly.";
}
function applianceFits(name, model, year) {
	return matrixAllows(name, model, year);
}
function codeFits(code, model, year) {
	if (!applianceFits(code.appliance, model, year)) return false;
	if (code.appliance === "Alde 3030" && !aldeCodeOn(code.id, year, model.id)) return false;
	return true;
}
var WATER_BRANDS = [
	"Alde 3030",
	"Truma Combi",
	"Girard GSWH-2",
	"Suburban tank",
	"Atwood tank",
	"Suburban ST-65RL",
	"Suburban IW60",
	"Fogatti",
	"Truma AquaGo"
];
var TANKLESS = [
	"Girard GSWH-2",
	"Suburban ST-65RL",
	"Suburban IW60",
	"Truma AquaGo",
	"Fogatti"
];
/** Brands the opened fitment row actually names. An empty set means the year does not name a heater. */
function waterBrands(model, year) {
	if (model.family === "Other") return new Set(WATER_BRANDS);
	const show = new Set(fitmentPick(model, year).row?.show ?? []);
	if (model.family === "Classic" && year != null && year <= 2016 && !show.has("Alde 3030")) return /* @__PURE__ */ new Set(["Atwood tank"]);
	return new Set(WATER_BRANDS.filter((name) => show.has(name)));
}
var SYMPTOM_BRANDS = {
	"no-hot-tank": ["Suburban tank", "Atwood tank"],
	tankless: [
		"Girard GSWH-2",
		"Suburban ST-65RL",
		"Suburban IW60",
		"Truma AquaGo",
		"Truma Combi",
		"Fogatti"
	],
	"st-hot": ["Suburban ST-65RL"],
	"st-code": ["Suburban ST-65RL", "Suburban IW60"],
	relief: [
		"Suburban tank",
		"Atwood tank",
		"Girard GSWH-2",
		"Suburban ST-65RL",
		"Suburban IW60"
	],
	"pd-code": ["PD1600 inverter"]
};
var PART_BRANDS = {
	anode: ["Suburban tank"],
	"heater-board": ["Suburban tank"],
	descale: ["Suburban ST-65RL"],
	st65: ["Suburban ST-65RL"],
	iw60: ["Suburban IW60"],
	"tool-anode-socket": ["Suburban tank"]
};
/** False when this part names a heater the fitment row does not. */
function partBrandOk(id, model, year) {
	const brands = PART_BRANDS[id];
	if (!brands || model.family === "Other") return true;
	const have = waterBrands(model, year);
	if (!have.size) return false;
	return brands.some((brand) => have.has(brand));
}
/** False when this check names a heater the fitment row does not. */
function symptomBrandOk(id, model, year) {
	const brands = SYMPTOM_BRANDS[id];
	if (!brands || model.family === "Other") return true;
	if (id === "pd-code") return brands.some((brand) => matrixAllows(brand, model, year));
	if (id === "tankless" && matrixAllows("Unnamed tankless", model, year)) return true;
	if (id === "relief" && matrixAllows("Unnamed tankless", model, year)) return true;
	const have = waterBrands(model, year);
	if (!have.size) return false;
	return brands.some((brand) => have.has(brand));
}
/** Alde is the Classic hydronic heater from 2017 on. No other floor plan has it. */
function coachHasAlde(model, year) {
	if (model.family !== "Classic" || !model.alde) return false;
	return !(year != null && year <= 2016);
}
var EXTRA_GEAR = [
	[/\balde\b/i, ["ALDE"]],
	[/\bgirard\b/i, ["Girard GSWH-2"]],
	[/\baquago\b/i, ["Truma AquaGo"]],
	[/\btruma\b/i, ["Truma Combi", "Truma AquaGo"]],
	[/\biw-?60\b/i, ["Suburban IW60"]],
	[/\bst-?65\b/i, ["Suburban ST-65RL"]],
	[/\batwood\b/i, ["Atwood tank"]],
	[/\bsee-?level\b/i, ["SeeLevel II"]],
	[/\bvictron\b|\bcerbo\b/i, [
		"Victron MultiPlus",
		"Cerbo GX",
		"Victron SmartSolar"
	]],
	[/\bczone\b/i, ["CZone"]],
	[/\bnorcold\b/i, ["Norcold 12 V fridge"]],
	[/\bnova[- ]kool\b/i, ["Nova Kool"]],
	[/\bharbinger\b/i, ["Harbinger"]],
	[/\bfogatti\b/i, ["Fogatti"]],
	[/\bcoleman\b/i, ["Coleman-Mach"]]
];
function extraGearOk(sy, model, year) {
	if (!sy.id.startsWith("x-")) return true;
	const text = `${sy.id} ${sy.title ?? ""}`;
	if (sy.id.includes("flying-cloud") && model.family !== "Flying Cloud") return false;
	if (sy.id.includes("globetrotter") && model.family !== "Globetrotter") return false;
	if (sy.id.includes("bambi") && model.family !== "Bambi") return false;
	if (sy.id.includes("international") && model.family !== "International") return false;
	if (sy.id.includes("trade-wind") && model.family !== "Trade Wind" && model.family !== "Basecamp") return false;
	if (/\b2027\b/.test(text) && year != null && year < 2027 && !/\b20(1\d|2[0-6])\b/.test(text)) return false;
	const hit = EXTRA_GEAR.filter(([re]) => re.test(text));
	if (!hit.length) return true;
	return hit.some(([, names]) => names.some((name) => name === "ALDE" ? coachHasAlde(model, year) : name === "Atwood tank" ? waterBrands(model, year).has(name) : matrixAllows(name, model, year)));
}
function symptomOn(sy, model, year, onlyMine = true) {
	if (!symptomBrandOk(sy.id, model, year)) return false;
	if (model.family === "Other") return true;
	if (!onlyMine) return true;
	if (!extraGearOk(sy, model, year)) return false;
	const alde = coachHasAlde(model, year);
	if ((sy.system === "Alde" || sy.fit === "classic") && !alde) return false;
	if (sy.system === "Furnace" && alde) return false;
	if (sy.id === "app") return model.family === "Classic" && (year == null || year >= 2025);
	if (sy.id === "footrest") return model.family === "Classic" && year != null && year >= 2021 && year <= 2025;
	if (sy.id === "ac-soft") return model.family === "Trade Wind" && year === 2024;
	if (sy.id === "victron") return matrixAllows("Victron MultiPlus", model, year) || matrixAllows("Cerbo GX", model, year);
	if (sy.id === "ac-stat") return matrixAllows("Coleman-Mach", model, year);
	if (sy.id === "furnace-flash") {
		const truma = matrixAllows("Truma Combi", model, year);
		const ducted = matrixAllows("Dometic furnace", model, year) || matrixAllows("Suburban NT furnace", model, year);
		if (truma && !ducted) return false;
	}
	if ((sy.id === "inverter-hot" || sy.id === "inverter-dead") && model.family === "World Traveler") return false;
	if (sy.fit === "gt") return model.family === "Globetrotter";
	return true;
}
function procedureFits(id, model, year) {
	if (model.family === "Other") return true;
	if (id === "tpms") return model.family === "Classic" && (year == null || year === 2027);
	if (id === "alde" || id === "valves") return coachHasAlde(model, year);
	if (id === "furnace") return !coachHasAlde(model, year);
	if (id === "anode") {
		const brands = waterBrands(model, year);
		if (!brands.size) return false;
		return brands.has("Suburban tank");
	}
	if (id === "descale") {
		if (coachHasAlde(model, year)) return false;
		if (TRUMA.has(model.id)) return false;
		const brands = waterBrands(model, year);
		if (!brands.size) return false;
		return TANKLESS.some((brand) => brands.has(brand));
	}
	return true;
}
function procedureBanner(id, model, year) {
	if (id === "winterize") return `This coach: blow-out ${model.blowPsi} at the city inlet. If the floor plan is wrong, stop at 30 psi.`;
	if (id === "bearings") return bearingNote(model);
	if (!procedureFits(id, model, year)) return `Not the factory setup on a ${model.short}. The steps stay here in case the coach was changed.`;
	return null;
}
/** A flowchart that names another coach's heater stays off this one. */
function flowFits(flow, model, year) {
	if (model.family === "Other") return true;
	if (flow.id === "maint-tpms") return procedureFits("tpms", model, year);
	if (flow.id === "myas") return model.family === "Classic" && (year == null || year >= 2025);
	if (flow.id === "furnace-flow") return !coachHasAlde(model, year);
	if (flow.id === "maint-truma") return matrixAllows("Truma Combi", model, year);
	if (flow.id === "maint-recirc") return model.family === "Trade Wind";
	if (flow.id === "alde-heat" || flow.id === "maint-valves" || flow.id === "maint-cushion" || flow.fit === "classic") return coachHasAlde(model, year);
	if (flow.fit === "gt") return model.family === "Globetrotter";
	return true;
}
var FAMILIES = [
	"frank lloyd wright",
	"world traveler",
	"flying cloud",
	"trade wind",
	"globetrotter",
	"basecamp",
	"international",
	"caravel",
	"classic",
	"stetson",
	"bambi"
];
function mentionsFamily(text, name) {
	const denial = new RegExp(`not\\s+(?:${FAMILIES.join("|")})(?:\\s+or\\s+(?:${FAMILIES.join("|")}))*`, "g");
	return text.toLowerCase().replace(denial, " ").includes(name);
}
function floorOf(model) {
	const named = /^(\d{2})/.exec(model.short);
	if (named) return Number(named[1]);
	const match = /^(\d+)/.exec(model.length);
	return match ? Number(match[1]) : null;
}
function yearSpan(startText, endText) {
	const start = Number(startText);
	let end = start;
	if (endText) {
		end = Number(endText);
		if (end < 100) end = Math.floor(start / 100) * 100 + end;
		if (end < start || end - start > 30) return [];
	}
	const years = [];
	for (let y = start; y <= end; y += 1) years.push(y);
	return years;
}
/** A year range that sits immediately in front of the family, and the floor that follows it. */
function campaignClauses(text, name) {
	const clauses = [];
	const re = new RegExp(`\\b((?:19|20)\\d{2})(?:\\s*[–-]\\s*((?:19|20)?\\d{2}))?\\s+${name}\\b`, "gi");
	const footMark = /^(?:['’′´`]|ft\b|foot\b|feet\b)/i;
	let match;
	while (match = re.exec(text)) {
		const before = text.slice(Math.max(0, match.index - 5), match.index).toLowerCase();
		if (/\bnot\s*$/.test(before)) continue;
		const years = yearSpan(match[1], match[2]);
		if (!years.length) continue;
		const after = text.slice(match.index + match[0].length);
		const feetLead = /^\s+(\d{2})(?!\d)/.exec(after);
		let feet = null;
		if (feetLead) {
			const rest = after.slice(feetLead[0].length).trimStart();
			const marked = footMark.test(rest);
			const word = /^[a-z]/i.test(rest);
			if (marked || !word) feet = Number(feetLead[1]);
		}
		clauses.push({
			years,
			feet
		});
	}
	return clauses;
}
function recallsFor(model, year) {
	if (model.family === "Other") return [];
	const name = model.family.toLowerCase();
	const feet = floorOf(model);
	return recalls.filter((r) => {
		if (!mentionsFamily(`${r.models} ${r.tell}`, name)) return false;
		if (year == null) return true;
		const clauses = [...campaignClauses(r.models, name), ...campaignClauses(r.tell, name)];
		if (!clauses.length) return false;
		const namedFloor = clauses.some((clause) => clause.feet != null);
		return clauses.some((clause) => {
			if (!clause.years.includes(year)) return false;
			if (clause.feet == null) return !namedFloor || feet == null;
			return feet != null && clause.feet === feet;
		});
	});
}
function coachBudget(model) {
	const fresh = model.fresh === "—" ? "Fresh tank is on the sticker" : `${model.fresh} gal fresh`;
	if (model.id === "tw27") return {
		fresh,
		power: "16 kWh pack, plus about 200 Ah of 12 V",
		note: "Harbinger usable capacity, and two 100 Ah batteries for the 12 V side. Store the pack at 25% or more. A 1,000 W generator only charges. The air conditioner wants about 4,000 W."
	};
	if (model.id === "tw23" || model.id === "tw25" || model.id === "bcxe") return {
		fresh,
		power: "810 Ah lithium",
		note: "About 9.7 kWh. Keep the inverter off unless you need it. The air conditioner wants about 4,000 W."
	};
	if (model.id === "flw") return {
		fresh,
		power: "100 Ah lithium",
		note: "One battery behind the LP cover. Inverter outlets are 2,000 W, so a hair dryer will empty it."
	};
	if (model.family === "Other") return {
		fresh,
		power: "See the battery label",
		note: "Pick the floor plan for a fresh-tank figure. Amp-hours are printed on the battery."
	};
	if (model.alde || model.family === "Globetrotter") return {
		fresh,
		power: "200 Ah lithium",
		note: "Two 100 Ah batteries. Lights and the furnace sip this. The inverter does not."
	};
	return {
		fresh,
		power: "About 200 Ah (2.5 kWh)",
		note: "Brochure lithium bank. Read the label before you count on it. Inverter loads empty it much faster than lights."
	};
}
//#endregion
export { tasks as C, vinProblem as D, vinOk as E, vinYear as O, symptomOn as S, vinMismatch as T, partBrandOk as _, coachBudget as a, recalls as b, coachYear as c, flowFits as d, matrixAllows as f, ownerIssues as g, models as h, cadenceLabel as i, waterBrands as k, codeFits as l, modelGroups as m, applianceFits as n, coachHasAlde as o, modelById as p, bearingNote as r, coachPart as s, aldeShownName as t, fitmentStanding as u, procedureBanner as v, tsbs as w, recallsFor as x, procedureFits as y };
