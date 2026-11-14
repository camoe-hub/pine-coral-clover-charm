import { C as symptomOn, p as matrixAllows } from "./checklists-CYZuG9Db.mjs";
import { t as symptomById } from "./symptoms-BuRfv0Qj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/causes-DZvk5kF7.js
/** October 2026 shared-cause matrix. One fault, several symptoms. */
var causes = [
	{
		id: "low-12",
		group: "Power",
		cause: "The house batteries are low",
		signs: [
			"Lights dead",
			"Pump dead",
			"Furnace dead",
			"Fridge dead"
		],
		start: "No 12 V checks",
		to: {
			name: "symptom",
			id: "no-12v",
			step: 0
		}
	},
	{
		id: "converter-profile",
		group: "Power",
		cause: "Converter not charging",
		signs: ["Batteries never recover", "Voltage stays flat while plugged in"],
		start: "Converter checks",
		to: {
			name: "symptom",
			id: "converter",
			step: 0
		}
	},
	{
		id: "converter-setting",
		group: "Power",
		cause: "The converter is on the wrong battery profile",
		signs: ["A lead-acid battery sits near 14.6 V", "A lithium battery never quite fills"],
		start: "Converter profile",
		to: {
			name: "symptom",
			id: "converter",
			step: 4
		}
	},
	{
		id: "shore-dead",
		group: "Power",
		cause: "Pedestal, inlet, or the main breaker",
		signs: [
			"No outlets",
			"Air conditioner dead",
			"No electric hot water"
		],
		start: "Open the 120 V checks",
		to: {
			name: "symptom",
			id: "no-120",
			step: 0
		}
	},
	{
		id: "thirty-amp",
		group: "Power",
		cause: "Too much on a 30 A pedestal",
		signs: [
			"Breaker trips",
			"Air conditioner was on",
			"Electric water heater was on"
		],
		start: "Open the 120 V checks",
		to: {
			name: "symptom",
			id: "no-120",
			step: 1
		}
	},
	{
		id: "gfci",
		group: "Power",
		cause: "A GFCI tripped, often from moisture",
		signs: ["Galley outlet dead", "Bath outlet dead"],
		start: "Open the 120 V checks",
		to: {
			name: "symptom",
			id: "no-120",
			step: 3
		}
	},
	{
		id: "lp-supply",
		group: "Gas",
		cause: "One LP problem, not four appliances",
		signs: [
			"Furnace quits",
			"Water heater will not light",
			"Weak cooktop"
		],
		start: "Open the LP checks",
		to: {
			name: "symptom",
			id: "lp",
			step: 1
		}
	},
	{
		id: "winter-bypass",
		group: "Water",
		cause: "Winterize valve still on, or a drain left open",
		signs: [
			"No water",
			"No hot water",
			"Pink taste",
			"Pump will not stop"
		],
		start: "Open the winter flowchart",
		to: {
			name: "flow",
			id: "winter"
		}
	},
	{
		id: "city-reg",
		group: "Water",
		cause: "City-water regulator",
		signs: ["The hose jumps or a fitting weeps", "Weak flow at the tap"],
		start: "City water checks",
		to: {
			name: "symptom",
			id: "city-psi",
			step: 0
		}
	},
	{
		id: "grey-vent",
		group: "Water",
		cause: "Gray-tank vent blocked",
		signs: ["Gray water in the shower", "Monitor says full"],
		start: "Open the gray-water checks",
		to: {
			name: "symptom",
			id: "gray-shower",
			step: 1
		}
	},
	{
		id: "seven-way",
		group: "Towing",
		cause: "Dirty 7-way plug, or a bad ground",
		signs: [
			"Weak brakes",
			"Lights out",
			"Truck is not charging"
		],
		start: "Open the 7-way checks",
		to: {
			name: "symptom",
			id: "seven-way",
			step: 0
		}
	},
	{
		id: "twisted",
		group: "Body",
		cause: "The trailer is out of level",
		signs: ["Door will not latch", "A window sticks"],
		start: "Open the door checks",
		to: {
			name: "symptom",
			id: "door",
			step: 0
		}
	},
	{
		id: "heater-code",
		group: "Gas",
		cause: "The code was read on the wrong heater",
		signs: ["Heater starts, then locks out", "The code does not match the label"],
		start: "Tankless code, on the heater label",
		to: {
			name: "symptom",
			id: "tankless",
			step: 2
		}
	},
	{
		id: "tank-sender",
		group: "Water",
		cause: "The tank monitor, not the tank",
		signs: ["OPn or Sht", "The level does not match the tank"],
		start: "Tank monitor checks",
		to: {
			name: "symptom",
			id: "tank-monitor",
			step: 0
		},
		appliance: "SeeLevel II"
	},
	{
		id: "bms-cutoff",
		group: "Power",
		cause: "The battery shut itself off",
		signs: ["Everything died at once", "A charger will not see the battery"],
		start: "Lithium checks",
		to: {
			name: "symptom",
			id: "lithium-cold",
			step: 1
		}
	},
	{
		id: "shunt-cal",
		group: "Power",
		cause: "The SmartShunt lost its calibration",
		signs: [
			"State of charge is blank",
			"Voltage still shows",
			"It started after the batteries were disconnected"
		],
		start: "Shunt checks",
		to: {
			name: "symptom",
			id: "solar",
			step: 5
		}
	},
	{
		id: "excess-flow",
		group: "Gas",
		cause: "The excess-flow valve tripped",
		signs: [
			"The flame stays low",
			"The furnace and the water heater starve together",
			"It started right after a tank was opened"
		],
		start: "Open the LP checks",
		to: {
			name: "symptom",
			id: "lp",
			step: 1
		}
	},
	{
		id: "low-tongue",
		group: "Towing",
		cause: "Tongue weight is too low",
		signs: ["The trailer sways", "It wanders when a truck passes"],
		start: "Sway checks",
		to: {
			name: "symptom",
			id: "sway",
			step: 1
		}
	}
];
/** The “usually” line is only for a cause this coach can actually have. */
function causeFits(cause, model, year) {
	if (model.family !== "Other" && cause.appliance && !matrixAllows(cause.appliance, model, year)) return false;
	if (cause.to.name !== "symptom") return true;
	const sy = symptomById(cause.to.id);
	if (!sy) return false;
	return symptomOn(sy, model, year);
}
//#endregion
export { causes as n, causeFits as t };
