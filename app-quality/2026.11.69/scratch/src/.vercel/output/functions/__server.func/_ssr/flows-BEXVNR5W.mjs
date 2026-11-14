//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/flows-BEXVNR5W.js
function followFlow(flow, trail) {
	let nodeId = flow.start;
	const stack = [];
	for (const answer of trail) {
		const node = flow.nodes[nodeId];
		if (!node || node.type !== "ask") return null;
		const next = answer === "Yes" ? node.yes : answer === "No" ? node.no : "";
		if (!next || !flow.nodes[next]) return null;
		stack.push(nodeId);
		nodeId = next;
	}
	return {
		nodeId,
		stack
	};
}
/** Where Yes and No go. Does not pick a branch. Shared is set only when every ending on both sides is the same check. */
function waysFrom(flow, nodeId) {
	const node = flow.nodes[nodeId];
	if (!node || node.type !== "ask") return null;
	const yes = wayOf(flow, node.yes);
	const no = wayOf(flow, node.no);
	if (!yes || !no) return null;
	const yesKeys = endKeys(flow, node.yes);
	const noKeys = endKeys(flow, node.no);
	const only = yesKeys.size === 1 && noKeys.size === 1 ? [...yesKeys][0] : "";
	return {
		yes,
		no,
		shared: only && only === [...noKeys][0] ? keyOf(only) : null
	};
}
function wayOf(flow, id) {
	const node = flow.nodes[id];
	if (!node) return null;
	if (node.type === "ask") return {
		id,
		kind: "ask",
		label: node.q
	};
	return {
		id,
		kind: "end",
		label: node.title
	};
}
function keyOf(key) {
	if (key.startsWith("s:")) return { symptom: key.slice(2) };
	if (key.startsWith("p:")) return { procedure: key.slice(2) };
	return null;
}
function endKeys(flow, id) {
	const keys = /* @__PURE__ */ new Set();
	const seen = /* @__PURE__ */ new Set();
	function walk(next) {
		if (seen.has(next)) return;
		seen.add(next);
		const node = flow.nodes[next];
		if (!node) return;
		if (node.type === "end") {
			if (node.symptom) keys.add(`s:${node.symptom}`);
			else if (node.procedure) keys.add(`p:${node.procedure}`);
			return;
		}
		walk(node.yes);
		walk(node.no);
	}
	walk(id);
	return keys;
}
var flows = [
	{
		id: "dead-12",
		system: "Electrical",
		title: "No 12 V power",
		blurb: "Lights, pump, or jack are dead.",
		start: "disconnect",
		nodes: {
			disconnect: {
				type: "ask",
				q: "Is the battery disconnect ON?",
				detail: "An LP detector that stays on with the disconnect off is normal.",
				yes: "voltage",
				no: "turn-on"
			},
			"turn-on": {
				type: "end",
				title: "Turn the disconnect on",
				body: "Then recheck the lights. If only the tongue jack is dead, clean the ground at the three A-frame bolts.",
				symptom: "no-12v",
				level: "soon"
			},
			voltage: {
				type: "ask",
				q: "Is resting voltage healthy?",
				detail: "Lead-acid about 12.6 V or higher. Lithium above about 11.5 V. Under that, a lithium BMS is often shut off.",
				yes: "jack-only",
				no: "low-volts"
			},
			"low-volts": {
				type: "end",
				title: "Wake the battery, then the fuse",
				body: "Apply shore power, or charge each lithium battery, to wake a BMS cutoff. Do not charge lithium below 32 °F. A blown main fuse is replaced once at the same rating. If it blows again, stop and call a tech.",
				symptom: "no-12v",
				level: "soon"
			},
			"jack-only": {
				type: "ask",
				q: "Is only the tongue jack dead?",
				yes: "jack-ground",
				no: "shore"
			},
			"jack-ground": {
				type: "end",
				title: "A-frame ground",
				body: "Clean the ground at the three A-frame bolts down to bare metal and re-torque.",
				symptom: "no-12v"
			},
			shore: {
				type: "ask",
				q: "On shore power, does battery voltage climb toward 14 V?",
				yes: "cables",
				no: "converter"
			},
			cables: {
				type: "end",
				title: "Cables, ground, or the solenoid",
				body: "Clean cable ends to bare metal and re-torque the frame ground. A disconnect solenoid stuck under a bed has been a warranty item on some late units.",
				symptom: "no-12v"
			},
			converter: {
				type: "end",
				title: "The converter is not charging",
				body: "Check the cord, the pedestal breaker, and the EMS. A manual disconnect must be ON to charge. Stuck near 13.2–13.6 V is the wrong profile or a failed converter. Clear blocked converter vents.",
				symptom: "converter",
				level: "soon"
			}
		}
	},
	{
		id: "shore",
		system: "Electrical",
		title: "No 120 V, or a breaker trips",
		blurb: "Shore power is dead, hot, or a GFCI will not reset.",
		start: "smell",
		nodes: {
			smell: {
				type: "ask",
				q: "Is the inlet plug hot, or do you smell burning there?",
				yes: "recall",
				no: "breakers"
			},
			recall: {
				type: "end",
				title: "Stop. Do not keep using that inlet.",
				body: "A heat-damaged plug gets replaced. A burning smell at a SmartPlug inlet can be recall 23V-519. See Recalls before you plug in again.",
				symptom: "no-120",
				level: "stop",
				source: "NHTSA 23V-519. See Recalls."
			},
			breakers: {
				type: "ask",
				q: "Are the pedestal breaker and the trailer breakers on, and is the cord cool?",
				yes: "load",
				no: "reset"
			},
			reset: {
				type: "end",
				title: "Reset, then replace a damaged cord",
				body: "Reset the pedestal and the trailer breakers. Replace a plug or cord that has been hot.",
				symptom: "no-120",
				level: "stop"
			},
			load: {
				type: "ask",
				q: "Did it trip with the air conditioner and the electric water heater both on?",
				yes: "amps",
				no: "which"
			},
			amps: {
				type: "end",
				title: "You are over 30 A",
				body: "That pair often exceeds a 30 A pedestal. A soft start only cuts the surge. Switch the water heater to gas.",
				symptom: "no-120"
			},
			which: {
				type: "ask",
				q: "Are only the inverter outlets dead?",
				yes: "inverter",
				no: "gfci"
			},
			inverter: {
				type: "end",
				title: "Inverter outlets",
				body: "Turn the inverter on, reset its GFCI, and check the inverter fuse and battery voltage. The battery disconnect must be ON. Globetrotter E-1 through E-7 are in Fault codes.",
				symptom: "no-120"
			},
			gfci: {
				type: "end",
				title: "GFCI or the whole coach",
				body: "Unplug loads one at a time. A GFCI that will not reset gets replaced. Moisture in an outlet, the water-heater element, or the air conditioner is a common cause. If the whole coach is dead and the breakers are on, check the EMS and the pedestal.",
				symptom: "no-120",
				level: "soon"
			}
		}
	},
	{
		id: "water",
		system: "Plumbing",
		title: "No water, or the pump will not stop",
		blurb: "Nothing at the faucet, or the pump runs on.",
		start: "runs-on",
		nodes: {
			"runs-on": {
				type: "ask",
				q: "Does the pump run and never shut off, or does city water fill the fresh tank?",
				yes: "check-valve",
				no: "supply"
			},
			"check-valve": {
				type: "end",
				title: "Check valve or a winterize valve",
				body: "Temporary: disconnect city water, open the faucets, run the pump, close them, reconnect. A lasting fix is an external discharge check valve, or rebuild the pump. Confirm the winterize valve is on NORMAL USE and not installed backwards. A missing city regulator can over-pressurize the system.",
				symptom: "pump-runs",
				level: "soon"
			},
			supply: {
				type: "ask",
				q: "Is there water in the fresh tank, or is city water connected and the valve open?",
				yes: "pump",
				no: "fill"
			},
			fill: {
				type: "end",
				title: "No supply",
				body: "Fill the fresh tank, or open the city connection.",
				symptom: "no-water"
			},
			pump: {
				type: "ask",
				q: "Does the pump run?",
				yes: "strainer",
				no: "fuse"
			},
			fuse: {
				type: "end",
				title: "The pump has no power",
				body: "Check 12 V and the pump fuse.",
				symptom: "no-water",
				level: "soon"
			},
			strainer: {
				type: "ask",
				q: "Is the strainer cap cracked, or is the O-ring cross-threaded?",
				detail: "A cracked clear cap is common after winterizing.",
				yes: "prime",
				no: "valves"
			},
			prime: {
				type: "end",
				title: "Reseat and prime the strainer",
				body: "Fix the O-ring and cone washers. Prime the bowl with water and open a faucet. Do not run the pump dry more than a few minutes.",
				symptom: "no-water"
			},
			valves: {
				type: "ask",
				q: "Are the low-point drains closed, and is the winterize valve on NORMAL USE?",
				yes: "air",
				no: "close-drains"
			},
			"close-drains": {
				type: "end",
				title: "Close the drains",
				body: "Low-point drains and the heater drain must be closed. Put the winterize kit back on NORMAL USE.",
				symptom: "no-water"
			},
			air: {
				type: "end",
				title: "Air lock or a kink",
				body: "Open the faucets and run the pump. Look for a kink. Residual antifreeze or a closed heater bypass can block flow.",
				symptom: "no-water"
			}
		}
	},
	{
		id: "hot",
		system: "Water heater",
		title: "No hot water",
		blurb: "Tank heater, or an on-demand unit that starts and quits.",
		start: "tank",
		nodes: {
			tank: {
				type: "ask",
				q: "Is this a tank heater with a drain plug (Suburban, Atwood, or Dometic)?",
				yes: "bypass",
				no: "demand"
			},
			bypass: {
				type: "ask",
				q: "Are the inlet and outlet inline with the heater, and the bypass perpendicular?",
				yes: "full",
				no: "valves"
			},
			valves: {
				type: "end",
				title: "The heater is bypassed",
				body: "Set inlet and outlet inline. The bypass should be perpendicular for normal use.",
				symptom: "no-hot-tank"
			},
			full: {
				type: "ask",
				q: "Is the drain plug in, and is the tank completely full?",
				yes: "electric",
				no: "fill-tank"
			},
			"fill-tank": {
				type: "end",
				title: "Fill it before you heat",
				body: "Install the plug and fill the tank completely before electric or gas heat.",
				symptom: "no-hot-tank",
				level: "soon"
			},
			electric: {
				type: "ask",
				q: "Are you trying to heat on electric?",
				yes: "element",
				no: "gas"
			},
			element: {
				type: "end",
				title: "Electric side",
				body: "Check 120 V, the breaker, element continuity, and the high-limit reset. A weeping relief valve is replaced, never plugged. Suburban tanks need an anode. Atwood and Dometic aluminum tanks do not.",
				symptom: "no-hot-tank"
			},
			gas: {
				type: "end",
				title: "Gas side",
				body: "Confirm LP, the igniter, and the thermostat. Orifice cleaning is a technician job. Flush sediment. Suburban needs an anode. Never plug a weeping relief valve.",
				symptom: "no-hot-tank"
			},
			demand: {
				type: "ask",
				q: "Is it an on-demand heater (Truma, Girard, or Suburban ST)?",
				detail: "A Classic with Alde does not make hot water this way. Use the Alde flowchart.",
				yes: "flow",
				no: "alde-instead"
			},
			"alde-instead": {
				type: "end",
				title: "Only a Classic with Alde",
				body: "Alde is the heater only on a Classic. It is not the answer on a Globetrotter or any other floor. Go back and choose the tank or the on-demand path. If this Classic does have Alde, hot water and room heat share that loop.",
				symptom: "alde",
				level: "soon"
			},
			"unknown-heater": {
				type: "end",
				title: "Read the plate on the heater",
				body: "This coach does not have an Alde. The plate on the water heater names the maker. Use the tank questions or the on-demand questions only if that plate matches.",
				level: "soon"
			},
			flow: {
				type: "ask",
				q: "Is the hot tap fully open, with strong flow?",
				detail: "Suburban's spec table says 0.7 GPM. The same manual's owner page says 0.4. Girard starts at 0.70 GPM, later 0.60. AquaGo wants strong flow, about 0.9 GPM.",
				yes: "scale",
				no: "open-tap"
			},
			"open-tap": {
				type: "end",
				title: "Not enough flow to fire",
				body: "Open the hot tap fully. Remove shower restrictors. Do not use a shower pause button — cold crosses into the hot line and the heater cycles. On weak campground pressure, run the pump.",
				symptom: "tankless"
			},
			scale: {
				type: "end",
				title: "Air, altitude, scale, or a code",
				body: "Clear the intake. Above about 3,500 ft, slow the flow. Descale yearly: Suburban kit 521163, AquaGo tablets only. Match an E-code in Fault codes. If the stove flame dips when the heater fires, have the LP regulator tested.",
				symptom: "st-hot",
				level: "soon"
			}
		}
	},
	{
		id: "alde-heat",
		system: "Alde",
		title: "Alde will not heat the coach",
		blurb: "Classic hydronic heat. Cold rooms, noise, or lost fluid.",
		fit: "classic",
		start: "level",
		nodes: {
			level: {
				type: "ask",
				q: "With the system cold, is the glycol about 1 cm above MIN?",
				yes: "plug",
				no: "top-up"
			},
			"top-up": {
				type: "end",
				title: "Top up with Alde fluid only",
				body: "The wrong fluid makes a white precipitate. Parts 360371-301C (1 gal) or 360371-201C (5 gal). On a 2018 to early 2020 Classic, ask whether Bulletin 180 was done.",
				symptom: "alde",
				level: "soon"
			},
			plug: {
				type: "ask",
				q: "Is the plug icon showing (120 V present)?",
				yes: "setpoint",
				no: "no-120"
			},
			"no-120": {
				type: "end",
				title: "No 120 V to the Alde",
				body: "Check the breaker, the GFCI, and the cord under the dinette.",
				symptom: "alde"
			},
			setpoint: {
				type: "ask",
				q: "Does the boiler reach its set temperature while the coach stays cold?",
				yes: "tsb",
				no: "gurgle"
			},
			tsb: {
				type: "end",
				title: "Air, or a low expansion tank",
				body: "Airstream TSB 170. Fill the expansion tank to MAX with the same glycol. On a 30 ft Classic it is behind a false panel above the toilet. Run the circulation pump about 15 minutes, stop, and bleed. Repeat until the convectors get hot.",
				symptom: "alde-cold",
				level: "soon"
			},
			gurgle: {
				type: "ask",
				q: "Is it gurgling, or does the fluid level keep falling?",
				yes: "bleed",
				no: "burner"
			},
			bleed: {
				type: "end",
				title: "Bleed, or a Flow leak",
				body: "Run pump speed 5 about 15 minutes, or use the yellow air-gap valves. Bleed rear to front. A 3020 Flow that leaks short-cycles and wets the area under the unit. A 3030 Plus deletes the Flow. Repeated loss is a fitting, bleeder, or Flow leak.",
				symptom: "alde",
				level: "soon"
			},
			burner: {
				type: "end",
				title: "Burner or a panel message",
				body: "Power-cycle and check the fuses. A clogged exhaust stops the burner. Match the panel message in Fault codes. Every 10–14 days of use, pump off, open the heating-system safety valve a few seconds.",
				symptom: "alde"
			}
		}
	},
	{
		id: "furnace-flow",
		system: "Furnace",
		title: "Furnace will not stay lit",
		blurb: "Nothing, or it lights and then quits.",
		start: "blink",
		nodes: {
			blink: {
				type: "ask",
				q: "After a power cycle, does the board LED blink or stay on?",
				detail: "Cycle the battery disconnect first.",
				yes: "one",
				no: "dead"
			},
			dead: {
				type: "end",
				title: "No control power",
				body: "Check the furnace fuse and 12 V. Cycle the battery disconnect again.",
				symptom: "furnace",
				level: "soon"
			},
			one: {
				type: "ask",
				q: "Is it one blink?",
				detail: "One blink is airflow.",
				yes: "air",
				no: "two"
			},
			air: {
				type: "end",
				title: "Airflow",
				body: "The sail switch must close. A restricted return or a weak blower also trips the limit after ignition.",
				symptom: "furnace"
			},
			two: {
				type: "ask",
				q: "Is it two blinks, or does it light and then quit?",
				detail: "Two blinks is flame sense.",
				yes: "flame",
				no: "three"
			},
			flame: {
				type: "end",
				title: "Flame sense or gas",
				body: "LP should be about 11 in. water column. A collapsed pigtail starves the furnace. If it ignites and then shuts off, the flame sensor or a limit trip is next. Gas-valve work is for a technician.",
				symptom: "furnace",
				level: "soon"
			},
			three: {
				type: "ask",
				q: "Is it three blinks, or a lockout?",
				yes: "lock",
				no: "steady"
			},
			lock: {
				type: "end",
				title: "Ignition lockout",
				body: "On a Dometic DF, 4 flashes is high voltage and 5 flashes is low voltage. Older AFMD boards do not have those codes. Clear a hard lockout by turning the thermostat off for 10 seconds, then on. If the LP line has air, repeat up to 3 times. Do not keep retrying a gas valve.",
				symptom: "furnace",
				level: "soon"
			},
			steady: {
				type: "end",
				title: "Controller, or E1 on the thermostat",
				body: "A steady LED points at the controller. E1: reseat the RJ11. A broken blue wire has shown up on some Classics. A call test jumps the blue wires at the furnace.",
				symptom: "furnace"
			}
		}
	},
	{
		id: "brake-flow",
		system: "Running gear",
		title: "Brakes feel wrong",
		blurb: "Weak, grabby, or one wheel dragging. Do not tow if they will not stop the trailer.",
		start: "plug",
		nodes: {
			plug: {
				type: "ask",
				q: "Is the 7-way seated, and is the breakaway pin in?",
				yes: "grab",
				no: "connect"
			},
			connect: {
				type: "end",
				title: "Connect it before you move",
				body: "Seat the 7-way. The breakaway pin must be in for travel. A test pull is 20–30 seconds at most. Then synchronize the controller per Dexter.",
				symptom: "brakes",
				level: "stop",
				source: "Dexter, controller sync. 2027 books: leave the breakaway pin out no longer than 20–30 seconds."
			},
			grab: {
				type: "ask",
				q: "Do the brakes grab hard, or does one wheel drag?",
				yes: "gain",
				no: "sit"
			},
			gain: {
				type: "end",
				title: "Gain, or a brake that will not release",
				body: "Gain set too high makes them harsh. A 2023 Globetrotter complaint was a right-rear brake that would not release; the assembly cited was Dexter K23-459-00. Confirm by VIN. Do not tow if a wheel will not release.",
				symptom: "brakes",
				level: "stop",
				source: "Owner report, 2023 Globetrotter. Assembly cited: Dexter K23-459-00. Not a page in the owner’s manual."
			},
			sit: {
				type: "ask",
				q: "Are they weak only after the trailer has been sitting?",
				yes: "rust",
				no: "one-side"
			},
			rust: {
				type: "end",
				title: "Surface rust",
				body: "Several moderate stops usually clear it. If one drum stays cold after a drive, that side is not working.",
				symptom: "brakes"
			},
			"one-side": {
				type: "ask",
				q: "After a short drive, is one drum cold while the others are warm?",
				yes: "open-circuit",
				no: "adjust"
			},
			"open-circuit": {
				type: "end",
				title: "One side is not working",
				body: "An open circuit, or that brake is out of adjustment. Expect about 3 A per magnet. Confirm the amps on the Dexter chart for your brake size.",
				symptom: "brakes",
				level: "stop",
				source: "Dexter magnet chart for the brake size. 2025 manual: inspect yearly or every 12,000 miles."
			},
			adjust: {
				type: "end",
				title: "Adjustment, or the drums",
				body: "Manual brakes: adjust at 200 miles, then every 3,000. Self-adjusting brakes still need a yearly look. Lock-up can be an out-of-round drum. Brakes that come on with the running lights mean water in a light corroded the harness.",
				symptom: "brakes",
				level: "soon"
			}
		}
	},
	{
		id: "lp-flow",
		system: "Propane",
		title: "Gas smell, alarm, or a weak flame",
		blurb: "A smell or an alarm is a stop. A weak flame is the next branch.",
		start: "smell",
		nodes: {
			smell: {
				type: "ask",
				q: "Do you smell propane, or is the LP alarm sounding?",
				yes: "stop",
				no: "flame"
			},
			stop: {
				type: "end",
				title: "Stop. Shut the gas off.",
				body: "No flames and no new switches. Shut the cylinder valves. Ventilate. Find the leak with soapy water or a manometer, never a flame. Do not reset the alarm until you know the source.",
				symptom: "lp-alarm",
				level: "stop",
				source: "Owner’s manuals, detector section: the replacement date is printed on the detector. Leak test is soapy water or a manometer."
			},
			flame: {
				type: "ask",
				q: "Is the stove flame weak, or does it dip when the water heater fires?",
				yes: "regulator",
				no: "quick"
			},
			regulator: {
				type: "end",
				title: "Reset excess-flow, then test pressure",
				body: "Turn appliances off, reconnect, and open the cylinder valve slowly. Look for liquid in a low spot and a collapsed pigtail. Running pressure is about 11 in. water column. Lock-up should be at or under 14. A dipping flame when the heater fires has been a failing regulator.",
				symptom: "lp",
				level: "soon"
			},
			quick: {
				type: "ask",
				q: "Is a quick-connect appliance in use?",
				yes: "second-reg",
				no: "age"
			},
			"second-reg": {
				type: "end",
				title: "Two regulators in series",
				body: "Remove that appliance’s own regulator or it will starve.",
				symptom: "lp"
			},
			age: {
				type: "end",
				title: "Regulator age and the vent",
				body: "Plan on replacement around 8–10 years. Check the 2021 Winntec recall if that regulator is fitted. Keep the regulator vent clear.",
				symptom: "lp"
			}
		}
	},
	{
		id: "fridge-flow",
		system: "Refrigerator",
		title: "Fridge is warm, or it freezes food",
		blurb: "12 V compressor, or an older absorption fridge.",
		start: "pattern",
		nodes: {
			pattern: {
				type: "ask",
				q: "Is the freezer cold while the fridge compartment is warm?",
				yes: "board",
				no: "kind"
			},
			board: {
				type: "end",
				title: "12 V fridge: board or fan",
				body: "Often the control board or the evaporator fan. Owners also check the eyebrow board behind the top panel. Do not run both compartments at 5. Keep the rear vents clear, and confirm the door latch is not on the storage tab. Pulling a fuse is only a temporary workaround.",
				symptom: "fridge",
				level: "soon"
			},
			kind: {
				type: "ask",
				q: "Is this an older absorption fridge (LP / AC / Auto)?",
				yes: "absorb",
				no: "seals"
			},
			absorb: {
				type: "ask",
				q: "Is there yellow residue at the cooling unit?",
				yes: "leak",
				no: "level-it"
			},
			leak: {
				type: "end",
				title: "Stop. Possible cooling-unit leak.",
				body: "An ammonia smell, or yellow residue, means stop. Turn it off, keep the doors closed, ventilate, close the LP, unplug 120 V, and call a pro.",
				symptom: "fridge",
				level: "stop"
			},
			"level-it": {
				type: "end",
				title: "Level, mode, and the flue",
				body: "Level the trailer. Check LP / AC / Auto, the exterior fuse, and the front board. Clean the burner and flue. It struggles above about 85 °F. Check door seals and blocked vents.",
				symptom: "fridge"
			},
			seals: {
				type: "ask",
				q: "Is it freezing food?",
				yes: "stat",
				no: "vents"
			},
			stat: {
				type: "end",
				title: "Thermostat or thermistor",
				body: "That is the usual cause when a compressor fridge freezes food. Secop flash codes, if your unit has that LED, are in Fault codes.",
				symptom: "fridge"
			},
			vents: {
				type: "end",
				title: "Seals and airflow",
				body: "Door seals and blocked vents first. Then the control board if the compartment will not pull down.",
				symptom: "fridge"
			}
		}
	},
	{
		id: "ac-flow",
		system: "Air conditioning",
		title: "Air conditioner will not cool",
		blurb: "Dead, warm air, a drip, or a breaker that trips.",
		start: "trip",
		nodes: {
			trip: {
				type: "ask",
				q: "Does the breaker trip when the air conditioner and the electric water heater are both on?",
				yes: "overload",
				no: "ice"
			},
			overload: {
				type: "end",
				title: "You are over 30 A",
				body: "That pair often exceeds a 30 A pedestal. A soft start only cuts the surge. Switch the water heater to gas.",
				symptom: "ac"
			},
			ice: {
				type: "ask",
				q: "Is the filter dirty, or is the coil iced?",
				yes: "thaw",
				no: "e1"
			},
			thaw: {
				type: "end",
				title: "Clean it, and let it thaw",
				body: "Rinse or blow the filter every two weeks while the air conditioner is in use. An iced coil has to thaw fully before you restart. Clear the drain. Do not caulk the interior ceiling opening.",
				symptom: "ac"
			},
			e1: {
				type: "ask",
				q: "Does the thermostat show E1, or is a status light flashing?",
				yes: "reset",
				no: "hum"
			},
			reset: {
				type: "end",
				title: "Reseat the thermostat lead",
				body: "Reseat the RJ11 plugs at the roof boards. Status-light meanings are in Fault codes.",
				symptom: "ac-stat"
			},
			hum: {
				type: "ask",
				q: "Does it hum, or start and then quit?",
				yes: "cap",
				no: "trade"
			},
			cap: {
				type: "end",
				title: "Capacitor",
				body: "Power off, and discharge the capacitor before you touch the terminals. Match the microfarad rating exactly.",
				symptom: "ac",
				level: "soon"
			},
			trade: {
				type: "ask",
				q: "Is a 2024 Trade Wind soft-start hot, or does it smell?",
				yes: "recall",
				no: "tech"
			},
			recall: {
				type: "end",
				title: "Stop. Soft-start recall.",
				body: "A hot or smelly soft-start on a 2024 Trade Wind can be recall 24V-656. Stop using it and call a dealer. See Recalls.",
				symptom: "ac",
				level: "stop",
				source: "NHTSA 24V-656. See Recalls."
			},
			tech: {
				type: "end",
				title: "Refrigerant, valve, or a board",
				body: "If the compressor runs and the air stays warm, the reversing valve, the charge, or a control board is a technician job.",
				symptom: "ac-warm",
				level: "soon"
			}
		}
	},
	{
		id: "myas",
		system: "Electrical",
		title: "MyAirstream will not connect",
		blurb: "2025 and newer Classic. The pairing steps are owner-reported.",
		fit: "classic",
		start: "loose",
		nodes: {
			loose: {
				type: "ask",
				q: "Are connectors or DC wires behind the panel loose?",
				detail: "Owner-reported on a 28RB: reseating them cleared “no communication.”",
				yes: "reseat",
				no: "official"
			},
			reseat: {
				type: "end",
				title: "Reseat and tighten",
				body: "Reseat the panel connectors and tighten the DC wires. Then reboot the display and open the app again.",
				symptom: "app"
			},
			official: {
				type: "ask",
				q: "Is the app on the phone named MyAirstream?",
				yes: "held",
				no: "wrong-app"
			},
			"wrong-app": {
				type: "end",
				title: "Use the official app",
				body: "Install the app named MyAirstream. A similarly named app will not pair.",
				symptom: "app"
			},
			held: {
				type: "ask",
				q: "Have you already held the module button about 30 seconds?",
				detail: "Blue light on, then reboot the display and force-quit the app. Owner-reported.",
				yes: "prior",
				no: "pair"
			},
			pair: {
				type: "end",
				title: "Put the module in pairing mode",
				body: "Under the closet, right-hand panel: hold the button on the module with the blue light for about 30 seconds. Reboot the display. Force-quit MyAirstream and open it again.",
				symptom: "app"
			},
			prior: {
				type: "ask",
				q: "Was this coach registered to a previous owner?",
				yes: "release",
				no: "tpms"
			},
			release: {
				type: "end",
				title: "Ask Airstream to release it",
				body: "The system registers to one owner. Email Airstream support to release the previous owner. Owner-reported. First pairing is the coach modem and Bluetooth, not campground Wi-Fi.",
				symptom: "app"
			},
			tpms: {
				type: "ask",
				q: "Is tire pressure the only thing missing from the panel?",
				yes: "goset",
				no: "support"
			},
			goset: {
				type: "end",
				title: "Teach the panel the sensors",
				body: "Use GO/SET the way the Classic manual describes it (2027 manual, about page 5-17). That is a tire display step, not an app-pairing failure.",
				symptom: "tires"
			},
			support: {
				type: "end",
				title: "Airstream support or a dealer",
				body: "If the wires are tight, the official app is installed, and pairing was already tried, this is a support or dealer job.",
				symptom: "app"
			}
		}
	},
	{
		id: "tanks",
		system: "Plumbing",
		title: "Tanks, sensors, or the toilet",
		blurb: "Gray in the shower, a lying monitor, odor, or a valve that will not seal.",
		start: "gray",
		nodes: {
			gray: {
				type: "ask",
				q: "Is gray water coming up in the shower?",
				yes: "nose",
				no: "odor"
			},
			nose: {
				type: "ask",
				q: "Is the nose of the trailer low?",
				yes: "raise",
				no: "gulp"
			},
			raise: {
				type: "end",
				title: "Level it, nose higher",
				body: "Level the trailer. Raising the front stopped one owner-reported backup. If gray still comes up, clear the roof vent and look at the AAV or HepvO.",
				symptom: "gray-shower"
			},
			gulp: {
				type: "ask",
				q: "Do you hear gulp-gulp at the roof vent when a sink drains?",
				yes: "stack",
				no: "aav"
			},
			stack: {
				type: "end",
				title: "The vent stack is blocked",
				body: "Clear the roof vent. A blocked stack also makes a dump valve gulp.",
				symptom: "gray-shower"
			},
			aav: {
				type: "end",
				title: "Vent, AAV, or HepvO",
				body: "Gray in the shower after a full sink is a vent or AAV problem. A HepvO after the sink trap has stopped small backups. It will not fix a blocked roof vent. A monitor that reads full when the tank is not is only a rough guide. Dielectric grease and a recalibration are owner-reported.",
				symptom: "gray-shower"
			},
			odor: {
				type: "ask",
				q: "Is there black-tank odor in a closet or cabinet?",
				yes: "closet",
				no: "seal"
			},
			closet: {
				type: "end",
				title: "Flush check valve or vacuum breaker",
				body: "That odor is usually a failed flush check valve or vacuum breaker. A brass Valterra is the preferred replacement. Tank chemicals stay limited to small amounts of household ammonia or TSP. No petroleum distillates, dish soap, or abrasives.",
				symptom: "black-tank",
				level: "soon"
			},
			seal: {
				type: "ask",
				q: "Will a dump valve not seal?",
				yes: "gate",
				no: "flush-line"
			},
			gate: {
				type: "end",
				title: "Lubricate, soak, or replace the gate",
				body: "Freeze-warped gates are common. Lubricate and soak first. Replace the valve if it still leaks.",
				symptom: "black-tank"
			},
			"flush-line": {
				type: "ask",
				q: "After winterizing, does the toilet or the black-tank flush still hold water?",
				yes: "missed",
				no: "monitor"
			},
			missed: {
				type: "end",
				title: "A valve was skipped",
				body: "The blow-out missed the toilet valve or the black-tank flush line. Open those and drain them. The clear pump-strainer cap often cracks in a freeze.",
				symptom: "black-tank"
			},
			monitor: {
				type: "ask",
				q: "Does the monitor say full when the tank is not?",
				yes: "sensors",
				no: "tech"
			},
			sensors: {
				type: "end",
				title: "Treat the monitor as a rough guide",
				body: "Probe sensors lie when they are coated. Dielectric grease and a recalibration are owner-reported. Confirm the tank by looking, not by the lights alone.",
				symptom: "gray-shower"
			},
			tech: {
				type: "end",
				title: "A plumbing tech",
				body: "If gray, odor, the valve, and the monitor are all fine, this is a plumbing job. Do not pour petroleum distillates, dish soap, or abrasives into the tanks.",
				symptom: "black-tank"
			}
		}
	},
	{
		id: "body",
		system: "Body & gear",
		title: "Leak, soft floor, or a stuck door",
		blurb: "Rain versus a plumbing drip, then the door, a window, or the awning.",
		start: "dry",
		nodes: {
			dry: {
				type: "ask",
				q: "Does the leak show on a dry day, and stop when the water is off?",
				yes: "plumbing",
				no: "roof"
			},
			plumbing: {
				type: "end",
				title: "This is plumbing, not the roof",
				body: "Check P-traps and the pump fittings. A rain leak does not stop the moment you turn the pump off.",
				symptom: "leaks"
			},
			roof: {
				type: "ask",
				q: "Is water coming from a roof vent, skylight, fan flange, or loose rivets?",
				yes: "reseal",
				no: "soft"
			},
			reseal: {
				type: "end",
				title: "Reseal the opening",
				body: "Sikaflex 221 or Adseal at fixtures. Loose rivets get sealed too. Most roofs are not a walking surface. Use the stepped areas.",
				symptom: "leaks"
			},
			soft: {
				type: "ask",
				q: "Is the floor soft, or is water showing up far from any wet seam?",
				yes: "floor",
				no: "door"
			},
			floor: {
				type: "end",
				title: "Stop using that floor",
				body: "Water travels inside the double wall, including toward the belly and the bumper lids. Stop, probe the spot, and use a moisture meter. A small dry area can be dried and epoxied. A large soft area is a specialist job.",
				symptom: "soft-floor",
				level: "stop"
			},
			door: {
				type: "ask",
				q: "Will the entry door not latch?",
				yes: "level",
				no: "window"
			},
			level: {
				type: "ask",
				q: "Is the trailer out of level, or are the stabilizers forcing the shell?",
				detail: "Stabilizers are not for leveling. The door is slightly over-bent so it seals.",
				yes: "unlevel",
				no: "striker"
			},
			unlevel: {
				type: "end",
				title: "Level the trailer first",
				body: "An out-of-level shell twists the door opening. Check the fit before and after the stabilizers. Adjust the striker only after it is level.",
				symptom: "door"
			},
			striker: {
				type: "end",
				title: "Striker, screen, or sheared rivets",
				body: "The striker bolt is adjustable. A rubbing screen door can push the main door. Sheared rivets on the interior door skin mean the door came open in the wind. Dry graphite in the locks.",
				symptom: "door"
			},
			window: {
				type: "ask",
				q: "Is a window stuck shut?",
				yes: "ease",
				no: "awning"
			},
			ease: {
				type: "end",
				title: "Do not force the window",
				body: "Unlatch it. Slide a nylon wedge with 303 Protectant around the seal, starting at a corner. Then clean and treat the seal.",
				symptom: "window-stuck"
			},
			awning: {
				type: "ask",
				q: "Is the awning stuck?",
				yes: "override",
				no: "shop"
			},
			override: {
				type: "end",
				title: "Manual override only",
				body: "Use that awning’s manual retraction. Never force a power awning.",
				symptom: "awning",
				level: "soon"
			},
			shop: {
				type: "end",
				title: "A body shop, or an Airstream dealer",
				body: "If the water path is still hidden after the roof, the belly, and the bumper lids, this is a body-shop job.",
				symptom: "leaks",
				level: "soon"
			}
		}
	},
	{
		id: "tires-flow",
		system: "Running gear",
		title: "Tires, sway, or a hot hub",
		blurb: "Cold pressure, the panel display, inside-edge wear, or bearing play.",
		start: "hot",
		nodes: {
			hot: {
				type: "ask",
				q: "Is a hub hot, growling, or loose?",
				yes: "sealed",
				no: "cold"
			},
			sealed: {
				type: "ask",
				q: "Is it a sealed Nev-R-Lube hub?",
				detail: "Most 2024 and newer trailers. Acceptable end play is 0.001–0.010 in. Do not grease it.",
				yes: "nrl",
				no: "cone"
			},
			nrl: {
				type: "end",
				title: "Stop. Do not tow on that hub.",
				body: "End play outside 0.001–0.010 in is a Dexter job. Do not grease a Nev-R-Lube cartridge, and do not keep driving on a failed bearing or brake.",
				symptom: "bearing",
				level: "stop",
				source: "2025 International manual: end play 0.001–0.010 in. Dexter’s 42 mm cartridge limit is tighter."
			},
			cone: {
				type: "end",
				title: "Stop. Match the cone and cup.",
				body: "A conventional hub is repacked, not greased through a fitting if it is not an E-Z Lube. Match the Dexter cone and cup, and confirm the stamp. Airstream hub class is not in the parts books. Do not tow on a failed bearing.",
				symptom: "bearing",
				level: "stop",
				source: "Dexter conventional-hub procedure. Airstream hub class is not in the parts books."
			},
			cold: {
				type: "ask",
				q: "Are the cold pressures off the sticker for this load?",
				detail: "Idle at least 3 hours. The maximum on a spec chart is not the pressure for your load.",
				yes: "setpsi",
				no: "panel"
			},
			setpsi: {
				type: "end",
				title: "Set the cold pressure",
				body: "Use the placard for the load, including the spare. Recheck after the tires have sat.",
				symptom: "tires",
				level: "stop"
			},
			panel: {
				type: "ask",
				q: "Is tire pressure missing on a 2025 or newer Classic panel?",
				yes: "goset",
				no: "inside"
			},
			goset: {
				type: "end",
				title: "GO/SET on the panel",
				body: "The 2027 Classic manual describes GO/SET around page 5-17. A blank panel is not the same as a flat tire. Still confirm the cold pressure with a gauge.",
				symptom: "tires"
			},
			inside: {
				type: "ask",
				q: "Is the inside edge of the tread wearing?",
				yes: "align",
				no: "sway"
			},
			align: {
				type: "end",
				title: "Alignment, not a weld",
				body: "2025–27 Classic and Globetrotter spec: toe-in 1/16 in each side, camber 3/4° positive, both about ± the same amount. Dexter will not weld torsion axles.",
				symptom: "tires",
				level: "soon"
			},
			sway: {
				type: "ask",
				q: "Does the trailer sway?",
				yes: "hitch",
				no: "still"
			},
			hitch: {
				type: "end",
				title: "Hitch and tongue weight",
				body: "Set the weight-distribution hitch and hold about 10–15% tongue weight. Match the tire pressures. Do not stab the brakes or the throttle while it is correcting.",
				symptom: "sway",
				level: "stop"
			},
			still: {
				type: "end",
				title: "A Dexter-qualified tech",
				body: "If pressure, the panel, the tread, and sway are all fine, look next at a bent axle, loose U-bolts, and tongue weight. Do not tow on a failed bearing or brake.",
				symptom: "tires",
				level: "soon"
			}
		}
	},
	{
		id: "winter",
		system: "Plumbing",
		title: "Winterize, or pink water in spring",
		blurb: "Air caps differ. 50 psi on most 2027 lines. 30 psi on Globetrotter, Trade Wind, Frank Lloyd Wright, and Stetson.",
		start: "spring",
		nodes: {
			spring: {
				type: "ask",
				q: "In spring, is the water pink, is there no hot water, or does the pump cycle?",
				yes: "left",
				no: "blowing"
			},
			left: {
				type: "ask",
				q: "Is the heater still bypassed, or is a drain still open?",
				yes: "restore",
				no: "spots"
			},
			restore: {
				type: "end",
				title: "Put it back to normal use",
				body: "Return the bypass and the winterize kit to normal. Close the low-point drains. Flush until the pink is gone, then sanitize the fresh system before anyone drinks it. Check the mixing-valve screen. A coach can come back from service still winterized. Confirm before the first use.",
				symptom: "no-water"
			},
			spots: {
				type: "end",
				title: "A fixture was skipped",
				body: "Open the toilet, the outdoor shower, and the black-tank flush. Look at the pump strainer — the clear cap often cracks. Residual antifreeze in one of those lines tastes pink and can make the pump cycle.",
				symptom: "no-water"
			},
			blowing: {
				type: "ask",
				q: "Are you about to blow the lines out with air?",
				yes: "cap-known",
				no: "pink"
			},
			"cap-known": {
				type: "ask",
				q: "Do you know the air cap in this coach’s manual?",
				detail: "50 psi max: Bambi, Basecamp, Caravel, Flying Cloud, International, World Traveler, Classic. 30 psi max: Globetrotter, Trade Wind, Frank Lloyd Wright, Stetson.",
				yes: "known",
				no: "unknown"
			},
			known: {
				type: "end",
				title: "Stay at or under that cap",
				body: "Never use a higher pressure. On a Classic, close Alde valves 1 and 2 before you add air, and stop at 50 psi. Globetrotter, Trade Wind, Frank Lloyd Wright, and Stetson stop at 30. On a Truma Combi, bypass the heater and do not blow air through it. Cycle one faucet at a time. Do not skip the toilet, outdoor shower, or strainer.",
				procedure: "winterize"
			},
			unknown: {
				type: "end",
				title: "Use 30 psi until you read the manual",
				body: "Globetrotter, Trade Wind, Frank Lloyd Wright, and Stetson stop at 30 psi. The other 2027 lines stop at 50. If you are not sure, stay at 30. Drain and bypass the heater first. Never invert a higher pressure into the city inlet.",
				symptom: "no-water",
				level: "soon"
			},
			pink: {
				type: "ask",
				q: "Are you pumping RV antifreeze through the lines?",
				yes: "anti",
				no: "either"
			},
			anti: {
				type: "end",
				title: "Heater drained and bypassed",
				body: "The heater must be drained and bypassed before pink fluid. On a Truma Combi, antifreeze must not enter the heater — inlet and outlet closed, bypass open, drain left open. Run each fixture until pink shows. Return the winterize-kit handle the way the tag says once the lines are full.",
				procedure: "winterize"
			},
			either: {
				type: "end",
				title: "Follow this year’s manual",
				body: "Air-only and antifreeze are both used. The manual for this model year decides. Do not exceed the air cap. Open the toilet, outdoor shower, black flush, and pump strainer either way.",
				symptom: "no-water"
			}
		}
	},
	{
		id: "smartplug",
		system: "Electrical",
		title: "Shore inlet is hot, or there is no 120 V",
		blurb: "A warm SmartPlug, a burned cord, or a dead pedestal.",
		start: "hot",
		nodes: {
			hot: {
				type: "ask",
				q: "Is the shore plug or the inlet warm, or do you smell burning there?",
				yes: "stop",
				no: "color"
			},
			stop: {
				type: "end",
				title: "Stop. Do not keep using that inlet.",
				body: "Unplug it. A burning smell at a SmartPlug inlet can be recall 23V-519, the bronze D-ring. Replace a heat-damaged plug and cord before you connect again. See Recalls.",
				symptom: "no-120",
				level: "stop",
				source: "NHTSA 23V-519. See Recalls."
			},
			color: {
				type: "ask",
				q: "Is the cord or the plug discolored?",
				yes: "replace",
				no: "ped"
			},
			replace: {
				type: "end",
				title: "Replace the heat-damaged cord",
				body: "A discolored plug or cord has already been hot. Replace it. Do not tape it and keep camping.",
				symptom: "no-120",
				level: "stop"
			},
			ped: {
				type: "ask",
				q: "Is the pedestal breaker off?",
				yes: "reset",
				no: "inlet"
			},
			reset: {
				type: "end",
				title: "Reset the pedestal",
				body: "Turn the pedestal breaker on. If it trips again, open the No 120 V flowchart — overload and GFCI are the next questions, not a new inlet.",
				symptom: "no-120"
			},
			inlet: {
				type: "ask",
				q: "Does the inlet itself look damaged, loose, or like the wrong amp rating?",
				yes: "part",
				no: "next"
			},
			part: {
				type: "end",
				title: "Match the inlet before you order",
				body: "Globetrotter inlet 513797 is no longer available. The current gray inlet is 514453-01. Classic inlet 513581 is labeled both 30 A and 50 A in the book — confirm the amp rating on the inlet. If a new inlet still leaves the coach dark, continue with the No 120 V flowchart.",
				symptom: "no-120",
				level: "soon"
			},
			next: {
				type: "end",
				title: "The inlet is not the fault",
				body: "Breakers, a GFCI that will not reset, and a 30 A overload (air conditioner plus electric water heater) are next. Open the No 120 V flowchart.",
				symptom: "no-120"
			}
		}
	},
	{
		id: "solar-flow",
		system: "Electrical",
		title: "Solar is not charging",
		blurb: "The panels are in the sun and the batteries are not rising.",
		start: "full",
		nodes: {
			full: {
				type: "ask",
				q: "Are the batteries already full?",
				detail: "A controller that rests when the bank is full is normal.",
				yes: "resting",
				no: "zero"
			},
			resting: {
				type: "end",
				title: "That can be normal",
				body: "Draw the batteries down and look again. If it still will not charge, continue with the voltage checks.",
				symptom: "solar"
			},
			zero: {
				type: "ask",
				q: "Do the panel leads read about 0 V in the sun?",
				yes: "open",
				no: "sensed"
			},
			open: {
				type: "end",
				title: "Shade, a connector, or a fuse",
				body: "Look for shade, a loose MC4, or a blown fuse. While you are on the roof, tape any solar-wire clip the factory tape has let go, and look for a cracked panel.",
				symptom: "solar"
			},
			sensed: {
				type: "ask",
				q: "Is the panel voltage a strange number, such as about 21 V?",
				detail: "That can mean the controller sensed 24 V.",
				yes: "reset",
				no: "lights"
			},
			reset: {
				type: "end",
				title: "Reset the sense order",
				body: "Disconnect PV+, then battery+. Wait, then reconnect the battery first, then the panels. The 24 V chart walks that reset.",
				symptom: "solar"
			},
			lights: {
				type: "end",
				title: "Read the SmartSolar lights",
				body: "Blue blinking is not charging. Green blinking alone is too hot. Blue and green is over-current. Yellow and green is panel voltage too high. Yellow alone is a network or BMS problem. Blue and yellow together is an internal error. Confirm the controller says SmartSolar. A shunt that reads backwards has its two negative cables swapped.",
				symptom: "solar"
			}
		}
	},
	{
		id: "charge",
		system: "Electrical",
		title: "Plugged in, batteries stay flat",
		blurb: "Shore power is on and the voltage never climbs. Cold lithium is its own branch.",
		start: "cold",
		nodes: {
			cold: {
				type: "ask",
				q: "Is the battery bay below about 35 °F?",
				yes: "heater",
				no: "disconnect"
			},
			heater: {
				type: "end",
				title: "Warm the lithium bank first",
				body: "Factory lithium often will not charge below about 35 °F. Turn the battery heater on, red showing. Do not charge a lithium bank below 32 °F. Turn the heater off for storage.",
				symptom: "lithium-cold",
				level: "soon"
			},
			disconnect: {
				type: "ask",
				q: "Is a manual battery disconnect ON?",
				detail: "Electronic disconnects usually still charge when off.",
				yes: "output",
				no: "turn-on"
			},
			"turn-on": {
				type: "end",
				title: "Turn the disconnect on",
				body: "A manual disconnect has to be ON before the converter can charge. Then measure again.",
				symptom: "converter"
			},
			output: {
				type: "ask",
				q: "With the battery disconnected, is the converter output in range?",
				detail: "About 13.6 V is normal. Boost is about 14.4 V. A lithium profile should sit around 13.6–14.0 V on shore power. The bench sheet and the lithium owner’s page do not use the same lithium number.",
				yes: "bank",
				no: "converter-fault"
			},
			bank: {
				type: "end",
				title: "The converter is working",
				body: "The fault is the battery or the wiring. Under about 11.5 V is often a BMS cutoff. Apply shore power, or charge each battery, to wake it. A low-voltage disconnect should wake within about 24 hours.",
				symptom: "lithium-cold"
			},
			"converter-fault": {
				type: "end",
				title: "Converter, profile, or an overheat",
				body: "Confirm a lithium-compatible profile if the bank is lithium. Clear the vents. An overheat shutdown is common. With low batteries, bulk current should be more than about 30 A.",
				symptom: "converter",
				level: "soon"
			}
		}
	},
	{
		id: "inverter-flow",
		system: "Electrical",
		title: "Inverter outlets are dead",
		blurb: "The other outlets work. Only the inverter outlets are dark, or the inverter shuts down.",
		start: "only",
		nodes: {
			only: {
				type: "ask",
				q: "Are the ordinary outlets still live, and only the inverter outlets dead?",
				yes: "switch",
				no: "whole"
			},
			whole: {
				type: "end",
				title: "This is shore power, not the inverter",
				body: "If the whole coach is dark, open the No 120 V flowchart. Pedestal, breakers, and a warm cord come before the inverter.",
				symptom: "no-120",
				level: "stop"
			},
			switch: {
				type: "ask",
				q: "Is the inverter switch on, and the battery disconnect ON?",
				yes: "gfci",
				no: "enable"
			},
			enable: {
				type: "end",
				title: "Turn both on",
				body: "The disconnect has to be ON for the inverter to run. Then check battery voltage.",
				symptom: "inverter-dead"
			},
			gfci: {
				type: "ask",
				q: "Did its own breaker or GFCI trip, or is the case hot?",
				yes: "reset",
				no: "code"
			},
			reset: {
				type: "end",
				title: "Reset, then shed the load",
				body: "Reset the inverter fuse or breaker, then the GFCI. If it overheats, let it cool and run less at once. A MultiPlus overload light means reduce the load.",
				symptom: "inverter-hot"
			},
			code: {
				type: "end",
				title: "Read the code on the label",
				body: "A PD1600 inverter: E-1 is a low battery and it restarts near 12.0 V. E-2 is a high battery. E-3 or E-6 is an overload or a short. The same E-number on a Progressive Industries EMS is a pedestal fault. If the light flashes opposite the charge lights, that is a VE.Bus code. Read the label.",
				symptom: "pd-code"
			}
		}
	},
	{
		id: "pressure",
		system: "Plumbing",
		title: "A hose blows, or the relief valve weeps",
		blurb: "Campground pressure, the inlet regulator, or the heater relief. Never plug the valve.",
		start: "drip",
		nodes: {
			drip: {
				type: "ask",
				q: "Is water coming from the heater relief valve, not from the hose or the city inlet?",
				yes: "which",
				no: "hose"
			},
			hose: {
				type: "ask",
				q: "Does the hose jump, or has campground pressure been over about 50 psi?",
				detail: "Owners have measured 80–100 psi, and it can change overnight.",
				yes: "reg",
				no: "inside"
			},
			reg: {
				type: "end",
				title: "Regulate it at the spigot",
				body: "The 2027 manuals rate the factory inlet regulator at 50 psi. Manuals from 2014 through 2016 say 65 psi. An adjustable regulator with a gauge, set near 50 psi, protects the hose. A cheap fixed regulator can starve a tankless heater. Turn the spigot off when you leave.",
				symptom: "city-psi",
				level: "soon"
			},
			inside: {
				type: "end",
				title: "The inlet regulator may be leaking inside",
				body: "A failed plastic regulator, on the inside wall behind the city inlet, can leak into the wall. That is not a roof leak.",
				symptom: "city-psi"
			},
			which: {
				type: "ask",
				q: "Is this a tank heater, not a tankless unit?",
				yes: "tank",
				no: "tankless"
			},
			tank: {
				type: "end",
				title: "Replace the valve. Do not plug it.",
				body: "A weeping tank relief is replaced, never capped. Flush sediment, and confirm the tank was full before you heated it.",
				symptom: "relief",
				level: "soon"
			},
			tankless: {
				type: "end",
				title: "High pressure opened the relief",
				body: "A tankless relief can open near 125 psi. High campground pressure or a failed inlet regulator will do it. Fit a regulator and retest. Never plug the valve.",
				symptom: "relief",
				level: "soon"
			}
		}
	},
	{
		id: "awning-flow",
		system: "Body & gear",
		title: "Awning will not retract",
		blurb: "Zip Dee, Relax, or a Lippert Solera. Do not force a power awning.",
		start: "power",
		nodes: {
			power: {
				type: "ask",
				q: "Is this a power awning that lost power, or that stopped part way?",
				yes: "reset",
				no: "manual"
			},
			reset: {
				type: "end",
				title: "Use the close and reset",
				body: "Never force a power awning. After a power cut, a Flying Cloud power awning lowers the arms fully, then retracts. Press retract once more to finish. White lithium goes in the pivot holes, not on the fabric.",
				symptom: "awning",
				level: "soon"
			},
			manual: {
				type: "end",
				title: "Retract it by hand",
				body: "Use the manual retraction procedure for that awning. Silicone on manual arms. Do not crank against a locked arm.",
				symptom: "awning"
			}
		}
	},
	{
		id: "solar-24",
		system: "Electrical",
		title: "Solar controller is on 24 V",
		blurb: "A 12 V house bank that the controller treated as 24 V. These coaches do not charge the house bank at 24 V.",
		start: "reading",
		nodes: {
			reading: {
				type: "ask",
				q: "Is the controller showing about 24 V, or a strange reading such as 21 V, on a normal 12 V house bank?",
				detail: "A panel lead in the sun can also sit near 21 V. That reading alone is not a 24 V battery.",
				yes: "which",
				no: "twelve"
			},
			twelve: {
				type: "end",
				title: "Stay on the 12 V chart",
				body: "Open the 12 V solar charging chart. Charging starts only when panel voltage is about 5 V above the battery. A full bank and a blinking light are the other reasons it looks idle.",
				symptom: "solar"
			},
			which: {
				type: "ask",
				q: "Are you looking at the panel leads, not the battery voltage?",
				yes: "panels",
				no: "sensed"
			},
			panels: {
				type: "end",
				title: "That can be the panels, not a 24 V bank",
				body: "A panel voltage near 21 V in the sun is not the battery. If the battery side is a normal 12 V bank and it is still not charging, use the solar chart.",
				symptom: "solar"
			},
			sensed: {
				type: "ask",
				q: "Have you already reset the sense order?",
				detail: "Disconnect PV+, then battery+. Wait. Reconnect the battery first, then the panels. Err 38 uses that same order after a 3 minute wait.",
				yes: "still",
				no: "reset"
			},
			reset: {
				type: "end",
				title: "Reset it back to 12 V",
				body: "Disconnect PV+, then battery+, and wait. Reconnect the battery first, then the panels. The lithium preset is about 14.2 V absorption, not about twice that. Do not leave a 12 V bank on a 24 V charge.",
				symptom: "solar",
				level: "soon"
			},
			still: {
				type: "ask",
				q: "After the reset, are yellow and green both blinking?",
				detail: "That pair means panel voltage is too high. Err 33 is the same fault.",
				yes: "series",
				no: "stuck"
			},
			series: {
				type: "end",
				title: "Too many panels in series",
				body: "Yellow and green blinking, or Err 33, means the panel voltage is too high for this controller. That is not a 24 V battery. Reduce the series string.",
				symptom: "solar"
			},
			stuck: {
				type: "end",
				title: "It is still treating the bank as 24 V",
				body: "Open the solar checks. Do not equalize a lithium, gel, or AGM bank. If Err 80 through 83 stays, later serial numbers can reset under Product info: 100/30 from HQ2601, 100/50 from HQ2614. Firmware should be 1.73 or newer.",
				symptom: "solar",
				level: "soon"
			}
		}
	},
	{
		id: "solar-12",
		system: "Electrical",
		title: "12 V solar charging",
		blurb: "What a normal SmartSolar charge looks like on the 12 V house bank.",
		start: "twelve",
		nodes: {
			twelve: {
				type: "ask",
				q: "Is the controller showing a 12 V battery, not about 24 V?",
				detail: "These coaches charge the house bank at 12 V. About 24 V, or a strange reading such as 21 V on the battery side, is the other chart.",
				yes: "above",
				no: "wrong"
			},
			wrong: {
				type: "end",
				title: "That is the 24 V chart",
				body: "Do not leave a 12 V bank on a 24 V charge. Disconnect PV+, then battery+, wait, and reconnect the battery first, then the panels.",
				symptom: "solar",
				level: "soon"
			},
			above: {
				type: "ask",
				q: "Is panel voltage about 5 V above the battery, in the sun?",
				yes: "blue",
				no: "wait"
			},
			wait: {
				type: "end",
				title: "It has not started yet",
				body: "Charging starts only when the panels are about 5 V above the battery. Blue blinking about every 3 seconds means it is not charging: shade, a loose plug, or a blown fuse. A blink about every 4 seconds can just be a GX talking. The solar-port fuse is 15 A on a Classic and 30 A on a Globetrotter.",
				symptom: "solar"
			},
			blue: {
				type: "ask",
				q: "Is the blue light steady?",
				yes: "bulk",
				no: "yellow"
			},
			bulk: {
				type: "end",
				title: "Bulk. That is a normal 12 V charge.",
				body: "Blue stays on while the battery takes a heavy charge. Next is absorption: yellow steady, about 14.2 V for 2 hours on the lithium preset. Do not change factory settings on a coach that is still under warranty. Do not equalize lithium, gel, or AGM.",
				symptom: "solar"
			},
			yellow: {
				type: "ask",
				q: "Is the yellow light steady, by itself?",
				yes: "absorb",
				no: "green"
			},
			absorb: {
				type: "end",
				title: "Absorption. Still normal.",
				body: "Yellow stays on. The lithium preset is about 14.2 V for 2 hours. Float is next, and that is a steady green light.",
				symptom: "solar"
			},
			green: {
				type: "ask",
				q: "Is the green light steady, by itself?",
				yes: "float",
				no: "fault"
			},
			float: {
				type: "end",
				title: "Float. The bank is full.",
				body: "Green stays on. The controller is holding a full battery. A controller that rests when the bank is full is normal. Draw the batteries down if you need to see it charge again.",
				symptom: "solar"
			},
			fault: {
				type: "end",
				title: "A blinking light is not a normal charge",
				body: "Green blinking alone is too hot. Blue and green blinking is over-current. Yellow and green blinking is panel voltage too high. Yellow blinking alone is a network or BMS problem. Blue and yellow blinking together is an internal error. Confirm the controller says SmartSolar, then open the solar checks.",
				symptom: "solar",
				level: "soon"
			}
		}
	},
	{
		id: "maint-drain",
		system: "Maintain",
		title: "Winterize — drain the lines",
		blurb: "The 2027 drain-down, including the air cap for this coach.",
		start: "ready",
		nodes: {
			ready: {
				type: "ask",
				q: "Are the faucets, heater drain, and low-point drains already open, and has the tongue been lowered and raised until the drips stop?",
				detail: "Level the coach first. Pump the fresh tank empty, then pump off. Catch the half cup in the pump. A World Traveler dumps the holding tanks before any of this.",
				yes: "truma",
				no: "notyet"
			},
			notyet: {
				type: "end",
				title: "Finish the drain-down first",
				body: "Open every faucet and every drain, including the water-heater drain. Let it drip. The 2027 manuals say several days. Then come back for the air cap.",
				procedure: "winterize"
			},
			truma: {
				type: "ask",
				q: "Is the water heater a Truma Combi, as on a Basecamp 20XE or a World Traveler?",
				yes: "combi",
				no: "classic"
			},
			combi: {
				type: "end",
				title: "Do not blow air through the Combi",
				body: "Close the inlet and outlet, open the bypass, and leave the heater drain open. Leave a note on the panel. Air on the lines stops at 50 psi. Antifreeze does not go into the heater.",
				procedure: "winterize",
				level: "soon"
			},
			classic: {
				type: "ask",
				q: "Is this a Classic with the four Alde water-line valves?",
				yes: "alde",
				no: "thirty"
			},
			alde: {
				type: "end",
				title: "Close valves 1 and 2, then 50 psi",
				body: "That is the blow-out position. Stop at 50 psi. Cycle one faucet at a time. Storage of 30 days or less can use the battery disconnect instead of pulling the batteries. Check the charge weekly in hard cold.",
				procedure: "valves"
			},
			thirty: {
				type: "ask",
				q: "Is this a Globetrotter, Trade Wind, Frank Lloyd Wright, or Stetson?",
				yes: "psi30",
				no: "psi50"
			},
			psi30: {
				type: "end",
				title: "Stop at 30 psi",
				body: "Cycle one faucet at a time. A Trade Wind also opens the recirculating-heater valves: exterior knob a quarter turn clockwise, the valve behind it a quarter turn counterclockwise. Close both before the heater is used again. A cup of RV antifreeze in each drain. If you are not sure the lines are empty, do the pink fill.",
				procedure: "winterize"
			},
			psi50: {
				type: "end",
				title: "Stop at 50 psi",
				body: "Bambi, Basecamp, Caravel, Flying Cloud, International, and World Traveler. Open the tankless drain behind the roadside heater door on a Bambi or Caravel. A cup of RV antifreeze in each drain. If you are not sure the lines are empty, do the pink fill.",
				procedure: "winterize"
			}
		}
	},
	{
		id: "maint-pink",
		system: "Maintain",
		title: "Winterize — pink antifreeze",
		blurb: "After the drain-down, if any water might still be trapped.",
		start: "bypass",
		nodes: {
			bypass: {
				type: "ask",
				q: "Is the heater bypassed, and is the winterize-kit valve on WINTERIZING?",
				detail: "The kit is next to the pump. Two or three gallons is typical. A Basecamp can take a few gallons. A second person watches the faucets.",
				yes: "dry",
				no: "set"
			},
			set: {
				type: "end",
				title: "Set the bypass before any pink fluid",
				body: "On a Truma Combi the inlet and outlet stay closed, the bypass stays open, and the heater drain stays open. Antifreeze in that heater damages it. Then turn the kit valve to winterizing.",
				procedure: "winterize",
				level: "soon"
			},
			dry: {
				type: "ask",
				q: "Did a jug run empty before every faucet showed pink?",
				yes: "swap",
				no: "done"
			},
			swap: {
				type: "end",
				title: "Pump off, then change jugs",
				body: "Do not let the pump run dry. Start again and move fixture to fixture, including the toilet, the tub sprayer, and the outside shower.",
				procedure: "winterize"
			},
			done: {
				type: "end",
				title: "Lines are full",
				body: "Pump off. Leave the faucets open. Kit valve back to normal, hose capped and coiled. Wipe spills off the fixtures. Do not rinse them down the drain — that dilutes the antifreeze.",
				procedure: "winterize"
			}
		}
	},
	{
		id: "maint-spring",
		system: "Maintain",
		title: "Spring — water clear again",
		blurb: "Putting the coach back in service after antifreeze.",
		start: "clear",
		nodes: {
			clear: {
				type: "ask",
				q: "Is the water clear at every faucet, including a second pass?",
				detail: "Batteries back in and charged, except a coach that left them in. Dump valves, faucets, and the fresh-tank drain closed. Pump on.",
				yes: "left",
				no: "again"
			},
			again: {
				type: "end",
				title: "That faucet still has antifreeze",
				body: "Keep it open until the water is clear, then check every faucet again. A Trade Wind often needs more than one pass.",
				procedure: "sanitize"
			},
			left: {
				type: "ask",
				q: "Was a heater left bypassed, or a heater drain left open?",
				yes: "back",
				no: "city"
			},
			back: {
				type: "end",
				title: "Put the heater back in the circuit",
				body: "Close the heater drain. Open the inlet and outlet. Close the bypass. Fill the tank before any heater is turned on. Then hook to city water and check the water once more.",
				procedure: "sanitize"
			},
			city: {
				type: "end",
				title: "City water, then one more look",
				body: "Pump off. Open the faucets on city water and confirm the water is still clear. Sanitize the fresh tank before anyone drinks it.",
				procedure: "sanitize"
			}
		}
	},
	{
		id: "maint-sanitize",
		system: "Maintain",
		title: "Sanitize the fresh tank",
		blurb: "RV cleaner is the manual’s first choice. Bleach is the severe case.",
		start: "bleach",
		nodes: {
			bleach: {
				type: "ask",
				q: "Are you using household bleach?",
				detail: "Sanitize before and after storage, after new plumbing, and if the water tastes wrong. A Globetrotter 25 or 27 is about 5.1 oz in 39 gallons. A 30 is about 6.9 oz in 53 gallons. A 23-gallon Bambi or Basecamp tank is about 3.0 oz.",
				yes: "dose",
				no: "rv"
			},
			rv: {
				type: "end",
				title: "Follow the RV cleaner’s label",
				body: "That is the 2027 recommendation. It is meant for every part of the system, including the heater. Use its own dilution and its own contact time.",
				procedure: "sanitize"
			},
			dose: {
				type: "end",
				title: "0.13 ounce per gallon, then 4 hours",
				body: "That is about 50 ppm. Pour a one-gallon concentrate into the tank, then fill from city water at once. Bypass the heater if its manual forbids bleach. Open every faucet until you smell chlorine. Wait 4 hours. Drain and refill until the smell is gone.",
				procedure: "sanitize"
			}
		}
	},
	{
		id: "maint-dump",
		system: "Maintain",
		title: "Empty the holding tanks",
		blurb: "Waste first, then gray — unless this coach has one tank.",
		start: "combo",
		nodes: {
			combo: {
				type: "ask",
				q: "Is this a Bambi or Caravel 16RB, with one combination tank?",
				yes: "one",
				no: "two"
			},
			one: {
				type: "end",
				title: "One 30-gallon tank",
				body: "Sinks, shower, and toilet share it. There is no black-then-gray order. Hose on, drain, cap on before you tow.",
				procedure: "dump"
			},
			two: {
				type: "end",
				title: "Waste tank first, then gray",
				body: "Gray water rinses the hose. The bumper numbers are not the same on every coach. A Classic 28RB is gray 1 and waste 4, the reverse of a 30 or 33. Read the handle, not just the number.",
				procedure: "dump"
			}
		}
	},
	{
		id: "maint-flush",
		system: "Maintain",
		title: "Flush the waste tank",
		blurb: "Every time the tank is emptied, so the spray holes do not clog.",
		start: "hose",
		nodes: {
			hose: {
				type: "ask",
				q: "Is the waste valve closed, and is the hose on the flush inlet — not the fresh-water hose?",
				yes: "half",
				no: "stop"
			},
			stop: {
				type: "end",
				title: "Stop. That hose is the wrong one",
				body: "A fresh-water hose on the flush inlet is how the drinking system gets contaminated. Use a different hose. Close the dump valve before you turn the water on.",
				procedure: "dump",
				level: "soon"
			},
			half: {
				type: "end",
				title: "Half full, then dump, until it runs clear",
				body: "The spray head needs that volume. Repeat. Use the flush often or the holes clog. Never put a snake down these drains.",
				procedure: "dump"
			}
		}
	},
	{
		id: "maint-lugs",
		system: "Maintain",
		title: "Lug nuts after a wheel change",
		blurb: "110 ft-lb on aluminum. 100 ft-lb on the steel spare.",
		start: "moved",
		nodes: {
			moved: {
				type: "ask",
				q: "Was a wheel just installed or taken off?",
				yes: "recheck",
				no: "trip"
			},
			recheck: {
				type: "end",
				title: "Star pattern, then 5, 25, and 50 miles",
				body: "Hand-start every nut. Aluminum finishes at 110 ft-lb. The steel spare finishes at 100. On a Classic, update the TPMS gateway any time a tire changes position.",
				procedure: "lugs"
			},
			trip: {
				type: "end",
				title: "Still torque it before you tow",
				body: "Also after winter storage and after hard braking. A wobble at low speed is a loose nut: stop and torque them. Do not finish with an impact wrench.",
				procedure: "lugs"
			}
		}
	},
	{
		id: "maint-bearings",
		system: "Maintain",
		title: "Bearings — sealed or repack",
		blurb: "Nev-R-Lube is inspect only. Bambi, Basecamp, and World Traveler are repacked.",
		start: "sealed",
		nodes: {
			sealed: {
				type: "ask",
				q: "Is the hub Nev-R-Lube — no grease fitting, sealed cartridge?",
				detail: "2027 Globetrotter, Classic, Trade Wind, Flying Cloud, International, Caravel, Frank Lloyd Wright, and Stetson manuals call for this. Read the hub anyway.",
				yes: "play",
				no: "pack"
			},
			play: {
				type: "ask",
				q: "Is the end play between 0.001 and 0.010 in, and does the wheel turn smoothly?",
				yes: "leave",
				no: "replace"
			},
			leave: {
				type: "end",
				title: "Leave the cartridge alone",
				body: "A slight grease weep is normal. Do not pump grease into a Nev-R-Lube hub. Look again at the next tire rotation, or once a year.",
				procedure: "bearings"
			},
			replace: {
				type: "end",
				title: "The cartridge is done",
				body: "Excess play, or a rough or noisy wheel, means replace the unit. That is a Dexter job. Do not heat the axle tube.",
				procedure: "bearings",
				level: "soon"
			},
			pack: {
				type: "end",
				title: "Hand-pack at 12 months or 12,000 miles",
				body: "2027 Bambi, Basecamp, and World Traveler. Press the large end of the bearing into a glob of grease until it comes out the other side. Do not use the Nev-R-Lube end-play test as the service.",
				procedure: "bearings"
			}
		}
	},
	{
		id: "maint-breakaway",
		system: "Maintain",
		title: "Breakaway switch — 90 days",
		blurb: "The pin must not stay out.",
		start: "long",
		nodes: {
			long: {
				type: "ask",
				q: "Has the pin been out for more than about 20 seconds?",
				yes: "back",
				no: "service"
			},
			back: {
				type: "end",
				title: "Put the pin back now",
				body: "The magnets can burn. The 2027 warning is 20–30 seconds. Service the switch only with the pin going straight back in.",
				procedure: "breakaway",
				level: "soon"
			},
			service: {
				type: "end",
				title: "Cleaner, one drop of oil, pin back in",
				body: "Spray contact cleaner into the switch. One drop of light oil on the pin. Pull it and confirm the brakes lock, then reinsert it inside that same 20–30 seconds.",
				procedure: "breakaway"
			}
		}
	},
	{
		id: "maint-strainer",
		system: "Maintain",
		title: "Clean the pump strainer",
		blurb: "The clear bowl is on the inlet side of the pump.",
		start: "see",
		nodes: {
			see: {
				type: "ask",
				q: "Can you see the clear bowl on the pump inlet?",
				detail: "Globetrotter: under the wardrobe. Other floors hide it in a different cabinet. The bowl turns counterclockwise.",
				yes: "clean",
				no: "find"
			},
			find: {
				type: "end",
				title: "Open the location card for this floor",
				body: "A 22FB Caravel keeps the pump under the wardrobe and the winterize kit under the galley. A Basecamp pump is under the roadside bench. Do not force a panel that is still screwed down.",
				procedure: "where"
			},
			clean: {
				type: "end",
				title: "Rinse the screen and watch for leaks",
				body: "Household detergent is fine. Seat the bowl without cutting the seal. Pump on, and look at the bowl before you leave it.",
				procedure: "where"
			}
		}
	},
	{
		id: "maint-valves",
		system: "Maintain",
		title: "Classic Alde valve positions",
		blurb: "28, 30, and 33 use the same four positions. The drawings differ.",
		fit: "classic",
		start: "blow",
		nodes: {
			blow: {
				type: "ask",
				q: "Are you about to blow the lines out with air?",
				yes: "blowout",
				no: "bypass"
			},
			blowout: {
				type: "end",
				title: "Close valves 1 and 2",
				body: "Then 50 psi at the city inlet, no more. Confirm 3 and 4 against the tag in this coach before the air goes on.",
				procedure: "valves"
			},
			bypass: {
				type: "ask",
				q: "Are you bypassing the Alde so antifreeze does not enter it?",
				yes: "bypassed",
				no: "drain"
			},
			bypassed: {
				type: "end",
				title: "Valves 1, 2, and 3 closed. Valve 4 open.",
				body: "Leave the heater drain open while the coach is stored.",
				procedure: "valves"
			},
			drain: {
				type: "ask",
				q: "Are you draining the water lines?",
				yes: "open",
				no: "normal"
			},
			open: {
				type: "end",
				title: "All four valves open",
				body: "The heater drain under the dinette is part of this. 28RB is the aft dinette. 30RB and 33FB are the forward dinette.",
				procedure: "valves"
			},
			normal: {
				type: "end",
				title: "Normal use",
				body: "Valves 1, 2, and 3 open. Valve 4 closed. The tank must be full of water before the Alde heats.",
				procedure: "valves"
			}
		}
	},
	{
		id: "maint-cushion",
		system: "Maintain",
		title: "Alde glycol and the air cushion",
		blurb: "Cold level, then the 14-day cushion. Classic schedule.",
		fit: "classic",
		start: "used",
		nodes: {
			used: {
				type: "ask",
				q: "Has the Alde been in use for about 14 days?",
				yes: "cushion",
				no: "level"
			},
			cushion: {
				type: "end",
				title: "Restore the air cushion",
				body: "Pump off. Lift the heating-system safety valve for a few seconds, then close it. 28RB: under the aft dinette. 30RB and 33FB: under the forward dinette.",
				procedure: "alde"
			},
			level: {
				type: "ask",
				q: "On a cold system, is the expansion tank about 0.4 in above the minimum line?",
				yes: "ok",
				no: "low"
			},
			ok: {
				type: "end",
				title: "Level is fine",
				body: "Replace the glycol every 2 years. Alde glycol only, with the GRAS label. That exchange is a dealer job.",
				procedure: "alde"
			},
			low: {
				type: "end",
				title: "Top up with Alde glycol only",
				body: "28RB: top cabinet behind the aft dinette. 30RB: bathroom cabinet above the toilet. 33FB: top cabinet between the shower and the sofa. Do not mix glycol types.",
				procedure: "alde"
			}
		}
	},
	{
		id: "maint-tpms",
		system: "Maintain",
		title: "Classic TPMS after a tire moves",
		blurb: "The monitor and the Multiplex gateway both have to be told.",
		fit: "classic",
		start: "moved",
		nodes: {
			moved: {
				type: "ask",
				q: "Did a tire change position, including a rotation?",
				yes: "pair",
				no: "leave"
			},
			pair: {
				type: "end",
				title: "Send, then five presses on the gateway",
				body: "Hold GO until ACCEPT, then + five times to SEND. Gateway: 28RB behind the galley panel, 30RB under the wardrobe, 33FB behind the oven drawer. Press that button five times, then hold SET until both beep.",
				procedure: "tpms"
			},
			leave: {
				type: "end",
				title: "Leave the gateway alone",
				body: "The link only has to be redone when a sensor changes corners.",
				procedure: "tpms"
			}
		}
	},
	{
		id: "maint-truma",
		system: "Maintain",
		title: "Truma Combi — drain it",
		blurb: "Basecamp 20XE and World Traveler. Not the Globetrotter tank heater.",
		start: "cool",
		nodes: {
			cool: {
				type: "ask",
				q: "Is the Combi cool, and is the pump off?",
				yes: "drain",
				no: "hot"
			},
			hot: {
				type: "end",
				title: "Do not move that lever yet",
				body: "The manual warns against opening the drain while the heater is hot or still under pressure. You can be scalded.",
				procedure: "descale",
				level: "soon"
			},
			drain: {
				type: "end",
				title: "Lever to position (c)",
				body: "Water leaves through the drain socket. Close it at (a) or (b) only when you are putting the coach back in service. Do not blow air through the Combi, and do not put antifreeze in it. Work the relief by hand once a year. A tech inspects that valve every 3 years.",
				procedure: "descale"
			}
		}
	},
	{
		id: "maint-recirc",
		system: "Maintain",
		title: "Trade Wind heater — drain it",
		blurb: "The recirculating tank. Both valves, then the rest of the plumbing.",
		start: "store",
		nodes: {
			store: {
				type: "ask",
				q: "Are you draining this heater because the coach will freeze or sit?",
				yes: "valves",
				no: "full"
			},
			valves: {
				type: "end",
				title: "A quarter turn on each valve",
				body: "Pump off, power off, gas off, both faucets open. Access panel off. Exterior knob a quarter turn clockwise. The valve directly behind it a quarter turn counterclockwise, handle in line with the pipe. Close both before the heater is used again.",
				procedure: "winterize"
			},
			full: {
				type: "end",
				title: "The tank has to be full before it runs",
				body: "Running this heater dry damages the tank and the controls, and that damage is not a warranty repair.",
				procedure: "winterize",
				level: "soon"
			}
		}
	},
	{
		id: "maint-battery",
		system: "Maintain",
		title: "Battery storage for the winter",
		blurb: "Some coaches leave the batteries in. Some manuals say pull them.",
		start: "solar",
		nodes: {
			solar: {
				type: "ask",
				q: "Will a Basecamp, or a Trade Wind 23 or 25, sit where the panels can see the sky?",
				yes: "out",
				no: "pull"
			},
			out: {
				type: "end",
				title: "Disconnect off. Leave the batteries in.",
				body: "Uncovered solar holds the charge. Covered panels, or indoor storage, do not. Indoors, charge fully first. A long sit with no charge can hit low-voltage disconnect.",
				procedure: "lithium"
			},
			pull: {
				type: "ask",
				q: "Is this a Trade Wind 27FB with the Harbinger system?",
				yes: "harbor",
				no: "chem"
			},
			harbor: {
				type: "end",
				title: "At least 25 percent, and keep it warm",
				body: "Harbinger wants that minimum before storage. Keep it plugged in if the temperature will fall below the limit in the Harbinger manual. A season without heat can cost about 20 percent of capacity.",
				procedure: "lithium"
			},
			chem: {
				type: "ask",
				q: "Are the batteries lithium, and is storage longer than 30 days?",
				yes: "li",
				no: "short"
			},
			li: {
				type: "end",
				title: "Store them full, loads disconnected",
				body: "Negative cable off. Heater switch off, or the heater will run the bank down. Do not charge below 32 °F. A Classic stored 30 days or less may leave them in with the disconnect off.",
				procedure: "lithium"
			},
			short: {
				type: "end",
				title: "Lead-acid comes out of the coach",
				body: "Store it charged, cool, and dry, and charge it every 30–60 days. Clean the top only with the caps tight: 2 tablespoons of baking soda per pint of water. A Classic stored 30 days or less may use the disconnect instead, and should be checked weekly in hard cold.",
				procedure: "lithium"
			}
		}
	}
];
function flowById(id) {
	return flows.find((f) => f.id === id);
}
//#endregion
export { waysFrom as i, flows as n, followFlow as r, flowById as t };
