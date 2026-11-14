import { extraFaultCodes } from "@/data/codes-extra";
import { textHasWords } from "@/data/words";

export type FaultCode = {
  id: string;
  appliance: string;
  code: string;
  meaning: string;
  fix: string;
  /** Named only when this book already points at that document. No invented page. */
  source?: string;
};

export function compactCode(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** E1, E-1, and "E 1" match the same code. E1 does not match E10. */
export function faultCodeMatches(c: FaultCode, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const blob = `${c.code} ${c.appliance} ${c.meaning} ${c.fix} ${c.source ?? ""}`;
  const code = compactCode(c.code);
  const key = compactCode(s);
  if (key.length >= 2 && (key === code || key.replace(/s$/, "") === code || key === code.replace(/s$/, ""))) return true;
  const bits = s
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
    .filter((w) => w.length > 0);
  const usable = bits.filter((w) => w.length >= 2 || (/\d/.test(w) && bits.some((other) => other.length >= 2)));
  if (!usable.length) return false;
  if (usable.some((w) => compactCode(w) === code)) {
    return usable.every((w) => compactCode(w) === code || textHasWords(blob, [w]));
  }
  return textHasWords(blob, usable);
}

export function faultCodeExact(c: FaultCode, q: string): boolean {
  const code = compactCode(c.code);
  if (code.length < 2) return false;
  const key = compactCode(q);
  if (key === code || key.replace(/s$/, "") === code) return true;
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .some((w) => compactCode(w) === code);
}

/** Lower sorts first. A code that is the whole query beats one that only shares a word. */
export function faultCodeRank(c: FaultCode, q: string, onCoach = true): number {
  const query = compactCode(q);
  const code = compactCode(c.code);
  const exactness = query.length >= 2 && query === code ? 0 : faultCodeExact(c, q) ? 1 : 2;
  return exactness * 2 + (onCoach ? 0 : 1);
}

/** Forum wording, not a code from the maker’s sheet. */
export function ownerReportedCode(c: FaultCode) {
  return /forum only|forum reports only/i.test(`${c.meaning} ${c.fix}`);
}

export function symptomForCode(c: FaultCode): string | undefined {
  if (c.appliance === "Suburban ST-65RL" || c.appliance === "Suburban IW60") return "st-code";
  if (c.appliance === "Dometic furnace") return "furnace-flash";
  if (c.appliance === "Alde 3030") return "alde-fault";
  if (c.appliance === "PD1600 inverter") return "pd-code";
  if (c.appliance === "Progressive Industries EMS") return "no-120";
  if (c.appliance === "Norcold 12 V fridge") return "fridge-flash";
  if (c.appliance === "Coleman VS-18") return "ac-stat";
  if (c.appliance === "CZone") return "no-12v";
  if (c.appliance === "TST TPMS") return "tires";
  if (c.appliance === "12 V fridge") return "fridge-flash";
  if (c.appliance === "Coleman thermostat") return "ac-stat";
  if (c.appliance === "SeeLevel II") return "tank-monitor";
  if (c.appliance === "Victron SmartSolar") return "solar";
  if (c.appliance === "Girard GSWH-2" || c.appliance === "Truma AquaGo") return "tankless";
  if (c.appliance === "Truma Combi" || c.appliance === "Truma VarioHeat") return "furnace";
  if (c.appliance === "Dometic CCC2" || c.appliance === "Dometic single-zone") return "ac";
  if (c.appliance === "Victron MultiPlus") return "no-120";
  if (c.appliance === "Cerbo GX" || c.appliance === "Battle Born GC3") return "no-12v";
  if (c.appliance === "Suburban NT furnace") return "furnace-flash";
  if (c.appliance === "Dometic RM fridge" || c.appliance === "Dometic RM1350" || c.appliance === "Dometic RUA" || c.appliance === "Norcold N-series" || c.appliance === "Norcold Polar" || c.appliance === "Norcold N4000") return "fridge";
  if (c.appliance === "Xantrex Freedom HF" || c.appliance === "Xantrex Freedom X") return "no-120";
  if (c.appliance === "Micro-Air EasyTouch" || c.appliance === "GE Profile" || c.appliance === "Dometic 5-button CCC") return "ac";
  if (c.appliance === "TireMinder") return "tires";
  if (c.appliance === "Suburban tank" || c.appliance === "Fogatti") return "tankless";
  if (c.appliance === "Coleman-Mach") return "ac";
  if (c.appliance === "Nova Kool" || c.appliance === "Vitrifrigo") return "fridge-flash";
  if (c.appliance === "WFCO" || c.appliance === "Parallax" || c.appliance === "Harbinger" || c.appliance === "Firefly") return "no-12v";
}
export const appliances = [
  "Suburban ST-65RL",
  "Suburban IW60",
  "Dometic furnace",
  "Alde 3030",
  "PD1600 inverter",
  "Progressive Industries EMS",
  "Norcold 12 V fridge",
  "Coleman VS-18",
  "CZone",
  "TST TPMS",
  "12 V fridge",
  "Coleman thermostat",
  "SeeLevel II",
  "Victron SmartSolar",
  "Girard GSWH-2",
  "Truma AquaGo",
  "Truma Combi",
  "Truma VarioHeat",
  "Dometic CCC2",
  "Dometic single-zone",
  "Victron MultiPlus",
  "Battle Born GC3",
  "Cerbo GX",
  "Dometic RM fridge",
  "Suburban tank",
  "Suburban NT furnace",
  "Dometic RM1350",
  "Dometic RUA",
  "Norcold N-series",
  "Norcold Polar",
  "Norcold N4000",
  "Dometic 5-button CCC",
  "Xantrex Freedom HF",
  "Xantrex Freedom X",
  "Micro-Air EasyTouch",
  "TireMinder",
  "Lippert Ground Control",
  "GE Profile",
  "Fogatti",
  "Nova Kool",
  "Vitrifrigo",
  "WFCO",
  "Parallax",
  "Firefly",
  "Harbinger",
  "Coleman-Mach",
  "Progressive Dynamics",
] as const;

export const faultCodes: FaultCode[] = [
  { id: "st-e0", appliance: "Suburban ST-65RL", code: "E0", meaning: "Outlet temperature probe open or shorted.", fix: "All ST codes lock out. Cycle 12 V, or turn the hot faucet off and on. If it returns, call for service." },
  { id: "st-e1", appliance: "Suburban ST-65RL", code: "E1", meaning: "Ignition failure. No flame after 3 tries.", fix: "Check LP supply and pressure, then the electrode and flame probe." },
  { id: "st-e2", appliance: "Suburban ST-65RL", code: "E2", meaning: "False fire. Flame sensed before start.", fix: "Lockout. Cycle power. If it returns, service." },
  { id: "st-e3", appliance: "Suburban ST-65RL", code: "E3", meaning: "High limit open.", fix: "Let it cool. Look for a blocked vent and scale. Reset only after it has cooled." },
  { id: "st-e4", appliance: "Suburban ST-65RL", code: "E4", meaning: "Inlet temperature sensor open or shorted.", fix: "Cycle 12 V. A returning code is a service item." },
  { id: "st-e5", appliance: "Suburban ST-65RL", code: "E5", meaning: "Fan failure. No speed signal.", fix: "Check that the intake is clear, then the blower. Service if it repeats." },
  { id: "st-e6", appliance: "Suburban ST-65RL", code: "E6", meaning: "Outlet water over-temperature.", fix: "Scale, low flow, or a failed sensor. Descale with kit 521163 if flow has been falling off." },
  { id: "st-e7", appliance: "Suburban ST-65RL", code: "E7", meaning: "Gas valve wire open or short.", fix: "Service. Do not bypass the valve." },
  { id: "st-e8", appliance: "Suburban ST-65RL", code: "E8", meaning: "Pressure switch failed or disconnected.", fix: "Intake and vent path first, then the switch. Service if the path is clear." },
  { id: "st-e9", appliance: "Suburban ST-65RL", code: "E9", meaning: "Recirculation failure. Air in the loop. Pump will not prime.", fix: "Bleed the loop. Confirm the winterize valves are not open." },
  { id: "st-en", appliance: "Suburban ST-65RL", code: "En", meaning: "Timeout. Ran more than 20 minutes continuously.", fix: "Normal protection. Cycle the faucet. A shower pause button can also make it hunt." },
  { id: "st-ec", appliance: "Suburban ST-65RL", code: "EC", meaning: "Communication failure with the controller.", fix: "Check the harness to the panel. Cycle 12 V." },
  { id: "iw-e1", appliance: "Suburban IW60", code: "E1", meaning: "Ignition fault. No flame after 2 tries. Locked.", fix: "LP at 11–14 in. water column. Cycle power or the hot faucet. The 2025 GT book lists the ST-65RL, not the IW60 — confirm the heater label." },
  { id: "iw-e2", appliance: "Suburban IW60", code: "E2", meaning: "Flame lost while running. Locked.", fix: "Supply problem or a dirty flame sensor path. Cycle power." },
  { id: "iw-e3", appliance: "Suburban IW60", code: "E3", meaning: "False fire. Flame sensed before start. Locked.", fix: "Service if it returns after a power cycle." },
  { id: "iw-e4", appliance: "Suburban IW60", code: "E4", meaning: "Water overheating. NTC over 90 °C. Locked.", fix: "Low flow or scale. Do not keep resetting a hot heater." },
  { id: "iw-e5", appliance: "Suburban IW60", code: "E5", meaning: "Hi-limit switch. Locked. Not the ST-65 fan code.", fix: "Cool it. Check the vent. Service if the switch will not reset. Do not use the ST-65 E5 meaning on an IW60." },
  { id: "iw-e6", appliance: "Suburban IW60", code: "E6", meaning: "Air-pressure switch or fan abnormal. Locked.", fix: "Clear the intake and exhaust." },
  { id: "iw-e7", appliance: "Suburban IW60", code: "E7", meaning: "Inlet-water NTC open or short. Automatic recovery.", fix: "Often clears. If it repeats, the sensor or the board." },
  { id: "iw-e9", appliance: "Suburban IW60", code: "E9", meaning: "Outlet-water NTC open or short. Automatic recovery.", fix: "Same as E7, on the outlet sensor." },
  { id: "iw-ec", appliance: "Suburban IW60", code: "EC", meaning: "Line-controller communication failure. Automatic recovery.", fix: "Reseat the controller harness." },
  { id: "iw-e8", appliance: "Suburban IW60", code: "E8", meaning: "On-demand table: replace the module board.", fix: "This one is a service replacement, not an owner reset." },
  { id: "fur-0", appliance: "Dometic furnace", code: "Steady", meaning: "Internal control-board fault. Hard lockout.", fix: "Cycle the thermostat or the furnace power switch. If it stays on solid, the manual treats that as a board fault. Gas work is for a tech." },
  { id: "fur-1", appliance: "Dometic furnace", code: "1 flash", meaning: "Limit switch or airflow. Soft lockout. 3 second pause.", fix: "Return air blocked, or the sail switch did not close. Insects in the exterior vent." },
  { id: "fur-2", appliance: "Dometic furnace", code: "2 flashes", meaning: "Flame sense. Hard lockout.", fix: "LP supply, collapsed pigtail, or the flame sensor. About 11 in. water column." },
  { id: "fur-3", appliance: "Dometic furnace", code: "3 flashes", meaning: "Ignition lockout. Soft. Retries after 1 hour.", fix: "Three ignition attempts failed. Check LP and the igniter gap before you wait out the hour." },
  { id: "fur-4", appliance: "Dometic furnace", code: "4 flashes", meaning: "High voltage, about 16–17 V. Soft. Current DF manual only.", fix: "An older DF board does not have this code. Read the decal on the board. A converter or a booster dumping high voltage. Fix the charge source.", source: "Current Dometic DF manual. Not on an older board." },
  { id: "fur-5", appliance: "Dometic furnace", code: "5 flashes", meaning: "Low voltage, about 8–9 V. Soft. Current DF manual only.", fix: "An older DF board does not have this code. Read the decal. Battery, connections, or a converter that is not charging.", source: "Current Dometic DF manual. Not on an older board." },
  { id: "alde-conn", appliance: "Alde 3030", code: "Connector failure", meaning: "The panel cannot see the boiler.", fix: "Check the red cable and the connectors, including the boiler’s black connector." },
  { id: "alde-nf", appliance: "Alde 3030", code: "Heater not found", meaning: "No communication, or a software mismatch.", fix: "Dealer or an Alde service partner. Not a fuse you should guess at." },
  { id: "alde-ohg", appliance: "Alde 3030", code: "Overheat glycol", meaning: "Air in the system, or the circulation pump failed.", fix: "Bleed. Expansion tank at least 1 cm above MIN when cold. Reset once the glycol is under 50 °C by cycling 12 V to the boiler." },
  { id: "alde-ohl", appliance: "Alde 3030", code: "Overheat lockout", meaning: "The boiler has already overheated.", fix: "Cycle 12 V to the boiler after it cools." },
  { id: "alde-pcb", appliance: "Alde 3030", code: "Overheat PCB", meaning: "Boiler or compartment too hot.", fix: "Let it cool, cycle 12 V. If it returns, Alde service." },
  { id: "alde-fail", appliance: "Alde 3030", code: "Heater failure", meaning: "Circuit board damaged.", fix: "Cycle 12 V. If it persists, service partner." },
  { id: "alde-v", appliance: "Alde 3030", code: "Low battery", meaning: "Boiler stops below 10.8 V and restarts at 11 V.", fix: "Other messages during this are often just the low voltage. Charge first, then re-read the panel." },
  { id: "alde-gas", appliance: "Alde 3030", code: "Gas failure", meaning: "No ignition on gas.", fix: "LP on, propane not butane below 50 °F, 12 V fuse good and above 11 V, both exhaust hoses clear. Cycle 12 V and re-enable gas. Light every stove burner — if flames shrink, the supply is the problem.", source: "Alde 3030, gas-failure message." },
  { id: "alde-fan", appliance: "Alde 3030", code: "Fan failure", meaning: "Combustion fan.", fix: "After repeated fan restarts, this is a service partner job." },
  { id: "alde-fan-ok", appliance: "Alde 3030", code: "Fan restarts", meaning: "The fan missed speed and the boiler is trying again. Not a fault by itself.", fix: "Wait. Fan failure after several restarts is the fault." },
  { id: "alde-load", appliance: "Alde 3030", code: "Load monitor not found", meaning: "A load monitor the panel already knew about is unplugged or dead.", fix: "Plug it back in. If it is plugged in and the message stays, that is an Alde partner job." },
  { id: "alde-win", appliance: "Alde 3030", code: "Window open", meaning: "A window switch near the flue is open. Gas stops. Electric can still run.", fix: "Close the window. If it is already closed, check the switch and the wiring." },
  { id: "alde-panel", appliance: "Alde 3030", code: "Panel failure", meaning: "Moisture in the panel.", fix: "Dry the panel. Do not keep powering a wet one." },
  { id: "alde-zone", appliance: "Alde 3030", code: "Zone / sensor error", meaning: "Zone, hot-water, or outdoor sensor open.", fix: "A removed outdoor sensor can be dismissed on the panel. Any other sensor: dealer." },
  { id: "alde-alt", appliance: "Alde 3030", code: "Full gas power unavailable", meaning: "The fan cannot reach full-gas speed.", fix: "Normal if High Altitude Mode is on. Otherwise contact Alde." },
  { id: "alde-ci", appliance: "Alde 3030", code: "CI-bus / remote", meaning: "CI-bus, iNet, or remote-control error.", fix: "Check the yellow connector and the vehicle master panel. Check the iNet box. If you removed a remote that was on JP3, uninstall it on the panel." },
  { id: "alde-bac", appliance: "Alde 3030", code: "Anti-bacteria", meaning: "The tank never got hot enough.", fix: "It retries within 24 hours. Raise power (3 kW and gas)." },
  { id: "pd-e1", appliance: "PD1600 inverter", code: "E-1", meaning: "Low battery. Under 10.5 V for several seconds. This is the PD1600 inverter, not a shore protector.", fix: "Auto-restart at 12.0 V. Recharge. If it cycles on and off, the batteries are tired or the DC cables are loose or undersized. The same E-1 on a Progressive Industries EMS means reverse polarity. Read the label.", source: "PD1600 inverter. The same number on a Progressive Industries EMS is a different fault. Read the label." },
  { id: "pd-e2", appliance: "PD1600 inverter", code: "E-2", meaning: "High battery. Over 15.5 V.", fix: "Auto-clears below 15.0 V. Check the charge source. Do not ignore a lithium being overcharged. On an EMS, E-2 is an open ground." },
  { id: "pd-e3", appliance: "PD1600 inverter", code: "E-3", meaning: "AC output overload.", fix: "Manual restart: press the power button. Shed loads. A brief buzz (under 2 seconds) when the fridge starts is normal. On an EMS, E-3 is line voltage over 132 V." },
  { id: "pd-e4", appliance: "PD1600 inverter", code: "E-4", meaning: "Over-temperature.", fix: "Auto-clears when cool. Clear the airflow around the inverter. On an EMS, E-4 is line voltage under 104 V." },
  { id: "pd-e5", appliance: "PD1600 inverter", code: "E-5", meaning: "Internal error.", fix: "Manual restart. Check the remote harness. No user-serviceable parts inside. On a 50 A EMS, E-5 is the second line over 132 V." },
  { id: "pd-e6", appliance: "PD1600 inverter", code: "E-6", meaning: "AC output short circuit.", fix: "Manual restart after you find the short. Check output wiring. On a 50 A EMS, E-6 is the second line under 104 V." },
  { id: "pd-e7", appliance: "PD1600 inverter", code: "E-7", meaning: "DC voltage failure while running.", fix: "Manual restart. Check DC cable size, length, and connections. Hold the remote power button about 5 seconds to turn it off. On an EMS, E-7 is line frequency over 69 Hz." },
  { id: "sec-1", appliance: "12 V fridge", code: "1 flash", meaning: "Battery-protection cut-out. Voltage outside limits.", fix: "Secop/Danfoss BD units only — confirm the LED on your controller. Flashes repeat about every 4 seconds. Charge the battery.", source: "Secop/Danfoss BD controller. Confirm the LED on the unit." },
  { id: "sec-2", appliance: "12 V fridge", code: "2 flashes", meaning: "Fan over-current, or too many start attempts.", fix: "Condenser fan, or the compressor is being asked to restart too often." },
  { id: "sec-3", appliance: "12 V fridge", code: "3 flashes", meaning: "Motor start error. Blocked rotor or high pressure.", fix: "Ventilation and a hot install. Service if it will not start once cool." },
  { id: "sec-4", appliance: "12 V fridge", code: "4 flashes", meaning: "Minimum-speed error. System overloaded.", fix: "Overpacked box, blocked vents, or a very hot day." },
  { id: "sec-5", appliance: "12 V fridge", code: "5 flashes", meaning: "Electronic unit thermal cut-out.", fix: "The controller itself is hot. Improve ventilation behind the fridge." },
  { id: "sec-6", appliance: "12 V fridge", code: "6 flashes", meaning: "Thermostat (NTC) failure.", fix: "Sensor unplugged or failed." },
  { id: "col-g", appliance: "Coleman thermostat", code: "Solid green", meaning: "Connected and communicating.", fix: "9420-330 on 2025 Globetrotter (PN 690829). This is the healthy state." },
  { id: "col-off", appliance: "Coleman thermostat", code: "Off", meaning: "No power, or the thermostat failed.", fix: "Breaker, 12 V, and the cable to the roof before you condemn the stat." },
  { id: "col-r", appliance: "Coleman thermostat", code: "Solid red", meaning: "Offline.", fix: "Reseat the RJ11 at the roof boards. TSB 201 adds a terminating resistor on a narrow 2025 Globetrotter serial range." },
  { id: "col-fg", appliance: "Coleman thermostat", code: "Fast green", meaning: "Trying the first connection. About 4 flashes a second.", fix: "Give it a moment. If it never settles, check power and the network cable." },
  { id: "col-sg", appliance: "Coleman thermostat", code: "Slow green", meaning: "No valid network message for 5 seconds.", fix: "Cable, resistor, or a roof board that is not answering." },
  { id: "col-ro", appliance: "Coleman thermostat", code: "Red / orange", meaning: "Offline, reconnecting.", fix: "Same path as solid red. Do not keep resetting a GFCI to hide it." },
  { id: "col-go", appliance: "Coleman thermostat", code: "Green / orange", meaning: "Online, but it has dropped offline more than once.", fix: "Intermittent connection. Reseat plugs. Ask about bulletin 201 if your serial is in range." },
  { id: "sl-opn", appliance: "SeeLevel II", code: "OPn", meaning: "Open circuit between the display and the sender.", fix: "One tank: short the wires at that sender. Sht means that sender is bad or miswired. Still OPn means the wire to it is open. Every tank: short the wires at the display. No Sht means the display is bad. Sht there, then short at the senders: no Sht is open wiring, Sht is bad senders. Check the fuse first." },
  { id: "sl-sht", appliance: "SeeLevel II", code: "Sht", meaning: "The communications wire is shorted to ground.", fix: "Unplug the senders one at a time. If Sht stays with every sender unplugged, disconnect the sender wire at the display. If it is still Sht, the display is bad." },
  { id: "sl-err", appliance: "SeeLevel II", code: "Err", meaning: "Bad data. Newer displays say crc for this same fault.", fix: "Senders programmed alike, damaged wiring, or a bad sender. Use the word printed on your display." },
  { id: "sl-sta", appliance: "SeeLevel II", code: "StA", meaning: "Stacked senders are connected, but the display is set for one sender.", fix: "Reprogram the display, or change the senders." },
  { id: "sl-nbo", appliance: "SeeLevel II", code: "nbo", meaning: "No bottom sender.", fix: "The bottom sender is quiet, or a single sender was programmed as the top. A one-sender tank must not be a top sender." },
  { id: "sl-ntp", appliance: "SeeLevel II", code: "ntP", meaning: "No top sender.", fix: "Double-stack programming, and only the bottom sender is answering." },
  { id: "sl-cal", appliance: "SeeLevel II", code: "CAL", meaning: "The display memory has failed.", fix: "Replace the display. This is not a sender fault." },
  { id: "mppt-idle", appliance: "Victron SmartSolar", code: "Blue blinks", meaning: "Not charging. The panels are not making enough power to start.", fix: "Blue blinks about every 3 seconds. Shade, a loose plug, or a blown fuse. It starts only when panel voltage is about 5 V above the battery. A blink about every 4 seconds can also just mean a GX is talking to it." },
  { id: "mppt-bulk", appliance: "Victron SmartSolar", code: "Blue on", meaning: "Bulk charge.", fix: "Normal. Blue stays on while the battery is taking a heavy charge." },
  { id: "mppt-abs", appliance: "Victron SmartSolar", code: "Yellow on", meaning: "Absorption.", fix: "Normal. Yellow stays on. The lithium preset is about 14.2 V for 2 hours. Do not change factory settings on a coach that is still under warranty." },
  { id: "mppt-float", appliance: "Victron SmartSolar", code: "Green on", meaning: "Float.", fix: "Normal. The battery is full and the controller is holding it." },
  { id: "mppt-maneq", appliance: "Victron SmartSolar", code: "Blue and yellow alternate", meaning: "Manual equalisation.", fix: "Blue and yellow blink alternately. Never equalize lithium, gel, or AGM." },
  { id: "mppt-autoeq", appliance: "Victron SmartSolar", code: "Yellow and green on", meaning: "Automatic equalisation.", fix: "Yellow and green are both steady. Never equalize lithium, gel, or AGM." },
  { id: "mppt-hot", appliance: "Victron SmartSolar", code: "Green blinks", meaning: "Controller too hot.", fix: "Green blinks alone. Give it airflow. Do not mount it directly above the battery." },
  { id: "mppt-oc", appliance: "Victron SmartSolar", code: "Blue and green blink", meaning: "Over-current.", fix: "Blue and green both blink. Check the battery fuse: about 35–40 A on a 100/30, 55–70 A on a 100/50." },
  { id: "mppt-ov", appliance: "Victron SmartSolar", code: "Yellow and green blink", meaning: "Panel voltage too high.", fix: "Yellow and green both blink. Too many panels in series for this controller." },
  { id: "mppt-bms", appliance: "Victron SmartSolar", code: "Yellow blinks", meaning: "VE.Smart network or BMS problem.", fix: "Yellow blinks alone. Check the Bluetooth or VE.Smart link and the battery BMS. A 4-second blink can just be a GX sending data — that is not this fault." },
  { id: "mppt-int", appliance: "Victron SmartSolar", code: "Blue and yellow blink", meaning: "Internal error.", fix: "Blue and yellow both blink together, not alternately. Power-cycle. If it returns, that is a Victron service item." },
  { id: "mppt-e1", appliance: "Victron SmartSolar", code: "Err 1", meaning: "Battery temperature too high.", fix: "Clears when the battery cools." },
  { id: "mppt-e2", appliance: "Victron SmartSolar", code: "Err 2", meaning: "Battery voltage too high.", fix: "Clears on its own. Check the other chargers and the battery-voltage setting." },
  { id: "mppt-e17", appliance: "Victron SmartSolar", code: "Err 17", meaning: "The charger is still too hot after it has already cut back.", fix: "Clears when it cools. Give it airflow." },
  { id: "mppt-e18", appliance: "Victron SmartSolar", code: "Err 18", meaning: "Charger over-current.", fix: "Usually clears. If it stays, disconnect all power for 3 minutes." },
  { id: "mppt-e20", appliance: "Victron SmartSolar", code: "Err 20", meaning: "Bulk ran longer than the limit.", fix: "Update the firmware, then factory-reset and set it up again." },
  { id: "mppt-e21", appliance: "Victron SmartSolar", code: "Err 21", meaning: "Current sensor problem. It does not clear itself.", fix: "Update firmware, reset, and reseat the wiring. A dealer if it stays." },
  { id: "mppt-e26", appliance: "Victron SmartSolar", code: "Err 26", meaning: "A terminal is too hot.", fix: "Check the wiring and tighten the bolts. It clears when the terminal cools." },
  { id: "mppt-e28", appliance: "Victron SmartSolar", code: "Err 28", meaning: "Power-stage problem.", fix: "Disconnect and reconnect every wire. Replace the controller if it returns." },
  { id: "mppt-e33", appliance: "Victron SmartSolar", code: "Err 33", meaning: "Panel voltage too high.", fix: "Clears on its own. Too many panels in series." },
  { id: "mppt-e38", appliance: "Victron SmartSolar", code: "Err 38", meaning: "Panel input shut down to protect the battery.", fix: "Disconnect the panels, then the battery. Wait 3 minutes. Reconnect the battery first, then the panels." },
  { id: "mppt-e39", appliance: "Victron SmartSolar", code: "Err 39", meaning: "Panel input shut down. This one resumes on its own.", fix: "Wait. If it keeps returning, use the same 3-minute disconnect as Err 38." },
  { id: "mppt-e40", appliance: "Victron SmartSolar", code: "Err 40", meaning: "The panel input failed to shut down.", fix: "The charger is faulty. Replace it." },
  { id: "mppt-e80", appliance: "Victron SmartSolar", code: "Err 80", meaning: "Panel input shut down. Same family as 81 through 87.", fix: "Disconnect the panels and the battery. Reconnect the battery only. Firmware should be 1.73 or newer. If 80–83 is still showing, power-cycle, then Settings, Product info, Reset, then reconnect the panels. Only later serial numbers have this reset. 100/30 from HQ2601, 100/50 from HQ2614." },
  { id: "mppt-e116", appliance: "Victron SmartSolar", code: "Err 116", meaning: "Calibration data lost.", fix: "Replace it if the error is active. If it appeared after a firmware downgrade, reinstall 1.4x." },
  { id: "mppt-e117", appliance: "Victron SmartSolar", code: "Err 117", meaning: "Firmware update did not finish.", fix: "Run the update again." },
  { id: "mppt-e119", appliance: "Victron SmartSolar", code: "Err 119", meaning: "Settings were lost.", fix: "Factory reset, disconnect for 3 minutes, then set it up again." },
  { id: "gir-e0", appliance: "Girard GSWH-2", code: "E0", meaning: "Outlet temperature sensor fault.", fix: "Check the thermistor. Read the heater label — not every coach has a Girard." },
  { id: "gir-e1", appliance: "Girard GSWH-2", code: "E1", meaning: "Ignition failure.", fix: "LP supply, the ECO, and the igniter gap. Dirt on the burner does this too." },
  { id: "gir-e2", appliance: "Girard GSWH-2", code: "E2", meaning: "Flame lost while running. The buzzer sounds.", fix: "The code table does not add a reset. Check LP, then cycle power." },
  { id: "gir-e3", appliance: "Girard GSWH-2", code: "E3", meaning: "ECO open. Over about 140 °F.", fix: "Service test: unplug CN9 and check the blue wires. No continuity means a bad ECO. Continuity means a bad board." },
  { id: "gir-e4", appliance: "Girard GSWH-2", code: "E4", meaning: "Inlet temperature sensor fault.", fix: "Check or replace the thermistor." },
  { id: "gir-e5", appliance: "Girard GSWH-2", code: "E5", meaning: "Blower fault.", fix: "The code table stops there. Look at the blower and the intake before you replace the board." },
  { id: "gir-e6", appliance: "Girard GSWH-2", code: "E6", meaning: "Outlet stayed over 140 °F for 3 seconds.", fix: "Low flow or a bad sensor. Open the tap fully." },
  { id: "gir-e7", appliance: "Girard GSWH-2", code: "E7", meaning: "Modulating gas valve fault.", fix: "The manual does not give an owner reset. This is a service item.", source: "Girard GSWH-2 manual. No owner reset is given." },
  { id: "gir-e8", appliance: "Girard GSWH-2", code: "E8", meaning: "Pressure switch, motor, or a blocked exhaust.", fix: "Clear the exhaust, then the switch and the motor." },
  { id: "gir-e9", appliance: "Girard GSWH-2", code: "E9", meaning: "Flame sensor short.", fix: "The code table does not give a reset. Service if it returns after a power cycle." },
  { id: "aq-1", appliance: "Truma AquaGo", code: "1", meaning: "Flame not detected. Shown only after 3 tries, about 30 seconds apart.", fix: "Switch off, wait 5 seconds, switch on. If it stays, Truma service. The CP plus panel shows this as E1W." },
  { id: "aq-2", appliance: "Truma AquaGo", code: "2", meaning: "Exhaust or burner over-temperature switch open or unplugged.", fix: "Off, wait 5 seconds, on. CP plus shows E2W." },
  { id: "aq-3", appliance: "Truma AquaGo", code: "3", meaning: "Exhaust pressure switch did not close, or it closed with the fan off.", fix: "Blocked exhaust or a bad switch. Off, wait 5 seconds, on. CP plus shows E3W." },
  { id: "aq-4", appliance: "Truma AquaGo", code: "4", meaning: "Water over-temperature switch opened above 185 °F.", fix: "Off, wait 5 seconds, on. CP plus shows E4W." },
  { id: "aq-5", appliance: "Truma AquaGo", code: "5", meaning: "Flame sensed at the wrong time.", fix: "Off, wait 5 seconds, on. CP plus shows E5W." },
  { id: "aq-6", appliance: "Truma AquaGo", code: "6", meaning: "Gas-valve safety circuit is open.", fix: "Off, wait 5 seconds, on. CP plus shows E6W." },
  { id: "aq-7", appliance: "Truma AquaGo", code: "7", meaning: "Burner control memory error.", fix: "Off, wait 5 seconds, on. If it stays, Truma service." },
  { id: "aq-9", appliance: "Truma AquaGo", code: "9", meaning: "Water outlet temperature sensor open or shorted.", fix: "Off, wait 5 seconds, on. CP plus shows E9W." },
  { id: "aq-10", appliance: "Truma AquaGo", code: "10", meaning: "The valve-actuation signal never turned on.", fix: "Off, wait 5 seconds, on. Service if it stays." },
  { id: "aq-11", appliance: "Truma AquaGo", code: "11", meaning: "The controller did not release the gas path.", fix: "Off, wait 5 seconds, on. Service if it stays." },
  { id: "aq-12", appliance: "Truma AquaGo", code: "12", meaning: "Internal error.", fix: "Off, wait 5 seconds, on. Service if it stays." },
  { id: "aq-13", appliance: "Truma AquaGo", code: "13", meaning: "Gas shut-off valve short. Over 1000 mA.", fix: "Off, wait 5 seconds, on. Do not keep resetting a short." },
  { id: "aq-16", appliance: "Truma AquaGo", code: "16", meaning: "Controller malfunction.", fix: "Off, wait 5 seconds, on. Service if it stays." },
  { id: "aq-20", appliance: "Truma AquaGo", code: "20", meaning: "Inlet water sensor fault, or water below 14 °F.", fix: "Off, wait 5 seconds, on. CP plus shows W 20 W." },
  { id: "aq-21", appliance: "Truma AquaGo", code: "21", meaning: "Circulation-line temperature sensor fault.", fix: "Off, wait 5 seconds, on." },
  { id: "aq-22", appliance: "Truma AquaGo", code: "22", meaning: "Gas valve modulation section open or shorted.", fix: "Off, wait 5 seconds, on. Service if it stays." },
  { id: "aq-23", appliance: "Truma AquaGo", code: "23", meaning: "Supply voltage over 16.4 V.", fix: "Off, wait 5 seconds, on. Check the converter or charger." },
  { id: "aq-24", appliance: "Truma AquaGo", code: "24", meaning: "Supply voltage under 10 V.", fix: "Charge the battery, then reset: off, wait 5 seconds, on." },
  { id: "aq-25", appliance: "Truma AquaGo", code: "25", meaning: "Flue-fan current out of range.", fix: "Off, wait 5 seconds, on. Clear the flue if it returns." },
  { id: "aq-26", appliance: "Truma AquaGo", code: "26", meaning: "Circulation pump current out of range.", fix: "Off, wait 5 seconds, on." },
  { id: "aq-27", appliance: "Truma AquaGo", code: "27", meaning: "Circulation pump is running dry. It retries 20 times.", fix: "Fill and bleed the loop. Off, wait 5 seconds, on." },
  { id: "aq-28", appliance: "Truma AquaGo", code: "28", meaning: "Gas pressure too low.", fix: "Open the LP valves and check the regulator. Then off, wait 5 seconds, on." },
  { id: "aq-29", appliance: "Truma AquaGo", code: "29", meaning: "Too much hot water demanded.", fix: "Close a second tap. Off, wait 5 seconds, on." },
  { id: "aq-30", appliance: "Truma AquaGo", code: "30", meaning: "Freeze warning. The sheet prints “below 27 °F (3 °C)”, and those two numbers do not agree.", fix: "Treat it as a freeze warning and confirm on your unit. Off, wait 5 seconds, on." },
  { id: "aq-31", appliance: "Truma AquaGo", code: "31", meaning: "Decalcification finished.", fix: "Not a failure. Off, wait 5 seconds, on, to clear it." },
  { id: "aq-32", appliance: "Truma AquaGo", code: "32", meaning: "Antifreeze-kit current too low. Often a broken cable.", fix: "Check the kit wiring. Off, wait 5 seconds, on." },
  { id: "aq-33", appliance: "Truma AquaGo", code: "33", meaning: "Antifreeze-kit current too high. Often a short.", fix: "Do not keep resetting a short. Check the kit wiring." },
  { id: "aq-e1w", appliance: "Truma AquaGo", code: "E1W", meaning: "CP plus display for code 1. Flame not detected.", fix: "Same reset as code 1: off, wait 5 seconds, on." },
  { id: "aq-e2w", appliance: "Truma AquaGo", code: "E2W", meaning: "CP plus display for code 2. Over-temperature switch.", fix: "Same reset as code 2." },
  { id: "aq-e3w", appliance: "Truma AquaGo", code: "E3W", meaning: "CP plus display for code 3. Exhaust pressure switch.", fix: "Same reset as code 3." },
  { id: "aq-e4w", appliance: "Truma AquaGo", code: "E4W", meaning: "CP plus display for code 4. Water over 185 °F.", fix: "Same reset as code 4." },
  { id: "aq-e5w", appliance: "Truma AquaGo", code: "E5W", meaning: "CP plus display for code 5. Flame at the wrong time.", fix: "Same reset as code 5." },
  { id: "aq-e6w", appliance: "Truma AquaGo", code: "E6W", meaning: "CP plus display for code 6. Gas-valve safety circuit.", fix: "Same reset as code 6." },
  { id: "aq-e9w", appliance: "Truma AquaGo", code: "E9W", meaning: "CP plus display for code 9. Outlet temperature sensor.", fix: "Same reset as code 9." },
  { id: "aq-w20", appliance: "Truma AquaGo", code: "W 20 W", meaning: "CP plus display for code 20. Inlet sensor.", fix: "Same reset as code 20." },
  { id: "vh-e2", appliance: "Truma VarioHeat", code: "E 2 H", meaning: "Flame not detected. The sheet also lists this as E 16 H.", fix: "New cylinder, valves open, propane not butane, and the intake and exhaust clear of ice and leaves." },
  { id: "vh-w25", appliance: "Truma VarioHeat", code: "W 25 H", meaning: "Voltage over 16.4 V.", fix: "Check the battery voltage and the chargers." },
  { id: "vh-w26", appliance: "Truma VarioHeat", code: "W 26 H", meaning: "Voltage under 10 V.", fix: "Charge or replace the battery." },
  { id: "vh-w27", appliance: "Truma VarioHeat", code: "W 27 H", meaning: "Warm-air outlets or the return air are blocked, or the end outlet is closed.", fix: "Clear the blockage and open the end outlet." },
  { id: "vh-w29", appliance: "Truma VarioHeat", code: "W 29 H", meaning: "Voltage about to fall under 10.4 V.", fix: "Charge the battery before it shuts down." },
  { id: "vh-w255", appliance: "Truma VarioHeat", code: "W 255 H", meaning: "No 12 V at the furnace, or no link to the panel.", fix: "Restore 12 V and the cable between the furnace and the panel." },
  { id: "cb-w17", appliance: "Truma Combi", code: "W 17 H", meaning: "Hot-water mode with an empty tank. US Truma’s Combi page. The international sheet calls this same number a water-overheat warning.", fix: "Switch it off, let it cool, fill the tank, then turn it back on. On a US Basecamp this is the empty-tank warning. W 401 H is the international number for the same job." },
  { id: "cb-w18", appliance: "Truma Combi", code: "W 18 H", meaning: "Warm-air outlet or the return air is blocked.", fix: "Connect every duct. Check for kinks. Clear the intake and ventilate the compartment." },
  { id: "cb-w24", appliance: "Truma Combi", code: "W 24 H", meaning: "Voltage about to fall under 10.4 V. International CP plus list.", fix: "Charge the battery and check the connections. On a US panel, under 10.0 V is E 44 H." },
  { id: "cb-e29", appliance: "Truma Combi", code: "E 29 H", meaning: "FrostControl heating element is drawing too much.", fix: "Replace the FrostControl element." },
  { id: "cb-w42", appliance: "Truma Combi", code: "W 42 H", meaning: "Window switch says a window is open.", fix: "Close the window above the cowl. W 412 H is the same message on the international sheet." },
  { id: "cb-e43", appliance: "Truma Combi", code: "E 43 H", meaning: "Battery voltage over 16.4 V.", fix: "Check the battery and the chargers. Measure 12 V at the heater under load. Unplug the converter and solar to see which one is high." },
  { id: "cb-e44", appliance: "Truma Combi", code: "E 44 H", meaning: "Battery under 10.0 V.", fix: "Charge the battery. One that will not hold a charge has to be replaced. US Truma’s Combi page. Not an ST-65 code and not an EMS code." },
  { id: "cb-w45", appliance: "Truma Combi", code: "W 45 H", meaning: "No 120 V, or the overheat protection opened. Eco Plus and Comfort Plus only. That is a Basecamp 16 through 2022, a Basecamp 20XE, and a World Traveler.", fix: "Check shore power and the fuse. If power is good, turn the heater off and push a pen into the hole on the left of the board cover until it clicks. If it stays, call Truma. Do not use the 230 V wording from the international sheet." },
  { id: "cb-e111", appliance: "Truma Combi", code: "E 111 H", meaning: "Electronics fault. International CP plus list.", fix: "Check 12 V at the heater under load. US Truma files a board fault under E 212 H instead." },
  { id: "cb-e112", appliance: "Truma Combi", code: "E 112 H", meaning: "Gas cylinder or shutoff closed, or overheat protection. US Truma groups E 112 H, E 202 H, and E 211 H. The service handbook also lists E 121 H and E 122 H as flame not seen or unstable.", fix: "Open the cylinder and the gas switch on the heater. If it stays, shut it down, let it cool, fill the tank with cold water, and clear the ducts and the intake. Supply about 11–13 in. water column." },
  { id: "cb-e212", appliance: "Truma Combi", code: "E 212 H", meaning: "Intake or exhaust blocked, gas valve closed, regulator fault, overheat protection, or the board.", fix: "Clear the exterior intake and exhaust. Open the gas switch. If it stays, cool it, fill with cold water, and clear the ducts. A code that remains can be the board. That is a Truma job, not a guess at the board." },
  { id: "cb-w255", appliance: "Truma Combi", code: "W 255 H", meaning: "No 12 V, or no connection to the panel.", fix: "The heater wants about 11–15 V. Check the 6-pin cable. The CP plus has its own 12 V feed and a 1 A fuse." },
  { id: "cb-w301", appliance: "Truma Combi", code: "W 301 H", meaning: "12 V too high. Also shown as W 417 H on the international sheet.", fix: "Check 12 V at the heater. US Truma uses E 43 H for voltage over 16.4 V." },
  { id: "cb-w302", appliance: "Truma Combi", code: "W 302 H", meaning: "12 V too low. Also shown as W 418 H on the international sheet.", fix: "Charge the battery and check the connections. On a US panel, under 10.0 V is E 44 H." },
  { id: "cb-w303", appliance: "Truma Combi", code: "W 303 H", meaning: "Voltage about to fall under 10.4 V. Also shown as W 411 H.", fix: "Charge the battery." },
  { id: "cb-w401", appliance: "Truma Combi", code: "W 401 H", meaning: "Hot-water mode with an empty tank. International CP plus number.", fix: "On a US Combi the empty-tank warning is W 17 H. Same fix if this number is the one on your panel: off, cool, fill." },
  { id: "cb-w402", appliance: "Truma Combi", code: "W 402 H", meaning: "Air overheat warning. International number for the same fault as W 18 H.", fix: "Ducts, kinks, and the intake." },
  { id: "cb-w407", appliance: "Truma Combi", code: "W 407 H", meaning: "Shore-power fault. International number.", fix: "Check shore power and the fuse. On a US coach that is 120 V. W 45 H is the US Eco Plus code for the same fault." },
  { id: "cb-w408", appliance: "Truma Combi", code: "W 408 H", meaning: "Gas supply failed while running in mixed mode.", fix: "Check gas pressure. Start in gas mode, clear the fault, then go back to mixed." },
  { id: "cb-w412", appliance: "Truma Combi", code: "W 412 H", meaning: "Window switch says a window is open.", fix: "Close the window above the cowl." },
  { id: "cb-e507", appliance: "Truma Combi", code: "E 507 H", meaning: "Gas supply interrupted. Also E 516 H and E 517 H. International list.", fix: "Check gas operating pressure. US Truma groups the gas-closed codes as E 112 H, E 202 H, and E 211 H." },
  { id: "cb-e607", appliance: "Truma Combi", code: "E 607 H", meaning: "Locked after more than 4 resets in 15 minutes.", fix: "Wait 15 minutes, then reset once." },
  { id: "cb-e621", appliance: "Truma Combi", code: "E 621 H", meaning: "Room-temperature sensor or its cable.", fix: "Check the plugs. Replace the sensor if the cable is good." },
  { id: "cb-e624", appliance: "Truma Combi", code: "E 624 H", meaning: "FrostControl heating element shorted.", fix: "Replace the element." },
  { id: "cb-e632", appliance: "Truma Combi", code: "E 632 H", meaning: "Shore-power overheat protection tripped. International list.", fix: "Reset that protection. Find why it got hot before you leave it running. On a US Eco Plus, W 45 H is the code that covers this." },
  { id: "ccc-e1", appliance: "Dometic CCC2", code: "E1", meaning: "Lost communication. Every board down means the system stops. One board means that zone.", fix: "Zone DIP switches and the cable. Try 12 V straight from the battery." },
  { id: "ccc-e2", appliance: "Dometic CCC2", code: "E2", meaning: "Indoor return-air sensor open.", fix: "The code table does not add a test. Check the sensor before you replace the thermostat." },
  { id: "ccc-e3", appliance: "Dometic CCC2", code: "E3", meaning: "Indoor sensor shorted.", fix: "Check or replace the room sensor." },
  { id: "ccc-e4", appliance: "Dometic CCC2", code: "E4", meaning: "Outdoor sensor fault. Heat pump locked out.", fix: "Check the outdoor sensor. Air conditioning can still run." },
  { id: "ccc-e5", appliance: "Dometic CCC2", code: "E5", meaning: "Freeze sensor fault. Air conditioning locked out.", fix: "Check or replace the freeze sensor." },
  { id: "ccc-e6", appliance: "Dometic CCC2", code: "E6", meaning: "Humidity sensor fault.", fix: "The code table does not add a reset." },
  { id: "ccc-e7", appliance: "Dometic CCC2", code: "E7", meaning: "Lost 120 V to the roof boards.", fix: "Shore or generator power, and the breaker to the roof unit." },
  { id: "ccc-e8", appliance: "Dometic CCC2", code: "E8", meaning: "Heat-pump and heat-strip DIP switches are both on.", fix: "Only one of those switches should be on." },
  { id: "ccc-e9", appliance: "Dometic CCC2", code: "E9", meaning: "Dehumidifier DIP is on together with heat pump or heat strip.", fix: "Correct the DIP switches." },
  { id: "ccc-ptc", appliance: "Dometic CCC2", code: "No DC", meaning: "No 12 V at the control. The power module uses a PTC, not a fuse.", fix: "Find the short, then disconnect DC positive for 30 seconds to reset." },
  { id: "sz-e1", appliance: "Dometic single-zone", code: "E1", meaning: "Lost communication with the module board.", fix: "Check the cable from the thermostat to the board." },
  { id: "sz-e2", appliance: "Dometic single-zone", code: "E2", meaning: "Room sensor open or out of range.", fix: "Check or replace the room sensor." },
  { id: "sz-e3", appliance: "Dometic single-zone", code: "E3", meaning: "Room sensor shorted.", fix: "Check or replace the room sensor." },
  { id: "sz-e4", appliance: "Dometic single-zone", code: "E4", meaning: "Outdoor sensor open. Heat-pump units.", fix: "Check or replace the outdoor sensor." },
  { id: "sz-e5", appliance: "Dometic single-zone", code: "E5", meaning: "Freeze sensor open. Air conditioning locked out.", fix: "Check or replace the freeze sensor." },
  { id: "mp-1", appliance: "Victron MultiPlus", code: "VE.Bus 1", meaning: "This unit turned off because another phase turned off.", fix: "Find the phase that failed. Confirm the label says MultiPlus or Quattro before you use this list." },
  { id: "mp-3", appliance: "Victron MultiPlus", code: "VE.Bus 3", meaning: "The system did not find the devices it expected.", fix: "Check the cables. Switch everything off, then on." },
  { id: "mp-4", appliance: "Victron MultiPlus", code: "VE.Bus 4", meaning: "No other device was found at all.", fix: "Check the communication cables." },
  { id: "mp-5", appliance: "Victron MultiPlus", code: "VE.Bus 5", meaning: "AC output voltage too high.", fix: "Check the AC cables." },
  { id: "mp-8", appliance: "Victron MultiPlus", code: "VE.Bus 8", meaning: "Ground-relay test failed.", fix: "A GX screen shows whether the relay is stuck open or closed. This is an installer job." },
  { id: "mp-10", appliance: "Victron MultiPlus", code: "VE.Bus 10", meaning: "The units cannot agree on the time.", fix: "Check the communication cables." },
  { id: "mp-11", appliance: "Victron MultiPlus", code: "VE.Bus 11", meaning: "Relay test failed. Usually the wiring, sometimes the relay.", fix: "Do not keep resetting it. Have the install checked." },
  { id: "mp-14", appliance: "Victron MultiPlus", code: "VE.Bus 14", meaning: "The unit cannot send data.", fix: "Check the communication cables." },
  { id: "mp-16", appliance: "Victron MultiPlus", code: "VE.Bus 16", meaning: "A VE.Bus dongle is missing.", fix: "Update the firmware. Current firmware does not need the dongle. It stays off until you restart it." },
  { id: "mp-17", appliance: "Victron MultiPlus", code: "VE.Bus 17", meaning: "A unit made itself master because the master failed.", fix: "Check the failed unit and the cables." },
  { id: "mp-18", appliance: "Victron MultiPlus", code: "VE.Bus 18", meaning: "An over-voltage happened.", fix: "Check the AC cables." },
  { id: "mp-20", appliance: "Victron MultiPlus", code: "VE.Bus 20", meaning: "The configuration is not allowed with the grid code.", fix: "Change the configuration. It stays off until you restart it." },
  { id: "mp-22", appliance: "Victron MultiPlus", code: "VE.Bus 22", meaning: "This unit cannot run as a slave.", fix: "Replace the unit." },
  { id: "mp-24", appliance: "Victron MultiPlus", code: "VE.Bus 24", meaning: "The transfer switch protected itself.", fix: "Switch everything off, then on. Shore voltage may be too low." },
  { id: "mp-25", appliance: "Victron MultiPlus", code: "VE.Bus 25", meaning: "Firmware does not match across the units.", fix: "Turn them on one at a time until the error returns. Update that unit." },
  { id: "mp-26", appliance: "Victron MultiPlus", code: "VE.Bus 26", meaning: "Internal error.", fix: "Switch everything off, then on. Victron if it returns." },
  { id: "mp-30", appliance: "Victron MultiPlus", code: "VE.Bus 30", meaning: "A corrupted message. Also shown as 31.", fix: "Check the RJ45 cables and the connections." },
  { id: "mp-128", appliance: "Victron MultiPlus", code: "VE.Bus 128", meaning: "It will not connect because the relay test failed for more than 5 minutes.", fix: "Check the install and the relays. A grid-code Quattro will stay off the shore until this clears." },
  { id: "mp-bulk", appliance: "Victron MultiPlus", code: "Bulk LED flashes", meaning: "Bulk ran longer than 10 hours, and shore power is present.", fix: "Check the batteries. Reset by switching the unit off and on." },
  { id: "mp-vsense", appliance: "Victron MultiPlus", code: "Bulk and absorption flash", meaning: "Voltage-sense wires disagree by more than 7 V.", fix: "Check the sense wiring. The unit keeps running." },
  { id: "mp-temp", appliance: "Victron MultiPlus", code: "Absorption and float flash", meaning: "The battery temperature reading is not believable.", fix: "Check or replace the temperature sensor. The unit keeps running." },
  { id: "mp-ripple", appliance: "Victron MultiPlus", code: "Low battery and overload", meaning: "The inverter turned off. DC ripple is too high.", fix: "Larger cables, shorter runs, or a bigger battery. Then switch it off and on." },
  { id: "mp-load", appliance: "Victron MultiPlus", code: "Overload LED", meaning: "The overload light is on by itself.", fix: "Reduce the load. If it will not charge with shore power present, the input wants about 97–140 V. On a generator, turn on Weak AC and the dynamic current limiter." },
  { id: "mp-vebus-led", appliance: "Victron MultiPlus", code: "Inverter light opposite", meaning: "The inverter-on light flashes opposite the bulk, absorption, and float lights.", fix: "That pattern is a VE.Bus code. Match the number in this list. The LED chart itself is in the MultiPlus manual.", source: "Victron MultiPlus manual, the LED chart." },
  { id: "bb-hv", appliance: "Battle Born GC3", code: "High voltage", meaning: "Charge stopped above 14.7 V. You can still use the battery.", fix: "It rebalances over several full charges. Confirm the label is a GC3 or GC3H, Airstream 514020-01, before you use this list." },
  { id: "bb-lv", appliance: "Battle Born GC3", code: "Low voltage", meaning: "Discharge stopped under 10.6 V. It will still accept a charge.", fix: "Charge it within 24 hours. Some chargers will not see a battery under 10 V, so it may need a jump from another 12 V source." },
  { id: "bb-hot", appliance: "Battle Born GC3", code: "High temperature", meaning: "No charge above 131 °F. No discharge at 140 °F.", fix: "Cool the battery." },
  { id: "bb-cold", appliance: "Battle Born GC3", code: "Low temperature", meaning: "No charge below 32 °F. The sheet heading also says 25 °F.", fix: "Use 32 °F. Warm the battery, or use the GC3H heater, before you charge. It can still discharge down to about −4 °F." },
  { id: "bb-amp", appliance: "Battle Born GC3", code: "High current", meaning: "More than about 500 A for 30 seconds, or a higher spike for half a second.", fix: "It reconnects after 5 seconds. Find the load that did it." },
  { id: "bb-short", appliance: "Battle Born GC3", code: "Short circuit", meaning: "The battery stays disconnected until the cables come off.", fix: "Remove the cables and measure voltage. Above 10 V, reconnect. Under 10 V, call Battle Born." },
  { id: "gx-42", appliance: "Cerbo GX", code: "GX 42", meaning: "Storage is corrupt.", fix: "Not a field fix. The unit goes back for repair. Classic, Trade Wind, and Basecamp XE are the coaches this panel is documented on." },
  { id: "gx-46", appliance: "Cerbo GX", code: "GX 46", meaning: "The data partition is full.", fix: "Settings, General, Support status. Remove extra apps." },
  { id: "gx-47", appliance: "Cerbo GX", code: "GX 47", meaning: "Data partition problem.", fix: "Dealer or installer." },
  { id: "gx-48", appliance: "Cerbo GX", code: "GX 48", meaning: "DVCC is on, and a device has firmware that is too old.", fix: "Update every device, or turn DVCC off if your battery notes do not allow it." },
  { id: "gx-49", appliance: "Cerbo GX", code: "GX 49", meaning: "Grid meter not found.", fix: "Check the wiring and the configuration." },
  { id: "gx-51", appliance: "Cerbo GX", code: "GX 51", meaning: "The MK3 interface needs a firmware update.", fix: "Settings, Devices, the MultiPlus, then the update notice. The inverter may restart." },
  { id: "gx-60", appliance: "Cerbo GX", code: "GX 60", meaning: "Could not connect to the GX.", fix: "Reboot the Cerbo, and the display that is talking to it." },
  { id: "vrm-150", appliance: "Cerbo GX", code: "VRM 150", meaning: "The Wi-Fi network answered with a login page.", fix: "The GX cannot join a network that asks you to accept terms. Use another network. VRM 151 is the same idea." },
  { id: "vrm-152", appliance: "Cerbo GX", code: "VRM 152", meaning: "The connection timed out.", fix: "Weak Wi-Fi, or a firewall." },
  { id: "vrm-153", appliance: "Cerbo GX", code: "VRM 153", meaning: "Connection or certificate problem.", fix: "Set the Cerbo date, time, and time zone. Check the router." },
  { id: "vrm-154", appliance: "Cerbo GX", code: "VRM 154", meaning: "DNS failed.", fix: "Set a DNS server on Ethernet or Wi-Fi. DHCP normally does this." },
  { id: "vrm-155", appliance: "Cerbo GX", code: "VRM 155", meaning: "No route to the internet.", fix: "DHCP should hand out a gateway. If you set a static address, the gateway has to be right." },
  { id: "vrm-159", appliance: "Cerbo GX", code: "VRM 159", meaning: "Unknown VRM error.", fix: "Read the message on the screen. The number alone is not enough." },
  { id: "rm-check", appliance: "Dometic RM fridge", code: "CHECK", meaning: "Gas ignition failed on an absorption fridge.", fix: "Press the main power button off, then on. After a new LP tank it can take 3 or 4 tries. This is not the 12 V compressor fridge." },
  { id: "rm-latch", appliance: "Dometic RM fridge", code: "CHECK on AC", meaning: "The CHECK lamp stayed on from an earlier gas failure, even though shore power is there.", fix: "Press the main power button off, then on. It can still cool on AC while the lamp is on." },
  { id: "rm-limp", appliance: "Dometic RM fridge", code: "Limp mode", meaning: "It cannot read the temperature sensor, so it runs continuously.", fix: "It keeps cooling until a new sensor is installed and the system is reset." },
  { id: "sl-lpg", appliance: "SeeLevel II", code: "LPG 0", meaning: "The propane reading stays at 0 on a 709-BTP3.", fix: "The sender wiring is shorted. Check that wiring. Other tanks can still be fine." },
  { id: "sl-nca", appliance: "SeeLevel II", code: "nCA", meaning: "The propane sender was never calibrated.", fix: "Calibrate it with the tank full." },
  { id: "sl-bid", appliance: "SeeLevel II", code: "BID", meaning: "A sender answered with the wrong ID.", fix: "Two senders share an ID, or one sender is bad. The screen may also say crc." },
  { id: "sl-btc", appliance: "SeeLevel II", code: "bTC", meaning: "The sender sent the wrong number of bits.", fix: "Check the tabs cut on the sender, and that the bus does not have a duplicate." },
  { id: "sl-dis", appliance: "SeeLevel II", code: "dIS", meaning: "That tank is turned off in the display.", fix: "Enable it in the programming steps. This is not a sender failure." },
  { id: "ems-e0", appliance: "Progressive Industries EMS", code: "E0", meaning: "Normal. The shore protector is passing power.", fix: "Not a fault. This is not a PD1600 inverter code." },
  { id: "ems-e1", appliance: "Progressive Industries EMS", code: "E1", meaning: "Reverse polarity. Hot and neutral are swapped.", fix: "The EMS will not pass power. Tell the campground. Try another pedestal. This is not the PD1600 low-battery code.", source: "Progressive Industries EMS. Not the PD1600 low-battery code." },
  { id: "ems-e2", appliance: "Progressive Industries EMS", code: "E2", meaning: "Open ground.", fix: "Tell the campground. Try another pedestal." },
  { id: "ems-e3", appliance: "Progressive Industries EMS", code: "E3", meaning: "Line voltage over 132 V.", fix: "Do not bypass the EMS. A reading of 240 V means the pedestal is wrong. Have it metered." },
  { id: "ems-e4", appliance: "Progressive Industries EMS", code: "E4", meaning: "Line voltage under 104 V.", fix: "A heavy load can drag a weak pedestal down. Tell the campground if it stays low with the loads off." },
  { id: "ems-e5", appliance: "Progressive Industries EMS", code: "E5", meaning: "Second line over 132 V. 50 A units only.", fix: "Does not apply to a 30 A EMS. Tell the campground." },
  { id: "ems-e6", appliance: "Progressive Industries EMS", code: "E6", meaning: "Second line under 104 V. 50 A units only.", fix: "Does not apply to a 30 A EMS." },
  { id: "ems-e7", appliance: "Progressive Industries EMS", code: "E7", meaning: "Line frequency over 69 Hz.", fix: "Usually a generator. Progressive Industries support, not a campground guess." },
  { id: "ems-e8", appliance: "Progressive Industries EMS", code: "E8", meaning: "Line frequency under 51 Hz.", fix: "Same as E7. Call Progressive Industries." },
  { id: "ems-e9", appliance: "Progressive Industries EMS", code: "E9", meaning: "The remote display link is down.", fix: "Check the display cable. A portable PT unit may not use E9. Hardwired HW30 and HW50 do." },
  { id: "ems-e10", appliance: "Progressive Industries EMS", code: "E10", meaning: "The surge module is used up.", fix: "It may still show errors, but it no longer protects. Contact Progressive Industries." },
  { id: "ems-pe", appliance: "Progressive Industries EMS", code: "PE", meaning: "A previous error. PE4 means an earlier E4.", fix: "It clears when shore power is removed from the EMS." },
  { id: "pd-none", appliance: "Progressive Dynamics", code: "No code", meaning: "Progressive Dynamics converters, and the Basecamp power center in the 2022 and 2026 books (513802), do not use numeric fault codes. A 1000 W or 2000 W inverter is a different unit. Read the label before you use E-1 through E-7.", fix: "A Charge Wizard light is a charge stage, not a fault. Solid green is boost, about 14.4 V. A flash about once a second, or 2–3 times a second, is normal mode at 13.6 V. A flash every 6–8 seconds is storage mode at 13.2 V. No 12 V output is AC supply, a reverse-polarity fuse, or heat." },
  { id: "nk-e1", appliance: "Norcold 12 V fridge", code: "E1", meaning: "Fresh-food thermistor is not cycling.", fix: "Check the plug and the wiring. About 10 kΩ at 77 °F if you test it. N8DC and N10DC, and the larger N15 and N20." },
  { id: "nk-e2", appliance: "Norcold 12 V fridge", code: "E2", meaning: "Freezer thermistor is not cycling.", fix: "Same checks as E1, on the freezer sensor." },
  { id: "nk-e3", appliance: "Norcold 12 V fridge", code: "E3", meaning: "Voltage outside the cut-out. It drops out near 10.4 V.", fix: "Measure 12 V at the fridge while it runs. Battery, wire size, or the board. N15 and N20 restart near 11.7 V." },
  { id: "nk-e4", appliance: "Norcold 12 V fridge", code: "E4", meaning: "A door has been open more than 2 minutes.", fix: "Close it. Check the gasket. These front-panel letters are not the rear-module flash codes." },
  { id: "nk-e5", appliance: "Norcold 12 V fridge", code: "E5", meaning: "Voltage too low to start. N15 and N20.", fix: "It wants about 10.9 V to start. Charge the battery and check the connections. Not used as a front-panel code on an N8 or N10." },
  { id: "nk-e6", appliance: "Norcold 12 V fridge", code: "E6", meaning: "Ambient thermistor. N15 and N20.", fix: "Check the plug. Replace the sensor if it tests bad." },
  { id: "nk-e7", appliance: "Norcold 12 V fridge", code: "E7", meaning: "Fresh-food evaporator fan. N15 and N20.", fix: "Clear ice or a blocked fan, then the plug. Replace the fan if it will not run." },
  { id: "nk-e8", appliance: "Norcold 12 V fridge", code: "E8", meaning: "Freezer condenser fan. N15 and N20.", fix: "Dust, a loose plug, or a dead fan." },
  { id: "nk-e9", appliance: "Norcold 12 V fridge", code: "E9", meaning: "Fresh-food condenser fan. N15 and N20.", fix: "Same as E8, on the fresh-food side." },
  { id: "vs-e1", appliance: "Coleman VS-18", code: "E1", meaning: "Room sensor fault. Variable-speed system only.", fix: "Replace the thermostat. Do not use this list on a Mach 8 or a 9420 network thermostat." },
  { id: "vs-e2", appliance: "Coleman VS-18", code: "E2", meaning: "Indoor coil sensor fault.", fix: "Sensor or the connection. Service." },
  { id: "vs-e3", appliance: "Coleman VS-18", code: "E3", meaning: "Outside-air sensor fault.", fix: "Service." },
  { id: "vs-e4", appliance: "Coleman VS-18", code: "E4", meaning: "Outdoor coil sensor fault.", fix: "Service." },
  { id: "vs-e5", appliance: "Coleman VS-18", code: "E5", meaning: "Compressor discharge sensor fault.", fix: "Service." },
  { id: "vs-e6", appliance: "Coleman VS-18", code: "E6", meaning: "AC voltage moved more than 10 percent during start.", fix: "It clears after 20 seconds. The compressor waits about 3 minutes." },
  { id: "vs-e7", appliance: "Coleman VS-18", code: "E7", meaning: "Discharge temperature passed 230 °F.", fix: "Clear a blocked outdoor coil. Refrigerant work is a tech job. It recovers near 176 °F." },
  { id: "vs-e8", appliance: "Coleman VS-18", code: "E8", meaning: "Indoor coil below about 10 °F.", fix: "A blocked or iced coil. It recovers near 45 °F. Do not open the drive board. High voltage." },
  { id: "vs-e9", appliance: "Coleman VS-18", code: "E9", meaning: "The thermostat cannot talk to the drive board.", fix: "Check the four thermostat wires and the roof plug. H1 and H2 are the two directions of that same fault." },
  { id: "vs-de", appliance: "Coleman VS-18", code: "dE", meaning: "Compressor driver fault.", fix: "Check the compressor wires. If none are loose, the driver is replaced. Sub-codes d2 through dC are on that board." },
  { id: "cz-1", appliance: "CZone", code: "1 red", meaning: "Module not configured.", fix: "A replacement module still needs a configuration. Classic Smart Control." },
  { id: "cz-2", appliance: "CZone", code: "2 red", meaning: "Configuration conflict.", fix: "The modules do not agree. A dealer with the config tool." },
  { id: "cz-3", appliance: "CZone", code: "3 red", meaning: "DIP switch conflict.", fix: "The switches do not match the configuration." },
  { id: "cz-5", appliance: "CZone", code: "5 red", meaning: "No modules detected.", fix: "Network power and the connections." },
  { id: "cz-7", appliance: "CZone", code: "7 red", meaning: "Over current, or a fuse is blown.", fix: "Find the channel. The fuse can be moved to Bypass for a manual override." },
  { id: "cz-9", appliance: "CZone", code: "9 red", meaning: "Commander missing.", fix: "The display is off the network." },
  { id: "tst-hi", appliance: "TST TPMS", code: "HI PRESSURE", meaning: "Above the high limit you set.", fix: "Let air out to the placard pressure. Classic monitors use this family. Read the brand on the display." },
  { id: "tst-lo", appliance: "TST TPMS", code: "LO PRESSURE", meaning: "Under the low limit you set.", fix: "Inflate to the placard. Cold air can trip a limit that was set tight." },
  { id: "tst-temp", appliance: "TST TPMS", code: "HI TEMP", meaning: "Over the high temperature. The default is about 158 °F.", fix: "Stop. Low pressure, a dragging brake, or a hot bearing." },
  { id: "tst-leak", appliance: "TST TPMS", code: "FAST LEAK", meaning: "Lost at least 2 psi in under a minute.", fix: "The alarm stays until the pressure is back in range. Do not keep driving on it." },
  { id: "mp-2", appliance: "Victron MultiPlus", code: "VE.Bus 2", meaning: "Old and new MK2 protocol mixed.", fix: "Victron says this should not happen. Service." },
  { id: "mp-6", appliance: "Victron MultiPlus", code: "VE.Bus 6", meaning: "Assistant or DDC program error.", fix: "Update the firmware on every unit and load the assistant again." },
  { id: "mp-7", appliance: "Victron MultiPlus", code: "VE.Bus 7", meaning: "An external device is connected and the assistant is missing.", fix: "A VE.Bus BMS with no assistant. Configure it." },
  { id: "mp-12", appliance: "Victron MultiPlus", code: "VE.Bus 12", meaning: "The two microcontrollers do not have the same settings.", fix: "Send all settings from VEConfigure, not only the changed ones." },
  { id: "mp-15", appliance: "Victron MultiPlus", code: "VE.Bus 15", meaning: "The products or firmware cannot run together.", fix: "Update every device." },
  { id: "mp-19", appliance: "Victron MultiPlus", code: "VE.Bus 19", meaning: "A slave has no AC input.", fix: "Feed AC to every unit, or turn off Switch as Group." },
  { id: "tank-dsi", appliance: "Suburban tank", code: "DSI light", meaning: "Ignition lockout on a tank heater. No E-number.", fix: "Switch off, wait 5 seconds, on. Light a stove burner first to clear air. Check the ECO reset. Do not use ST-65 E-codes on this heater." },
  { id: "gx-91", appliance: "Cerbo GX", code: "WS500 91", meaning: "The alternator regulator lost the BMS.", fix: "It drops to get-home mode and recovers when the BMS answers. Only if a WS500 is fitted." },
  ...extraFaultCodes,
];
