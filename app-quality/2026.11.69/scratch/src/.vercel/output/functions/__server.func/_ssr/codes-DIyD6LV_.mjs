import { n as textHasWords } from "./words-CD5GbNH1.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/codes-DIyD6LV_.js
function c(id, appliance, code, meaning, fix) {
	return {
		id,
		appliance,
		code,
		meaning,
		fix
	};
}
/** Codes from the 2010–2027 compilation that were not already in the app. Forum rows say so. */
var extraFaultCodes = [
	c("alde-red", "Alde 3030", "Overheat red", "Overheat protection on the red cable. 3010 and 3020 wording.", "Bleed the system. Cold fluid about 1 cm above Min. Wait 15 minutes, then cycle 12 V. A 3030 does not use this split."),
	c("alde-blue", "Alde 3030", "Overheat blue", "Overheat protection on the blue cable. 3010 and 3020.", "Cycle 12 V. The manual gives no further owner fix."),
	c("nt-lock", "Suburban NT furnace", "Lockout", "Spark stops, gas valve closes, blower runs until the thermostat is off. No blink number.", "Thermostat off. When the blower stops, turn it on. It will not relight by itself. Read the furnace plate. This is not a Dometic DF flash code."),
	c("nt-neon-off", "Suburban NT furnace", "Neon dark", "The module neon is not flashing during the trial for ignition. No spark.", "Pull the white connector, clean the board terminals with a pencil eraser, and reseat it. If it still does not flash, the board is replaced."),
	c("nt-neon-on", "Suburban NT furnace", "Neon flashes, no flame", "Spark is present and the burner does not light.", "Gas valve on. Cycle the thermostat to bleed air. Electrode gap about 1/8 in. A tech checks gas pressure and valve voltage."),
	c("nt-sense", "Suburban NT furnace", "Lights, then lockout", "Flame is not proven after it lights.", "The sensor must sit in the inner blue cone. If the flame current is already in spec and it still locks out, the board is replaced."),
	c("nt-blower", "Suburban NT furnace", "Blower dead", "The blower never starts, so ignition never starts.", "Check 12 V at the furnace, the thermostat, and the relay. Some boards wait 3–10 seconds."),
	c("rm1350-e0", "Dometic RM1350", "E0", "The display cannot talk to the power module.", "It falls back to auto at a middle setting. Check the cable, grounds, and 12 V. Off, then on, after the repair."),
	c("rm1350-e1", "Dometic RM1350", "E1", "LP gas hardware fault, or the gas valve is unplugged.", "It may still cool on 120 V. Off, then on, after the repair. This is not an RM2451, which has a CHECK lamp and no E-number."),
	c("rm1350-e2", "Dometic RM1350", "E2", "Temperature sensor circuit failed.", "Check that the sensor wire is plugged in. Cooling stops on this fault."),
	c("rm1350-e3", "Dometic RM1350", "E3", "The cooling unit failed.", "Service center. The manual gives no owner test."),
	c("rm1350-e4", "Dometic RM1350", "E4", "12 V is outside about 8–18 V.", "Batteries, the converter, and the connections. Off, then on, after the voltage is back."),
	c("rua-w01", "Dometic RUA", "W01", "Fridge-compartment sensor. EU and AU manuals. US fitment was not confirmed.", "Cooling continues on a timer until it is fixed. Do not use this list on an RM or a Norcold."),
	c("rua-w04", "Dometic RUA", "W04", "CI bus fault.", "Switch off, then on."),
	c("rua-w05", "Dometic RUA", "W05", "Shore power missing, or AC under 190 V.", "Connect shore power, or select gas or 12 V."),
	c("rua-w06", "Dometic RUA", "W06", "No 12 V feed.", "Connect 12 V, or select another energy source."),
	c("rua-e03", "Dometic RUA", "E03", "The power module cannot talk to the display.", "Cooling continues at the last settings. Service."),
	c("rua-e07", "Dometic RUA", "E07", "No cooling on gas.", "Level the fridge. Reset. Service if it returns."),
	c("rua-e08", "Dometic RUA", "E08", "No cooling on AC.", "Level the fridge. Reset. Service if it returns."),
	c("rua-e09", "Dometic RUA", "E09", "No cooling on 12 V.", "Level the fridge. Reset. Service if it returns."),
	c("rua-w10", "Dometic RUA", "W10", "Door open more than 2 minutes.", "Close the door. If it still beeps, the door magnet."),
	c("rua-w11", "Dometic RUA", "W11", "12 V over 16 V.", "The interior light goes off at 16 V. It shuts down above 17 V."),
	c("rua-w22", "Dometic RUA", "W22", "12 V under 10 V.", "Restore 12 V."),
	c("rua-e12", "Dometic RUA", "E12", "Gas-valve test failed.", "Gas is locked. Reset. Service if it returns."),
	c("rua-e13", "Dometic RUA", "E13", "Gas-valve signal fault.", "Gas is locked. Reset. Service if it returns."),
	c("rua-w14", "Dometic RUA", "W14", "Inner fan fault.", "Cooling continues on a fixed thermostat."),
	c("rua-w15", "Dometic RUA", "W15", "Frame heater, current too low.", "Service. No owner fix in the manual."),
	c("rua-e16", "Dometic RUA", "E16", "Frame heater, current too high.", "The heater is turned off."),
	c("rua-w17", "Dometic RUA", "W17", "Defrost heater, current too low.", "Service."),
	c("rua-e18", "Dometic RUA", "E18", "Defrost heater, current too high.", "The heater is turned off."),
	c("rua-e50", "Dometic RUA", "E50", "Gas lockout after 3 tries.", "Check LP. Hold the knob about 2 seconds to reset."),
	c("rua-e51", "Dometic RUA", "E51", "Gas lockout.", "Gas stays locked. Service."),
	c("rua-e52", "Dometic RUA", "E52", "Gas valve shorted.", "Gas stays locked. Service."),
	c("rua-e53", "Dometic RUA", "E53", "Ignition electrode shorted.", "Gas stays locked. Service."),
	c("n6-fl", "Norcold N-series", "no FL", "The burner did not light on LP. Some panels show F, or a gas light flashing once a second.", "LP at the fridge, a clean burner, and the electrode. Not the Polar flash list, and not the 12 V compressor E-codes."),
	c("n6-sr", "Norcold N-series", "Sr", "Flame-sense circuit on the board failed.", "Service. A one-letter panel may show S."),
	c("n6-dclo", "Norcold N-series", "dc LO", "12 V under 10.5 V, or converter ripple. Some panels show C.", "The fridge wants about 10.5–15.4 V."),
	c("n6-dchi", "Norcold N-series", "dc HI", "12 V over 15.4 V. Some panels show E.", "The converter or solar is too high."),
	c("n6-dcre", "Norcold N-series", "dc rE", "The 12 V heater relay is stuck closed. 3-way fridges only.", "Board fault. Service."),
	c("n6-dche", "Norcold N-series", "dc HE", "12 V heater fault. 3-way only.", "The F2 fuse, the heater, or the board."),
	c("n6-ac", "Norcold N-series", "no AC", "No 120 V at the board. Some panels show A.", "Outlet, breaker, GFCI, and the board fuse."),
	c("n6-aclo", "Norcold N-series", "AC LO", "Shore power under 108 V.", "Check the pedestal or the generator."),
	c("n6-achi", "Norcold N-series", "AC HI", "Shore power over 132 V.", "Check the source before you keep running it."),
	c("n6-acre", "Norcold N-series", "AC rE", "The AC heater relay is stuck closed.", "The 1210 manual says replace the power board."),
	c("n6-ache", "Norcold N-series", "AC HE", "The AC heater is open. Some panels flash the ON light 3 times.", "Heater about 48 ohms on an N6 or N8, about 64 ohms on a 1200. Otherwise the board."),
	c("n6-dr", "Norcold N-series", "dr", "Door open more than 2 minutes.", "Close it. Check the striker and the lamp switch."),
	c("n6-bos", "Norcold N-series", "Thermistor flash", "Backup mode. The thermistor failed. A light winks off about every 20 seconds.", "The fridge keeps running on a timer. Replace the thermistor."),
	c("n6-noco", "Norcold N-series", "no co", "No cooling over a full cycle. Lockout. Some panels show n, or 5 flashes.", "If you smell ammonia or see yellow powder, do not reset it. Otherwise level it, clear the vents, then reset."),
	c("n6-li", "Norcold N-series", "LI OP", "High-temperature limit open. Some panels show O, or 6 flashes.", "Do not reset until the cause is found. Level, vents, and the limit switch."),
	c("pol-solid", "Norcold Polar", "Solid red", "No 120 V, then LP did not light.", "Try the other mode. Check LP and shore power. Polar flashes are not the older N611 flashes."),
	c("pol-1", "Norcold Polar", "1 flash", "AC heater fault.", "Shore power, the board fuse, and the heater. About 46–51 ohms cold."),
	c("pol-2", "Norcold Polar", "2 flashes", "Internal control fault.", "Gas-valve wires. Reset once. A second time means the board."),
	c("pol-3", "Norcold Polar", "3 flashes", "Limit circuit open on the board.", "Service. This is not the N611 3-flash meaning."),
	c("pol-4", "Norcold Polar", "4 flashes", "AC heater relay stuck on.", "Service."),
	c("pol-5", "Norcold Polar", "5 flashes", "Flame sensed when there should be none.", "Shut the LP off. Check for gas. This is not the older no-cooling 5-flash."),
	c("pol-8", "Norcold Polar", "8 flashes", "12 V too low.", "Battery, the fuse, and the ground at the fridge."),
	c("pol-9", "Norcold Polar", "9 flashes", "12 V too high.", "Turn the chargers off, reset, and bring them back one at a time."),
	c("pol-10", "Norcold Polar", "10 flashes", "The display cannot talk to the power board.", "12 V, the plugs, and the cable before you replace a board."),
	c("pol-snow", "Norcold Polar", "Snowflakes", "Thermistor fault.", "It runs on backup. Check the sensor."),
	c("pol-nodt", "Norcold Polar", "no dt", "The optical board cannot talk to the power board.", "Cable and plugs between the boards."),
	c("n4-1", "Norcold N4000", "1", "Flame sensed with the gas off.", "Service. N4000 is a large fridge and is unlikely in a travel trailer. Read the model."),
	c("n4-2", "Norcold N4000", "2", "Burner control module fault.", "Service."),
	c("n4-3", "Norcold N4000", "3", "Gas lockout. No flame in 30 seconds.", "LP, spark, burner, and pressure."),
	c("n4-4", "Norcold N4000", "4", "The 12 V heater is not working.", "Fuse, heater, or the board."),
	c("n4-5", "Norcold N4000", "5", "The 12 V heater is stuck on.", "Service."),
	c("n4-6", "Norcold N4000", "6", "12 V out of range, under 10 V or over 15 V.", "Supply, fuse, and solar."),
	c("n4-7", "Norcold N4000", "7", "No engine-running signal in manual 12 V mode.", "The D+ wire."),
	c("n4-8", "Norcold N4000", "8", "AC heater current far too low.", "Heater, fuse, or the board."),
	c("n4-9", "Norcold N4000", "9", "AC heater stuck on.", "Service."),
	c("n4-10", "Norcold N4000", "10", "AC voltage out of range.", "About 108–132 V at the source."),
	c("n4-11", "Norcold N4000", "11", "No energy source in auto.", "Restore AC, 12 V, or gas."),
	c("n4-12", "Norcold N4000", "12", "The boards are not communicating.", "12 V, the resettable fuse, and the cable."),
	c("n4-13", "Norcold N4000", "13", "Thermistor failure.", "It runs on a backup timer. Replace the sensor."),
	c("ee-ccc", "Dometic 5-button CCC", "EE", "The old 5-button thermostat cannot talk to the roof board. Forum reports only. Not a CCC2 code.", "Reseat the phone cable. FF on the screen is the reset display, not a fault."),
	c("vs-h1", "Coleman VS-18", "H1", "The drive board did not hear the thermostat. A sub-code of E9.", "Same wiring checks as E9. Not a Mach 8."),
	c("vs-h2", "Coleman VS-18", "H2", "The thermostat did not hear the drive board.", "Same checks as E9."),
	c("vs-ea", "Coleman VS-18", "EA", "Discharge sensor reads colder than the outdoor coil.", "The sensor, the clip, or the drive board. Service."),
	c("vs-00", "Coleman VS-18", "00", "No stored code.", "Hold Turbo about 5 seconds. 00 means the memory is empty."),
	c("vs-d2", "Coleman VS-18", "d2", "Compressor drive board fault.", "Service."),
	c("vs-d3", "Coleman VS-18", "d3", "Compressor rotor locked.", "Service."),
	c("vs-d4", "Coleman VS-18", "d4", "Compressor current over 30 A.", "Service."),
	c("vs-d5", "Coleman VS-18", "d5", "A compressor phase is missing.", "Wiring. Service."),
	c("vs-d6", "Coleman VS-18", "d6", "Compressor current sensing fault.", "The drive board."),
	c("vs-d7", "Coleman VS-18", "d7", "DC bus voltage too high.", "The drive board."),
	c("vs-d8", "Coleman VS-18", "d8", "DC bus voltage too low.", "Service."),
	c("vs-d9", "Coleman VS-18", "d9", "AC input current over 90 A.", "Service."),
	c("vs-da", "Coleman VS-18", "dA", "Drive temperature sensor fault.", "The drive board."),
	c("vs-db", "Coleman VS-18", "dB", "Drive overheated, above 248 °F.", "It recovers near 176 °F. Service if it returns."),
	c("vs-dc", "Coleman VS-18", "dC", "Outdoor coil over 145 °F.", "Clear the condenser. If the fan is not running, service."),
	c("hf-e01", "Xantrex Freedom HF", "E01", "Inverter stopped. Battery under 10.5 V.", "Charge the bank. Check cable size and tight connections. Not a Progressive Industries EMS code, and not a PD1600."),
	c("hf-e02", "Xantrex Freedom HF", "E02", "Inverter stopped. Battery over 15.5 V.", "The charger or the alternator is too high."),
	c("hf-e03", "Xantrex Freedom HF", "E03", "Inverter stopped. AC overload or a short.", "Shed the load."),
	c("hf-e04", "Xantrex Freedom HF", "E04", "Inverter stopped. Too hot.", "Clear the vents and let it cool."),
	c("hf-e05", "Xantrex Freedom HF", "E05", "Warning. Battery under 11.0 V, before it shuts down.", "Charge it before it becomes E01."),
	c("hf-e06", "Xantrex Freedom HF", "E06", "Warning. Close to an overload shutdown.", "About 100 W under the limit. Shed load."),
	c("hf-e07", "Xantrex Freedom HF", "E07", "Warning. Close to a temperature shutdown.", "Less load, more air."),
	c("hf-e10", "Xantrex Freedom HF", "E10", "While on shore power, battery over 15.5 V.", "Charging stops. Shore power can still pass through."),
	c("hf-e11", "Xantrex Freedom HF", "E11", "The AC transfer relay is too hot.", "Less shore load. Charging stops. Power can still pass through."),
	c("hf-e12", "Xantrex Freedom HF", "E12", "The battery did not rise, or a DC load is larger than the charger.", "Charging stops and shore power does not pass through. AC off, then the inverter button."),
	c("fx-e01", "Xantrex Freedom X", "E01", "Low battery. Shutdown is close. Threshold depends on the LBCO setting.", "Not the Freedom HF table. A 12 V model and a 24 V model do not share the high-voltage number."),
	c("fx-e02", "Xantrex Freedom X", "E02", "Battery too high. Over 18 V on a 12 V model, over 32 V on a 24 V model.", "Disconnect the charging source."),
	c("fx-e03", "Xantrex Freedom X", "E03", "AC overload shutdown.", "Shed the load."),
	c("fx-e04", "Xantrex Freedom X", "E04", "Over-temperature shutdown.", "Clear the grille and let it cool."),
	c("fx-e06", "Xantrex Freedom X", "E06", "Overload warning.", "Shed load before it shuts down. E05 is not in the current table."),
	c("fx-e07", "Xantrex Freedom X", "E07", "Too hot, or the fan is locked.", "Clear the fan. Less load."),
	c("fx-e08", "Xantrex Freedom X", "E08", "Fan locked while shore power is passing through.", "Clear the fan. If it is free, disconnect DC and AC and start again."),
	c("ma-zone", "Micro-Air EasyTouch", "NO ZONE RESPONSE", "The thermostat lost the control board. Aftermarket replacement, not factory.", "The manual states no owner fix. Recheck the wires and run Reset All."),
	c("ma-ctrl", "Micro-Air EasyTouch", "NO CONTROL RESPONSE", "Listed in the table. The opened manual does not describe it.", "Recheck the wires."),
	c("ma-out", "Micro-Air EasyTouch", "BAD OUTSIDE SENSOR", "Outside-air sensor out of range.", "Service."),
	c("ma-frz", "Micro-Air EasyTouch", "BAD FREEZE SENSOR", "Freeze sensor out of range.", "Service."),
	c("ma-ice", "Micro-Air EasyTouch", "FREEZE DETECTED", "The indoor coil is freezing.", "The compressor stays off until the coil sensor reaches about 54 °F. The fan keeps running."),
	c("ma-hum", "Micro-Air EasyTouch", "BAD HUMID SENSOR", "Humidity sensor out of range.", "Service."),
	c("ma-ac", "Micro-Air EasyTouch", "NO AC POWER", "The board sees no 120 V.", "Shore power or the generator."),
	c("ma-cfg", "Micro-Air EasyTouch", "INVALID CONFIG", "The heat sources are not a valid pair.", "The configuration."),
	c("ma-dc", "Micro-Air EasyTouch", "LOW DC VOLTAGE", "12 V at the board is too low.", "Battery or the converter."),
	c("ma-room", "Micro-Air EasyTouch", "BAD INDOOR SENSOR", "The sensor inside the thermostat failed.", "Repair the thermostat, or fit the remote sensor."),
	c("ma-hp", "Micro-Air EasyTouch", "HP OVER TEMP", "Heat-pump coil too hot. Usually airflow.", "The filter and the coil."),
	c("ma-ref", "Micro-Air EasyTouch", "LOW REFRIGERANT", "The coil temperatures are too close together.", "A refrigerant leak. Service."),
	c("cz-mbi", "CZone", "Device missing", "Forum only. The panel says the Dometic interface is missing.", "Owners reseat the module under the wardrobe. Not a CZone-published alarm list."),
	c("cz-batt", "CZone", "Battery disconnected", "Forum only. The panel says the batteries are disconnected even though loads still work.", "A dealer reconfiguration. Not a published code."),
	c("cz-shed", "CZone", "Load shed", "Forum only. Loads shed on a low 12 V reading.", "Owners found a loose 12 V feed at the switch. Not a published code."),
	c("cz-fuse", "CZone", "Blown fuse", "Forum only. A channel fuse. The button for that load flashes.", "The red LED next to the fuse marks it. The published 7-flash code is the same idea."),
	c("sl-ini", "SeeLevel II", "InI", "The display is starting. Not a fault.", "Wait at least 15 seconds."),
	c("tm-rapid", "TireMinder", "Rapid Leak", "Lost at least 3 psi in under 2 minutes.", "Stop if the drop is large. Owner-fitted, any year."),
	c("tm-slow", "TireMinder", "Slow Leak", "Lost at least 6 psi in 2 to 10 minutes.", "Find the leak before the next tow."),
	c("tm-lo", "TireMinder", "Low Pressure", "Down at least 15 percent from the baseline.", "If it is near 0, stop."),
	c("tm-hi", "TireMinder", "High Pressure", "Up at least 20 percent from the baseline.", "Stop and check the tire. The baseline may have been set too low."),
	c("tm-temp", "TireMinder", "High Temperature", "At or above about 167 °F. One Smart manual also lists 185 °F.", "A dragging brake or a hot bearing. Stop."),
	c("lp-angle", "Lippert Ground Control", "EXCESS ANGLE", "Beyond the level the system can fix, or the sensor moved. Retrofit only. Not a factory Airstream jack.", "Secure the sensor. A steep site has to be left."),
	c("lp-cal", "Lippert Ground Control", "BAD CALIBRATION", "The zero point is wrong.", "Set the zero point again."),
	c("lp-off", "Lippert Ground Control", "FEATURE DISABLED", "Hitch height or the zero point was never set.", "Run auto level once, and set zero."),
	c("lp-volt", "Lippert Ground Control", "LOW VOLTAGE", "The system voltage is low.", "Wiring, and the battery under load."),
	c("lp-stroke", "Lippert Ground Control", "OUT OF STROKE", "A jack ran out of travel.", "Secure the controller. Move to flatter ground."),
	c("lp-sensor", "Lippert Ground Control", "EXTERNAL SENSOR", "The rear sensor is bad or unplugged.", "The connector at that sensor."),
	c("lp-time", "Lippert Ground Control", "JACK TIME OUT", "It could not finish in time.", "An obstruction, a leak, the fluid, or voltage at the motor."),
	c("lp-fail", "Lippert Ground Control", "AUTO LEVEL FAILURE", "Auto level failed.", "Secure the controller. Test the battery under load."),
	c("lp-abort", "Lippert Ground Control", "FUNCTION ABORTED", "A button was pressed during auto level.", "Start the sequence again."),
	c("lp-short", "Lippert Ground Control", "HALL POWER SHORT", "A short on the jack sensor power.", "The harness."),
	c("lp-jack", "Lippert Ground Control", "Jack fault", "A named jack, including the tongue jack, lost its signal.", "Harness, fuses, then home the jacks and auto-retract. Not a Barker or a plain power tongue jack. Those have no codes."),
	c("ge-lo", "GE Profile", "Lo", "12 V under 10.5 V. The GE RARWT thermostat switches to OFF and flashes Lo. Not in an Airstream parts book.", "Charge the battery. When voltage is back, Lo stays on until you pick a mode again."),
	c("ge-freeze", "GE Profile", "Snowflake flashes", "Cool mode. The indoor coil is near freezing and the compressor is off.", "Clean the filter and open the vents."),
	c("ge-defrost", "GE Profile", "Heat-pump icon flashes", "The heat pump is defrosting. With furnace mode on, the furnace runs during defrost.", "Wait. This is not a lockout."),
	c("ge-lock", "GE Profile", "25°F", "Heat-pump-only mode. Outdoor temperature is under 25 °F and the heat pump is locked out.", "Use heat pump plus furnace, or furnace only, below 25 °F."),
	c("ge-hot", "GE Profile", "99°F", "Heat-pump mode. The indoor coil went over about 135 °F and the compressor stopped.", "Clean the filter and open the vents."),
	c("ge-f1", "GE Profile", "F1", "Indoor-coil sensor unplugged, or colder than about −22 °F.", "Reseat the sensor. All GE RV models in the RARWT table."),
	c("ge-f2", "GE Profile", "F2", "Indoor-coil sensor shorted, or hotter than about 149 °F.", "The sensor or its wires."),
	c("ge-f3", "GE Profile", "F3", "Outdoor-coil sensor unplugged or too cold. Heat-pump models.", "Reseat that sensor. An air-only unit does not use F3."),
	c("ge-f4", "GE Profile", "F4", "Outdoor-coil sensor shorted or too hot. Heat-pump models.", "The sensor or its wires."),
	c("ge-f5", "GE Profile", "F5", "Outdoor-temperature sensor unplugged or too cold. Also if dip switch 1 is ON on an air-only model.", "The sensor, or that switch."),
	c("ge-f6", "GE Profile", "F6", "Outdoor-temperature sensor shorted or too hot.", "The sensor or its wires."),
	c("ge-f7", "GE Profile", "F7", "Room sensor unplugged or too cold.", "The sensor in the thermostat."),
	c("ge-f8", "GE Profile", "F8", "Room sensor shorted or too hot.", "The sensor in the thermostat."),
	c("ge-f9", "GE Profile", "F9", "The signal wire to the roof is unplugged or shorted. The same fault can show as FC or a dash.", "The cable between the thermostat and the roof unit. Do not use CCC2 or VS-18 numbers on this stat."),
	c("fog-e0", "Fogatti", "E0", "Outlet temperature probe open or shorted. Fogatti’s own InstaShower list, not an Airstream parts book.", "Check the outlet probe. Read the model. E7 through E9 change by model."),
	c("fog-e1", "Fogatti", "E1", "Ignition failure, no ignition, or flame lost while running.", "LP supply and pressure, about 11 in. water column. Purge air at the stove, then reset. Do not use Girard or Suburban meanings."),
	c("fog-e2", "Fogatti", "E2", "Flame sensed before ignition.", "Power off, wait a minute, then on. Service if it returns."),
	c("fog-e3", "Fogatti", "E3", "Thermostat or over-temperature protection.", "Let it cool. Check the temperature-control connection and water flow."),
	c("fog-e4", "Fogatti", "E4", "Inlet temperature probe open, shorted, or unplugged.", "Check the inlet probe. One InstaShower sheet says outlet in the repair line. Follow the probe the code names."),
	c("fog-e5", "Fogatti", "E5", "No fan signal during start or while running.", "The fan, its plug, and a blocked vent."),
	c("fog-e6", "Fogatti", "E6", "Overheat. One sheet says outlet water stayed over 176 °F for 3 seconds.", "Low flow or scale. Do not keep resetting a hot heater."),
	c("fog-e7", "Fogatti", "E7", "Depends on the model. InstaShower 7, 8 Plus, and 8 Pro: valve circuit. 9 Pro and Ultra: solenoid valve.", "Read the data plate before you use this number. The portable InstaShower GO uses E7 for a different fault."),
	c("fog-e8", "Fogatti", "E8", "Depends on the model. 7 and 8 Pro: wind-pressure switch. 8 Plus: the same switch. 9 Pro and Ultra: fan speed.", "Read the plate. Do not mix these with a Girard E8."),
	c("fog-e9", "Fogatti", "E9", "Not on a 7 or an 8 Pro. 8 Plus: false flame. 9 Pro and Ultra: proportional valve.", "If the plate is a 7 or an 8 Pro, this number is not in that list."),
	c("nk-1", "Nova Kool", "1 flash", "Secop module battery cut-out. Only if a diagnostic LED is fitted on the compressor module. Not a Nova Kool display code, and not a Norcold letter.", "Voltage at the module. It restarts when voltage recovers. Count the flashes, then the pause. About every 4 seconds."),
	c("nk-2", "Nova Kool", "2 flashes", "Fan on the Secop module drawing too much current.", "The condenser fan. Confirm the module is Secop or Danfoss before you use this list."),
	c("nk-3", "Nova Kool", "3 flashes", "Motor will not start. Blocked rotor or pressure too high.", "Ventilation and a hot box. Service if it will not start once cool."),
	c("nk-4", "Nova Kool", "4 flashes", "Motor cannot hold minimum speed. System overloaded.", "Overpacked box, blocked vents, or a very hot day."),
	c("nk-5", "Nova Kool", "5 flashes", "The electronic module is too hot.", "Air around the module. The same five flashes are listed under 12 V fridge."),
	c("vit-1", "Vitrifrigo", "1 flash", "Secop module battery cut-out. The Vitrifrigo drawer manual lists this LED as optional, between + and D.", "Voltage at the module. Not a Norcold letter. No LED means this fridge cannot show a code."),
	c("vit-2", "Vitrifrigo", "2 flashes", "Fan over-current. The module manual says more than about 1 A from the fan output.", "The fan on that module."),
	c("vit-3", "Vitrifrigo", "3 flashes", "Motor start error. Blocked motor or pressure difference too high.", "Let it cool and retry. Service if it stays."),
	c("vit-4", "Vitrifrigo", "4 flashes", "Motor speed too low. The module manual says under about 1,850 rpm.", "Overload or a hot install."),
	c("vit-5", "Vitrifrigo", "5 flashes", "Electronic unit thermal stop.", "Airflow at the module. A 6-flash thermostat code is on some Secop modules and is listed under 12 V fridge, not in this drawer manual."),
	c("wfco-led", "WFCO", "Red LED", "A branch fuse is blown. The WF-8900 board lights a small red LED on that circuit. Not a numeric fault.", "Replace the fuse with the same rating. If it blows again, that circuit is shorted."),
	c("wfco-rev", "WFCO", "No 12 V", "Converter output is dead. The WF-8900 manual says check the reverse-polarity fuses first.", "A backward battery, even for a second, opens those fuses. If they are good and the output is still 0 V, the manual’s next step is service. That is a check, not a finding that every unit fails."),
	c("wf-e01", "WFCO", "E01", "WF-5110R inverter. Output voltage too high. A red LED is the fault. Green is shore pass-through. Amber is invert.", "Unplug shore power and test again. If it is still high, replace the inverter. This is not a PD1600 E-1."),
	c("wf-e04", "WFCO", "E04", "WF-5110R. Internal bus voltage low.", "Shore unplugged, inverter off, AC output wires off, then the DC negative off for about 10 minutes. If E04 stays, test the battery. If it clears and returns when the AC wires go back, the load circuit is the fault. If it stays after that, replace the inverter."),
	c("wf-e05", "WFCO", "E05", "WF-5110R. High temperature.", "Same 10-minute DC disconnect as E04, then try again. Give it air before you put the AC wires back."),
	c("wf-e07", "WFCO", "E07", "WF-5110R. High current.", "Same reset as E05. Find the heavy load."),
	c("wf-e08", "WFCO", "E08", "WF-5110R. Output short.", "Same reset as E05, after the short is out of the circuit."),
	c("wf-e09", "WFCO", "E09", "WF-5110R. Output overload.", "Same reset as E05. Shed load. E02, E03, and E06 are not in the 5110R page that was opened."),
	c("par-fuse", "Parallax", "Blown fuse", "No 12 V on one circuit. Parallax publishes no numeric codes. Reverse battery blows the main fuses on the distribution block.", "Replace with the same ATC rating. A larger fuse is not the fix. Not an EMS E-code."),
	c("par-dead", "Parallax", "No output", "The converter shut down. Over-current, a short, reverse polarity, or heat. It resets when the cause is gone.", "Shore cord live, 120 V breakers on, fuses good, and air around the converter. A fan that cycles is normal on many 4400 and 5300 units."),
	c("ff-fast", "Firefly", "Fast green", "The module is trying to join the network. About 4 flashes a second. Firefly’s own LED key, not a parts-book code.", "Give it a moment. Off means no power."),
	c("ff-slow", "Firefly", "Slow green", "It was online and has seen no message for about 5 seconds.", "The data cable and the power to that module."),
	c("ff-green", "Firefly", "Solid green", "Online and talking. This is the healthy state.", "Leave it."),
	c("ff-red", "Firefly", "Solid red", "Offline. Not on the network.", "Power and the network plug. CZone codes do not apply."),
	c("ff-ro", "Firefly", "Red and orange", "Offline and trying to reconnect.", "The cable. If it never goes solid green, that module is down."),
	c("ff-go", "Firefly", "Green and orange", "Online, but it has dropped off more than once.", "A loose plug or a weak 12 V feed."),
	c("ff-blue", "Firefly", "Blue or purple", "Mira and Eclipse only. A blue or purple LED means the file on that module is bad.", "Update the config from the Firefly app. A solid green module does not need that."),
	c("har-screen", "Harbinger", "Screen alarm", "A 2027 Trade Wind 27FB uses the Harbinger APS. The manual says that touchscreen has its own alarms. The alarm words were not in the extract, so none are invented here.", "Read the words on that screen. Do not use Victron VE.Bus numbers, and do not use a Renogy or Wakespeed list."),
	c("mach-none", "Coleman-Mach", "No code", "Mach 8, Mach 8 Plus, Mach 8 Signature, and Polar Cub publish no E-code list. Checked again outside the parts books.", "Do not use Coleman VS-18 numbers, and do not use the 9420 network-thermostat lights, on a Mach 8."),
	c("mach-filter", "Coleman-Mach", "No cool", "Not a code. The compressor is off or the coil is icing, and a Mach 8 will not tell you with a number.", "Clean the filter, open every vent, and check the roof breaker. A thermostat that is dark is 12 V or the cable, not an E-code."),
	c("alde-ext", "Alde 3030", "Connection fail ext", "The panel lost a third-party controller, such as Smart Control or a CI master. 3010 and 3020 wording.", "Check that cable. The manual gives no further owner fix."),
	c("alde-redc", "Alde 3030", "Red connection fail", "No communication on the red cable. 3020 only.", "The opened manual does not add a reset beyond the fault text."),
	c("alde-yel", "Alde 3030", "Yellow connection fail", "The cable between the Alde panel and the CI master panel. 3020 only.", "The opened manual does not add a reset beyond the fault text."),
	c("alde-nomatch", "Alde 3030", "No match Heater/Panel", "The panel and the boiler board are not a pair. 3020.", "A 3020 panel is 3020-013 on an A-series boiler and 3020-113 on an HE. Check the part number."),
	c("alde-dongle", "Alde 3030", "Opt. dongle not found", "An option card the panel already knew about is missing. 3030 only.", "Plug it back in, or uninstall the accessory. Cycle 12 V with the card in place."),
	c("tank-atwood", "Suburban tank", "Atwood DSI", "Fault light on an Atwood or Dometic tank heater. No E-number.", "The retrieved Dometic manual does not state a reset. Do not use the Suburban 5-second reset, and do not use ST-65 E-codes."),
	c("ems-dark", "Progressive Industries EMS", "Display dark", "Open neutral. The display stays dark and power does not pass.", "Move to a different pedestal. This is not a dead EMS by itself."),
	c("gx-92", "Cerbo GX", "WS500 92", "The alternator regulator turned charging off because the BMS opened the charge path.", "It follows the battery. Only if a WS500 is fitted."),
	c("cz-low", "CZone", "Power LED red", "House voltage under about 12 V. Published LED, not a forum alarm text.", "Check the battery and the converter before you chase a module."),
	c("ma-open", "Micro-Air EasyTouch", "OPEN FREEZE SENSOR", "The freeze sensor reads open. On a 356 it also reads open whenever 120 V is gone, or the rear fuse is blown. Aftermarket.", "Check the two gray wires and the rear fuse. Service if the coil is frozen."),
	c("ma-badroom", "Micro-Air EasyTouch", "BAD ROOM SENSOR", "The room sensor on the control board is out of range. Aftermarket.", "Not the sensor inside the thermostat. That one is BAD INDOOR SENSOR."),
	c("ma-incoil", "Micro-Air EasyTouch", "INSIDE COIL SENSOR", "The inside-coil sensor on the control board is out of range. Aftermarket.", "Service."),
	c("ma-outcoil", "Micro-Air EasyTouch", "OUTDOOR COIL SENSOR", "The outdoor-coil sensor on the control board is out of range. Aftermarket.", "Service."),
	c("tst-batt", "TST TPMS", "Sensor battery", "A battery symbol and a flashing tire. The sensor battery is low.", "Replace it. A cap sensor is often a CR2032. The warning can be brief."),
	c("tst-loss", "TST TPMS", "No reading", "That tire position dropped off. Not a named pressure code.", "An aluminum shell blocks the signal. Power the repeater. Unscrew the sensor, count to 10, and put it back."),
	c("tm-185", "TireMinder", "High Temperature 185", "The Smart manual also lists about 185 °F, above the 167 °F warning.", "Same stop as the 167 °F warning. Do not treat it as a different fault."),
	c("tm-search", "TireMinder", "No reading", "Auto-Search got nothing from a transmitter in 20 minutes. Smart manual.", "Run Auto-Search again. Check the transmitter and the booster."),
	c("lp-ex2", "Lippert Ground Control", "EXCESSIVE ANGLE", "Too steep during a manual move. Retrofit only.", "Move the trailer. Not the same screen as EXCESS ANGLE."),
	c("lp-steep", "Lippert Ground Control", "Can't complete level", "The front is already fully up and the site is too steep.", "Move to flatter ground."),
	c("nk-fast", "Norcold 12 V fridge", "Blue fast", "Thermistor connection. N15 and N20 units that blink the blue ON light instead of showing E.", "The sensor plug and the wiring. Not an N8 or N10 front-panel E-code."),
	c("nk-slow", "Norcold 12 V fridge", "Blue slow", "Input voltage low, or AC ripple on 12 V. N15 and N20 without an E display.", "Battery, wiring, and the converter."),
	c("rua-w24", "Dometic RUA", "W24", "Display grounding. Later EU and AU editions. US fitment was not confirmed.", "Service. No owner fix in the manual."),
	c("fx-hw", "Xantrex Freedom X", "E10–E19", "Internal hardware fault, in battery mode or on shore power. Rev G lists the group, not a meaning for each number.", "If it stays, call Xantrex. Do not invent a separate meaning for E10 or E12 on this model. Those numbers mean something else on a Freedom HF."),
	c("aq-w27", "Truma AquaGo", "W 27 W", "CP plus display for code 27. The circulation pump is running dry.", "Fill and bleed the loop. Off, wait 5 seconds, on."),
	c("aq-w28", "Truma AquaGo", "W 28 W", "CP plus display for low gas pressure. The blink pattern was not in the page that was opened.", "Check the LP supply. Off, wait 5 seconds, on."),
	c("aq-w29", "Truma AquaGo", "W 29 W", "CP plus display for too much hot water demanded. A warning, not a lockout.", "Close a second tap."),
	c("aq-w30", "Truma AquaGo", "W 30 W", "CP plus freeze warning. The sheet prints 27 °F and 3 °C, and those two numbers do not agree.", "Treat it as a freeze warning and confirm on your unit."),
	c("aq-w31", "Truma AquaGo", "W 31 W", "CP plus display for decalcification finished.", "Not a failure. Return the control to Eco or Comfort."),
	c("aq-w32", "Truma AquaGo", "W 32 W", "CP plus display for antifreeze-kit current too low. The blink pattern was not verified.", "Check the kit wiring. Off, wait 5 seconds, on."),
	c("aq-w33", "Truma AquaGo", "W 33 W", "CP plus display for antifreeze-kit current too high. The blink pattern was not verified.", "Do not keep resetting a short. Check the kit wiring."),
	c("mp-olpre", "Victron MultiPlus", "Overload blinks", "Pre-alarm. The load is over the nominal rating. The inverter is still on.", "Shed load before it shuts down. A steady overload light is the shutdown, not this blink."),
	c("mp-lbpre", "Victron MultiPlus", "Low battery blinks", "Pre-alarm. The battery is nearly empty. The inverter is still on.", "Charge it. A steady low-battery light is the shutdown."),
	c("mp-hotpre", "Victron MultiPlus", "Temperature blinks", "Pre-alarm. The inverter is getting hot.", "More air, less load."),
	c("mp-hot", "Victron MultiPlus", "Temperature on", "Temperature alarm. The inverter switched off.", "Let it cool. Clear the vents."),
	c("mp-alt", "Victron MultiPlus", "Overload and low battery alternate", "Pre-alarm. The battery is low and the load is high at the same time.", "Charge, and shed load. Alternating is not the ripple alarm."),
	c("mp-rippre", "Victron MultiPlus", "Overload and low battery blink together", "Ripple pre-alarm. DC ripple is high. The inverter is still on.", "Cables, connections, and battery size. Both lights steady is the shutdown."),
	c("mp-ac2", "Victron MultiPlus", "No AC-out-2", "AC-out-2 is dead, or it will not switch to shore or the generator.", "The AC-in breaker or fuse opened. Clear the short, then reset it."),
	c("mp-start", "Victron MultiPlus", "Will not start", "The switch is on and the inverter does not start.", "Battery voltage is far too high, far too low, or the DC cables are open.")
];
function compactCode(s) {
	return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}
/** E1, E-1, and "E 1" match the same code. E1 does not match E10. */
function faultCodeMatches(c, q) {
	const s = q.trim().toLowerCase();
	if (!s) return true;
	const blob = `${c.code} ${c.appliance} ${c.meaning} ${c.fix} ${c.source ?? ""}`;
	const code = compactCode(c.code);
	const key = compactCode(s);
	if (key.length >= 2 && (key === code || key.replace(/s$/, "") === code || key === code.replace(/s$/, ""))) return true;
	const bits = s.split(/\s+/).map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "")).filter((w) => w.length > 0);
	const usable = bits.filter((w) => w.length >= 2 || /\d/.test(w) && bits.some((other) => other.length >= 2));
	if (!usable.length) return false;
	if (usable.some((w) => compactCode(w) === code)) return usable.every((w) => compactCode(w) === code || textHasWords(blob, [w]));
	return textHasWords(blob, usable);
}
function faultCodeExact(c, q) {
	const code = compactCode(c.code);
	if (code.length < 2) return false;
	const key = compactCode(q);
	if (key === code || key.replace(/s$/, "") === code) return true;
	return q.trim().toLowerCase().split(/\s+/).some((w) => compactCode(w) === code);
}
/** Lower sorts first. A code that is the whole query beats one that only shares a word. */
function faultCodeRank(c, q, onCoach = true) {
	const query = compactCode(q);
	const code = compactCode(c.code);
	return (query.length >= 2 && query === code ? 0 : faultCodeExact(c, q) ? 1 : 2) * 2 + (onCoach ? 0 : 1);
}
/** Forum wording, not a code from the maker’s sheet. */
function ownerReportedCode(c) {
	return /forum only|forum reports only/i.test(`${c.meaning} ${c.fix}`);
}
function symptomForCode(c) {
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
var appliances = [
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
	"Progressive Dynamics"
];
var faultCodes = [
	{
		id: "st-e0",
		appliance: "Suburban ST-65RL",
		code: "E0",
		meaning: "Outlet temperature probe open or shorted.",
		fix: "All ST codes lock out. Cycle 12 V, or turn the hot faucet off and on. If it returns, call for service."
	},
	{
		id: "st-e1",
		appliance: "Suburban ST-65RL",
		code: "E1",
		meaning: "Ignition failure. No flame after 3 tries.",
		fix: "Check LP supply and pressure, then the electrode and flame probe."
	},
	{
		id: "st-e2",
		appliance: "Suburban ST-65RL",
		code: "E2",
		meaning: "False fire. Flame sensed before start.",
		fix: "Lockout. Cycle power. If it returns, service."
	},
	{
		id: "st-e3",
		appliance: "Suburban ST-65RL",
		code: "E3",
		meaning: "High limit open.",
		fix: "Let it cool. Look for a blocked vent and scale. Reset only after it has cooled."
	},
	{
		id: "st-e4",
		appliance: "Suburban ST-65RL",
		code: "E4",
		meaning: "Inlet temperature sensor open or shorted.",
		fix: "Cycle 12 V. A returning code is a service item."
	},
	{
		id: "st-e5",
		appliance: "Suburban ST-65RL",
		code: "E5",
		meaning: "Fan failure. No speed signal.",
		fix: "Check that the intake is clear, then the blower. Service if it repeats."
	},
	{
		id: "st-e6",
		appliance: "Suburban ST-65RL",
		code: "E6",
		meaning: "Outlet water over-temperature.",
		fix: "Scale, low flow, or a failed sensor. Descale with kit 521163 if flow has been falling off."
	},
	{
		id: "st-e7",
		appliance: "Suburban ST-65RL",
		code: "E7",
		meaning: "Gas valve wire open or short.",
		fix: "Service. Do not bypass the valve."
	},
	{
		id: "st-e8",
		appliance: "Suburban ST-65RL",
		code: "E8",
		meaning: "Pressure switch failed or disconnected.",
		fix: "Intake and vent path first, then the switch. Service if the path is clear."
	},
	{
		id: "st-e9",
		appliance: "Suburban ST-65RL",
		code: "E9",
		meaning: "Recirculation failure. Air in the loop. Pump will not prime.",
		fix: "Bleed the loop. Confirm the winterize valves are not open."
	},
	{
		id: "st-en",
		appliance: "Suburban ST-65RL",
		code: "En",
		meaning: "Timeout. Ran more than 20 minutes continuously.",
		fix: "Normal protection. Cycle the faucet. A shower pause button can also make it hunt."
	},
	{
		id: "st-ec",
		appliance: "Suburban ST-65RL",
		code: "EC",
		meaning: "Communication failure with the controller.",
		fix: "Check the harness to the panel. Cycle 12 V."
	},
	{
		id: "iw-e1",
		appliance: "Suburban IW60",
		code: "E1",
		meaning: "Ignition fault. No flame after 2 tries. Locked.",
		fix: "LP at 11–14 in. water column. Cycle power or the hot faucet. The 2025 GT book lists the ST-65RL, not the IW60 — confirm the heater label."
	},
	{
		id: "iw-e2",
		appliance: "Suburban IW60",
		code: "E2",
		meaning: "Flame lost while running. Locked.",
		fix: "Supply problem or a dirty flame sensor path. Cycle power."
	},
	{
		id: "iw-e3",
		appliance: "Suburban IW60",
		code: "E3",
		meaning: "False fire. Flame sensed before start. Locked.",
		fix: "Service if it returns after a power cycle."
	},
	{
		id: "iw-e4",
		appliance: "Suburban IW60",
		code: "E4",
		meaning: "Water overheating. NTC over 90 °C. Locked.",
		fix: "Low flow or scale. Do not keep resetting a hot heater."
	},
	{
		id: "iw-e5",
		appliance: "Suburban IW60",
		code: "E5",
		meaning: "Hi-limit switch. Locked. Not the ST-65 fan code.",
		fix: "Cool it. Check the vent. Service if the switch will not reset. Do not use the ST-65 E5 meaning on an IW60."
	},
	{
		id: "iw-e6",
		appliance: "Suburban IW60",
		code: "E6",
		meaning: "Air-pressure switch or fan abnormal. Locked.",
		fix: "Clear the intake and exhaust."
	},
	{
		id: "iw-e7",
		appliance: "Suburban IW60",
		code: "E7",
		meaning: "Inlet-water NTC open or short. Automatic recovery.",
		fix: "Often clears. If it repeats, the sensor or the board."
	},
	{
		id: "iw-e9",
		appliance: "Suburban IW60",
		code: "E9",
		meaning: "Outlet-water NTC open or short. Automatic recovery.",
		fix: "Same as E7, on the outlet sensor."
	},
	{
		id: "iw-ec",
		appliance: "Suburban IW60",
		code: "EC",
		meaning: "Line-controller communication failure. Automatic recovery.",
		fix: "Reseat the controller harness."
	},
	{
		id: "iw-e8",
		appliance: "Suburban IW60",
		code: "E8",
		meaning: "On-demand table: replace the module board.",
		fix: "This one is a service replacement, not an owner reset."
	},
	{
		id: "fur-0",
		appliance: "Dometic furnace",
		code: "Steady",
		meaning: "Internal control-board fault. Hard lockout.",
		fix: "Cycle the thermostat or the furnace power switch. If it stays on solid, the manual treats that as a board fault. Gas work is for a tech."
	},
	{
		id: "fur-1",
		appliance: "Dometic furnace",
		code: "1 flash",
		meaning: "Limit switch or airflow. Soft lockout. 3 second pause.",
		fix: "Return air blocked, or the sail switch did not close. Insects in the exterior vent."
	},
	{
		id: "fur-2",
		appliance: "Dometic furnace",
		code: "2 flashes",
		meaning: "Flame sense. Hard lockout.",
		fix: "LP supply, collapsed pigtail, or the flame sensor. About 11 in. water column."
	},
	{
		id: "fur-3",
		appliance: "Dometic furnace",
		code: "3 flashes",
		meaning: "Ignition lockout. Soft. Retries after 1 hour.",
		fix: "Three ignition attempts failed. Check LP and the igniter gap before you wait out the hour."
	},
	{
		id: "fur-4",
		appliance: "Dometic furnace",
		code: "4 flashes",
		meaning: "High voltage, about 16–17 V. Soft. Current DF manual only.",
		fix: "An older DF board does not have this code. Read the decal on the board. A converter or a booster dumping high voltage. Fix the charge source.",
		source: "Current Dometic DF manual. Not on an older board."
	},
	{
		id: "fur-5",
		appliance: "Dometic furnace",
		code: "5 flashes",
		meaning: "Low voltage, about 8–9 V. Soft. Current DF manual only.",
		fix: "An older DF board does not have this code. Read the decal. Battery, connections, or a converter that is not charging.",
		source: "Current Dometic DF manual. Not on an older board."
	},
	{
		id: "alde-conn",
		appliance: "Alde 3030",
		code: "Connector failure",
		meaning: "The panel cannot see the boiler.",
		fix: "Check the red cable and the connectors, including the boiler’s black connector."
	},
	{
		id: "alde-nf",
		appliance: "Alde 3030",
		code: "Heater not found",
		meaning: "No communication, or a software mismatch.",
		fix: "Dealer or an Alde service partner. Not a fuse you should guess at."
	},
	{
		id: "alde-ohg",
		appliance: "Alde 3030",
		code: "Overheat glycol",
		meaning: "Air in the system, or the circulation pump failed.",
		fix: "Bleed. Expansion tank at least 1 cm above MIN when cold. Reset once the glycol is under 50 °C by cycling 12 V to the boiler."
	},
	{
		id: "alde-ohl",
		appliance: "Alde 3030",
		code: "Overheat lockout",
		meaning: "The boiler has already overheated.",
		fix: "Cycle 12 V to the boiler after it cools."
	},
	{
		id: "alde-pcb",
		appliance: "Alde 3030",
		code: "Overheat PCB",
		meaning: "Boiler or compartment too hot.",
		fix: "Let it cool, cycle 12 V. If it returns, Alde service."
	},
	{
		id: "alde-fail",
		appliance: "Alde 3030",
		code: "Heater failure",
		meaning: "Circuit board damaged.",
		fix: "Cycle 12 V. If it persists, service partner."
	},
	{
		id: "alde-v",
		appliance: "Alde 3030",
		code: "Low battery",
		meaning: "Boiler stops below 10.8 V and restarts at 11 V.",
		fix: "Other messages during this are often just the low voltage. Charge first, then re-read the panel."
	},
	{
		id: "alde-gas",
		appliance: "Alde 3030",
		code: "Gas failure",
		meaning: "No ignition on gas.",
		fix: "LP on, propane not butane below 50 °F, 12 V fuse good and above 11 V, both exhaust hoses clear. Cycle 12 V and re-enable gas. Light every stove burner — if flames shrink, the supply is the problem.",
		source: "Alde 3030, gas-failure message."
	},
	{
		id: "alde-fan",
		appliance: "Alde 3030",
		code: "Fan failure",
		meaning: "Combustion fan.",
		fix: "After repeated fan restarts, this is a service partner job."
	},
	{
		id: "alde-fan-ok",
		appliance: "Alde 3030",
		code: "Fan restarts",
		meaning: "The fan missed speed and the boiler is trying again. Not a fault by itself.",
		fix: "Wait. Fan failure after several restarts is the fault."
	},
	{
		id: "alde-load",
		appliance: "Alde 3030",
		code: "Load monitor not found",
		meaning: "A load monitor the panel already knew about is unplugged or dead.",
		fix: "Plug it back in. If it is plugged in and the message stays, that is an Alde partner job."
	},
	{
		id: "alde-win",
		appliance: "Alde 3030",
		code: "Window open",
		meaning: "A window switch near the flue is open. Gas stops. Electric can still run.",
		fix: "Close the window. If it is already closed, check the switch and the wiring."
	},
	{
		id: "alde-panel",
		appliance: "Alde 3030",
		code: "Panel failure",
		meaning: "Moisture in the panel.",
		fix: "Dry the panel. Do not keep powering a wet one."
	},
	{
		id: "alde-zone",
		appliance: "Alde 3030",
		code: "Zone / sensor error",
		meaning: "Zone, hot-water, or outdoor sensor open.",
		fix: "A removed outdoor sensor can be dismissed on the panel. Any other sensor: dealer."
	},
	{
		id: "alde-alt",
		appliance: "Alde 3030",
		code: "Full gas power unavailable",
		meaning: "The fan cannot reach full-gas speed.",
		fix: "Normal if High Altitude Mode is on. Otherwise contact Alde."
	},
	{
		id: "alde-ci",
		appliance: "Alde 3030",
		code: "CI-bus / remote",
		meaning: "CI-bus, iNet, or remote-control error.",
		fix: "Check the yellow connector and the vehicle master panel. Check the iNet box. If you removed a remote that was on JP3, uninstall it on the panel."
	},
	{
		id: "alde-bac",
		appliance: "Alde 3030",
		code: "Anti-bacteria",
		meaning: "The tank never got hot enough.",
		fix: "It retries within 24 hours. Raise power (3 kW and gas)."
	},
	{
		id: "pd-e1",
		appliance: "PD1600 inverter",
		code: "E-1",
		meaning: "Low battery. Under 10.5 V for several seconds. This is the PD1600 inverter, not a shore protector.",
		fix: "Auto-restart at 12.0 V. Recharge. If it cycles on and off, the batteries are tired or the DC cables are loose or undersized. The same E-1 on a Progressive Industries EMS means reverse polarity. Read the label.",
		source: "PD1600 inverter. The same number on a Progressive Industries EMS is a different fault. Read the label."
	},
	{
		id: "pd-e2",
		appliance: "PD1600 inverter",
		code: "E-2",
		meaning: "High battery. Over 15.5 V.",
		fix: "Auto-clears below 15.0 V. Check the charge source. Do not ignore a lithium being overcharged. On an EMS, E-2 is an open ground."
	},
	{
		id: "pd-e3",
		appliance: "PD1600 inverter",
		code: "E-3",
		meaning: "AC output overload.",
		fix: "Manual restart: press the power button. Shed loads. A brief buzz (under 2 seconds) when the fridge starts is normal. On an EMS, E-3 is line voltage over 132 V."
	},
	{
		id: "pd-e4",
		appliance: "PD1600 inverter",
		code: "E-4",
		meaning: "Over-temperature.",
		fix: "Auto-clears when cool. Clear the airflow around the inverter. On an EMS, E-4 is line voltage under 104 V."
	},
	{
		id: "pd-e5",
		appliance: "PD1600 inverter",
		code: "E-5",
		meaning: "Internal error.",
		fix: "Manual restart. Check the remote harness. No user-serviceable parts inside. On a 50 A EMS, E-5 is the second line over 132 V."
	},
	{
		id: "pd-e6",
		appliance: "PD1600 inverter",
		code: "E-6",
		meaning: "AC output short circuit.",
		fix: "Manual restart after you find the short. Check output wiring. On a 50 A EMS, E-6 is the second line under 104 V."
	},
	{
		id: "pd-e7",
		appliance: "PD1600 inverter",
		code: "E-7",
		meaning: "DC voltage failure while running.",
		fix: "Manual restart. Check DC cable size, length, and connections. Hold the remote power button about 5 seconds to turn it off. On an EMS, E-7 is line frequency over 69 Hz."
	},
	{
		id: "sec-1",
		appliance: "12 V fridge",
		code: "1 flash",
		meaning: "Battery-protection cut-out. Voltage outside limits.",
		fix: "Secop/Danfoss BD units only — confirm the LED on your controller. Flashes repeat about every 4 seconds. Charge the battery.",
		source: "Secop/Danfoss BD controller. Confirm the LED on the unit."
	},
	{
		id: "sec-2",
		appliance: "12 V fridge",
		code: "2 flashes",
		meaning: "Fan over-current, or too many start attempts.",
		fix: "Condenser fan, or the compressor is being asked to restart too often."
	},
	{
		id: "sec-3",
		appliance: "12 V fridge",
		code: "3 flashes",
		meaning: "Motor start error. Blocked rotor or high pressure.",
		fix: "Ventilation and a hot install. Service if it will not start once cool."
	},
	{
		id: "sec-4",
		appliance: "12 V fridge",
		code: "4 flashes",
		meaning: "Minimum-speed error. System overloaded.",
		fix: "Overpacked box, blocked vents, or a very hot day."
	},
	{
		id: "sec-5",
		appliance: "12 V fridge",
		code: "5 flashes",
		meaning: "Electronic unit thermal cut-out.",
		fix: "The controller itself is hot. Improve ventilation behind the fridge."
	},
	{
		id: "sec-6",
		appliance: "12 V fridge",
		code: "6 flashes",
		meaning: "Thermostat (NTC) failure.",
		fix: "Sensor unplugged or failed."
	},
	{
		id: "col-g",
		appliance: "Coleman thermostat",
		code: "Solid green",
		meaning: "Connected and communicating.",
		fix: "9420-330 on 2025 Globetrotter (PN 690829). This is the healthy state."
	},
	{
		id: "col-off",
		appliance: "Coleman thermostat",
		code: "Off",
		meaning: "No power, or the thermostat failed.",
		fix: "Breaker, 12 V, and the cable to the roof before you condemn the stat."
	},
	{
		id: "col-r",
		appliance: "Coleman thermostat",
		code: "Solid red",
		meaning: "Offline.",
		fix: "Reseat the RJ11 at the roof boards. TSB 201 adds a terminating resistor on a narrow 2025 Globetrotter serial range."
	},
	{
		id: "col-fg",
		appliance: "Coleman thermostat",
		code: "Fast green",
		meaning: "Trying the first connection. About 4 flashes a second.",
		fix: "Give it a moment. If it never settles, check power and the network cable."
	},
	{
		id: "col-sg",
		appliance: "Coleman thermostat",
		code: "Slow green",
		meaning: "No valid network message for 5 seconds.",
		fix: "Cable, resistor, or a roof board that is not answering."
	},
	{
		id: "col-ro",
		appliance: "Coleman thermostat",
		code: "Red / orange",
		meaning: "Offline, reconnecting.",
		fix: "Same path as solid red. Do not keep resetting a GFCI to hide it."
	},
	{
		id: "col-go",
		appliance: "Coleman thermostat",
		code: "Green / orange",
		meaning: "Online, but it has dropped offline more than once.",
		fix: "Intermittent connection. Reseat plugs. Ask about bulletin 201 if your serial is in range."
	},
	{
		id: "sl-opn",
		appliance: "SeeLevel II",
		code: "OPn",
		meaning: "Open circuit between the display and the sender.",
		fix: "One tank: short the wires at that sender. Sht means that sender is bad or miswired. Still OPn means the wire to it is open. Every tank: short the wires at the display. No Sht means the display is bad. Sht there, then short at the senders: no Sht is open wiring, Sht is bad senders. Check the fuse first."
	},
	{
		id: "sl-sht",
		appliance: "SeeLevel II",
		code: "Sht",
		meaning: "The communications wire is shorted to ground.",
		fix: "Unplug the senders one at a time. If Sht stays with every sender unplugged, disconnect the sender wire at the display. If it is still Sht, the display is bad."
	},
	{
		id: "sl-err",
		appliance: "SeeLevel II",
		code: "Err",
		meaning: "Bad data. Newer displays say crc for this same fault.",
		fix: "Senders programmed alike, damaged wiring, or a bad sender. Use the word printed on your display."
	},
	{
		id: "sl-sta",
		appliance: "SeeLevel II",
		code: "StA",
		meaning: "Stacked senders are connected, but the display is set for one sender.",
		fix: "Reprogram the display, or change the senders."
	},
	{
		id: "sl-nbo",
		appliance: "SeeLevel II",
		code: "nbo",
		meaning: "No bottom sender.",
		fix: "The bottom sender is quiet, or a single sender was programmed as the top. A one-sender tank must not be a top sender."
	},
	{
		id: "sl-ntp",
		appliance: "SeeLevel II",
		code: "ntP",
		meaning: "No top sender.",
		fix: "Double-stack programming, and only the bottom sender is answering."
	},
	{
		id: "sl-cal",
		appliance: "SeeLevel II",
		code: "CAL",
		meaning: "The display memory has failed.",
		fix: "Replace the display. This is not a sender fault."
	},
	{
		id: "mppt-idle",
		appliance: "Victron SmartSolar",
		code: "Blue blinks",
		meaning: "Not charging. The panels are not making enough power to start.",
		fix: "Blue blinks about every 3 seconds. Shade, a loose plug, or a blown fuse. It starts only when panel voltage is about 5 V above the battery. A blink about every 4 seconds can also just mean a GX is talking to it."
	},
	{
		id: "mppt-bulk",
		appliance: "Victron SmartSolar",
		code: "Blue on",
		meaning: "Bulk charge.",
		fix: "Normal. Blue stays on while the battery is taking a heavy charge."
	},
	{
		id: "mppt-abs",
		appliance: "Victron SmartSolar",
		code: "Yellow on",
		meaning: "Absorption.",
		fix: "Normal. Yellow stays on. The lithium preset is about 14.2 V for 2 hours. Do not change factory settings on a coach that is still under warranty."
	},
	{
		id: "mppt-float",
		appliance: "Victron SmartSolar",
		code: "Green on",
		meaning: "Float.",
		fix: "Normal. The battery is full and the controller is holding it."
	},
	{
		id: "mppt-maneq",
		appliance: "Victron SmartSolar",
		code: "Blue and yellow alternate",
		meaning: "Manual equalisation.",
		fix: "Blue and yellow blink alternately. Never equalize lithium, gel, or AGM."
	},
	{
		id: "mppt-autoeq",
		appliance: "Victron SmartSolar",
		code: "Yellow and green on",
		meaning: "Automatic equalisation.",
		fix: "Yellow and green are both steady. Never equalize lithium, gel, or AGM."
	},
	{
		id: "mppt-hot",
		appliance: "Victron SmartSolar",
		code: "Green blinks",
		meaning: "Controller too hot.",
		fix: "Green blinks alone. Give it airflow. Do not mount it directly above the battery."
	},
	{
		id: "mppt-oc",
		appliance: "Victron SmartSolar",
		code: "Blue and green blink",
		meaning: "Over-current.",
		fix: "Blue and green both blink. Check the battery fuse: about 35–40 A on a 100/30, 55–70 A on a 100/50."
	},
	{
		id: "mppt-ov",
		appliance: "Victron SmartSolar",
		code: "Yellow and green blink",
		meaning: "Panel voltage too high.",
		fix: "Yellow and green both blink. Too many panels in series for this controller."
	},
	{
		id: "mppt-bms",
		appliance: "Victron SmartSolar",
		code: "Yellow blinks",
		meaning: "VE.Smart network or BMS problem.",
		fix: "Yellow blinks alone. Check the Bluetooth or VE.Smart link and the battery BMS. A 4-second blink can just be a GX sending data — that is not this fault."
	},
	{
		id: "mppt-int",
		appliance: "Victron SmartSolar",
		code: "Blue and yellow blink",
		meaning: "Internal error.",
		fix: "Blue and yellow both blink together, not alternately. Power-cycle. If it returns, that is a Victron service item."
	},
	{
		id: "mppt-e1",
		appliance: "Victron SmartSolar",
		code: "Err 1",
		meaning: "Battery temperature too high.",
		fix: "Clears when the battery cools."
	},
	{
		id: "mppt-e2",
		appliance: "Victron SmartSolar",
		code: "Err 2",
		meaning: "Battery voltage too high.",
		fix: "Clears on its own. Check the other chargers and the battery-voltage setting."
	},
	{
		id: "mppt-e17",
		appliance: "Victron SmartSolar",
		code: "Err 17",
		meaning: "The charger is still too hot after it has already cut back.",
		fix: "Clears when it cools. Give it airflow."
	},
	{
		id: "mppt-e18",
		appliance: "Victron SmartSolar",
		code: "Err 18",
		meaning: "Charger over-current.",
		fix: "Usually clears. If it stays, disconnect all power for 3 minutes."
	},
	{
		id: "mppt-e20",
		appliance: "Victron SmartSolar",
		code: "Err 20",
		meaning: "Bulk ran longer than the limit.",
		fix: "Update the firmware, then factory-reset and set it up again."
	},
	{
		id: "mppt-e21",
		appliance: "Victron SmartSolar",
		code: "Err 21",
		meaning: "Current sensor problem. It does not clear itself.",
		fix: "Update firmware, reset, and reseat the wiring. A dealer if it stays."
	},
	{
		id: "mppt-e26",
		appliance: "Victron SmartSolar",
		code: "Err 26",
		meaning: "A terminal is too hot.",
		fix: "Check the wiring and tighten the bolts. It clears when the terminal cools."
	},
	{
		id: "mppt-e28",
		appliance: "Victron SmartSolar",
		code: "Err 28",
		meaning: "Power-stage problem.",
		fix: "Disconnect and reconnect every wire. Replace the controller if it returns."
	},
	{
		id: "mppt-e33",
		appliance: "Victron SmartSolar",
		code: "Err 33",
		meaning: "Panel voltage too high.",
		fix: "Clears on its own. Too many panels in series."
	},
	{
		id: "mppt-e38",
		appliance: "Victron SmartSolar",
		code: "Err 38",
		meaning: "Panel input shut down to protect the battery.",
		fix: "Disconnect the panels, then the battery. Wait 3 minutes. Reconnect the battery first, then the panels."
	},
	{
		id: "mppt-e39",
		appliance: "Victron SmartSolar",
		code: "Err 39",
		meaning: "Panel input shut down. This one resumes on its own.",
		fix: "Wait. If it keeps returning, use the same 3-minute disconnect as Err 38."
	},
	{
		id: "mppt-e40",
		appliance: "Victron SmartSolar",
		code: "Err 40",
		meaning: "The panel input failed to shut down.",
		fix: "The charger is faulty. Replace it."
	},
	{
		id: "mppt-e80",
		appliance: "Victron SmartSolar",
		code: "Err 80",
		meaning: "Panel input shut down. Same family as 81 through 87.",
		fix: "Disconnect the panels and the battery. Reconnect the battery only. Firmware should be 1.73 or newer. If 80–83 is still showing, power-cycle, then Settings, Product info, Reset, then reconnect the panels. Only later serial numbers have this reset. 100/30 from HQ2601, 100/50 from HQ2614."
	},
	{
		id: "mppt-e116",
		appliance: "Victron SmartSolar",
		code: "Err 116",
		meaning: "Calibration data lost.",
		fix: "Replace it if the error is active. If it appeared after a firmware downgrade, reinstall 1.4x."
	},
	{
		id: "mppt-e117",
		appliance: "Victron SmartSolar",
		code: "Err 117",
		meaning: "Firmware update did not finish.",
		fix: "Run the update again."
	},
	{
		id: "mppt-e119",
		appliance: "Victron SmartSolar",
		code: "Err 119",
		meaning: "Settings were lost.",
		fix: "Factory reset, disconnect for 3 minutes, then set it up again."
	},
	{
		id: "gir-e0",
		appliance: "Girard GSWH-2",
		code: "E0",
		meaning: "Outlet temperature sensor fault.",
		fix: "Check the thermistor. Read the heater label — not every coach has a Girard."
	},
	{
		id: "gir-e1",
		appliance: "Girard GSWH-2",
		code: "E1",
		meaning: "Ignition failure.",
		fix: "LP supply, the ECO, and the igniter gap. Dirt on the burner does this too."
	},
	{
		id: "gir-e2",
		appliance: "Girard GSWH-2",
		code: "E2",
		meaning: "Flame lost while running. The buzzer sounds.",
		fix: "The code table does not add a reset. Check LP, then cycle power."
	},
	{
		id: "gir-e3",
		appliance: "Girard GSWH-2",
		code: "E3",
		meaning: "ECO open. Over about 140 °F.",
		fix: "Service test: unplug CN9 and check the blue wires. No continuity means a bad ECO. Continuity means a bad board."
	},
	{
		id: "gir-e4",
		appliance: "Girard GSWH-2",
		code: "E4",
		meaning: "Inlet temperature sensor fault.",
		fix: "Check or replace the thermistor."
	},
	{
		id: "gir-e5",
		appliance: "Girard GSWH-2",
		code: "E5",
		meaning: "Blower fault.",
		fix: "The code table stops there. Look at the blower and the intake before you replace the board."
	},
	{
		id: "gir-e6",
		appliance: "Girard GSWH-2",
		code: "E6",
		meaning: "Outlet stayed over 140 °F for 3 seconds.",
		fix: "Low flow or a bad sensor. Open the tap fully."
	},
	{
		id: "gir-e7",
		appliance: "Girard GSWH-2",
		code: "E7",
		meaning: "Modulating gas valve fault.",
		fix: "The manual does not give an owner reset. This is a service item.",
		source: "Girard GSWH-2 manual. No owner reset is given."
	},
	{
		id: "gir-e8",
		appliance: "Girard GSWH-2",
		code: "E8",
		meaning: "Pressure switch, motor, or a blocked exhaust.",
		fix: "Clear the exhaust, then the switch and the motor."
	},
	{
		id: "gir-e9",
		appliance: "Girard GSWH-2",
		code: "E9",
		meaning: "Flame sensor short.",
		fix: "The code table does not give a reset. Service if it returns after a power cycle."
	},
	{
		id: "aq-1",
		appliance: "Truma AquaGo",
		code: "1",
		meaning: "Flame not detected. Shown only after 3 tries, about 30 seconds apart.",
		fix: "Switch off, wait 5 seconds, switch on. If it stays, Truma service. The CP plus panel shows this as E1W."
	},
	{
		id: "aq-2",
		appliance: "Truma AquaGo",
		code: "2",
		meaning: "Exhaust or burner over-temperature switch open or unplugged.",
		fix: "Off, wait 5 seconds, on. CP plus shows E2W."
	},
	{
		id: "aq-3",
		appliance: "Truma AquaGo",
		code: "3",
		meaning: "Exhaust pressure switch did not close, or it closed with the fan off.",
		fix: "Blocked exhaust or a bad switch. Off, wait 5 seconds, on. CP plus shows E3W."
	},
	{
		id: "aq-4",
		appliance: "Truma AquaGo",
		code: "4",
		meaning: "Water over-temperature switch opened above 185 °F.",
		fix: "Off, wait 5 seconds, on. CP plus shows E4W."
	},
	{
		id: "aq-5",
		appliance: "Truma AquaGo",
		code: "5",
		meaning: "Flame sensed at the wrong time.",
		fix: "Off, wait 5 seconds, on. CP plus shows E5W."
	},
	{
		id: "aq-6",
		appliance: "Truma AquaGo",
		code: "6",
		meaning: "Gas-valve safety circuit is open.",
		fix: "Off, wait 5 seconds, on. CP plus shows E6W."
	},
	{
		id: "aq-7",
		appliance: "Truma AquaGo",
		code: "7",
		meaning: "Burner control memory error.",
		fix: "Off, wait 5 seconds, on. If it stays, Truma service."
	},
	{
		id: "aq-9",
		appliance: "Truma AquaGo",
		code: "9",
		meaning: "Water outlet temperature sensor open or shorted.",
		fix: "Off, wait 5 seconds, on. CP plus shows E9W."
	},
	{
		id: "aq-10",
		appliance: "Truma AquaGo",
		code: "10",
		meaning: "The valve-actuation signal never turned on.",
		fix: "Off, wait 5 seconds, on. Service if it stays."
	},
	{
		id: "aq-11",
		appliance: "Truma AquaGo",
		code: "11",
		meaning: "The controller did not release the gas path.",
		fix: "Off, wait 5 seconds, on. Service if it stays."
	},
	{
		id: "aq-12",
		appliance: "Truma AquaGo",
		code: "12",
		meaning: "Internal error.",
		fix: "Off, wait 5 seconds, on. Service if it stays."
	},
	{
		id: "aq-13",
		appliance: "Truma AquaGo",
		code: "13",
		meaning: "Gas shut-off valve short. Over 1000 mA.",
		fix: "Off, wait 5 seconds, on. Do not keep resetting a short."
	},
	{
		id: "aq-16",
		appliance: "Truma AquaGo",
		code: "16",
		meaning: "Controller malfunction.",
		fix: "Off, wait 5 seconds, on. Service if it stays."
	},
	{
		id: "aq-20",
		appliance: "Truma AquaGo",
		code: "20",
		meaning: "Inlet water sensor fault, or water below 14 °F.",
		fix: "Off, wait 5 seconds, on. CP plus shows W 20 W."
	},
	{
		id: "aq-21",
		appliance: "Truma AquaGo",
		code: "21",
		meaning: "Circulation-line temperature sensor fault.",
		fix: "Off, wait 5 seconds, on."
	},
	{
		id: "aq-22",
		appliance: "Truma AquaGo",
		code: "22",
		meaning: "Gas valve modulation section open or shorted.",
		fix: "Off, wait 5 seconds, on. Service if it stays."
	},
	{
		id: "aq-23",
		appliance: "Truma AquaGo",
		code: "23",
		meaning: "Supply voltage over 16.4 V.",
		fix: "Off, wait 5 seconds, on. Check the converter or charger."
	},
	{
		id: "aq-24",
		appliance: "Truma AquaGo",
		code: "24",
		meaning: "Supply voltage under 10 V.",
		fix: "Charge the battery, then reset: off, wait 5 seconds, on."
	},
	{
		id: "aq-25",
		appliance: "Truma AquaGo",
		code: "25",
		meaning: "Flue-fan current out of range.",
		fix: "Off, wait 5 seconds, on. Clear the flue if it returns."
	},
	{
		id: "aq-26",
		appliance: "Truma AquaGo",
		code: "26",
		meaning: "Circulation pump current out of range.",
		fix: "Off, wait 5 seconds, on."
	},
	{
		id: "aq-27",
		appliance: "Truma AquaGo",
		code: "27",
		meaning: "Circulation pump is running dry. It retries 20 times.",
		fix: "Fill and bleed the loop. Off, wait 5 seconds, on."
	},
	{
		id: "aq-28",
		appliance: "Truma AquaGo",
		code: "28",
		meaning: "Gas pressure too low.",
		fix: "Open the LP valves and check the regulator. Then off, wait 5 seconds, on."
	},
	{
		id: "aq-29",
		appliance: "Truma AquaGo",
		code: "29",
		meaning: "Too much hot water demanded.",
		fix: "Close a second tap. Off, wait 5 seconds, on."
	},
	{
		id: "aq-30",
		appliance: "Truma AquaGo",
		code: "30",
		meaning: "Freeze warning. The sheet prints “below 27 °F (3 °C)”, and those two numbers do not agree.",
		fix: "Treat it as a freeze warning and confirm on your unit. Off, wait 5 seconds, on."
	},
	{
		id: "aq-31",
		appliance: "Truma AquaGo",
		code: "31",
		meaning: "Decalcification finished.",
		fix: "Not a failure. Off, wait 5 seconds, on, to clear it."
	},
	{
		id: "aq-32",
		appliance: "Truma AquaGo",
		code: "32",
		meaning: "Antifreeze-kit current too low. Often a broken cable.",
		fix: "Check the kit wiring. Off, wait 5 seconds, on."
	},
	{
		id: "aq-33",
		appliance: "Truma AquaGo",
		code: "33",
		meaning: "Antifreeze-kit current too high. Often a short.",
		fix: "Do not keep resetting a short. Check the kit wiring."
	},
	{
		id: "aq-e1w",
		appliance: "Truma AquaGo",
		code: "E1W",
		meaning: "CP plus display for code 1. Flame not detected.",
		fix: "Same reset as code 1: off, wait 5 seconds, on."
	},
	{
		id: "aq-e2w",
		appliance: "Truma AquaGo",
		code: "E2W",
		meaning: "CP plus display for code 2. Over-temperature switch.",
		fix: "Same reset as code 2."
	},
	{
		id: "aq-e3w",
		appliance: "Truma AquaGo",
		code: "E3W",
		meaning: "CP plus display for code 3. Exhaust pressure switch.",
		fix: "Same reset as code 3."
	},
	{
		id: "aq-e4w",
		appliance: "Truma AquaGo",
		code: "E4W",
		meaning: "CP plus display for code 4. Water over 185 °F.",
		fix: "Same reset as code 4."
	},
	{
		id: "aq-e5w",
		appliance: "Truma AquaGo",
		code: "E5W",
		meaning: "CP plus display for code 5. Flame at the wrong time.",
		fix: "Same reset as code 5."
	},
	{
		id: "aq-e6w",
		appliance: "Truma AquaGo",
		code: "E6W",
		meaning: "CP plus display for code 6. Gas-valve safety circuit.",
		fix: "Same reset as code 6."
	},
	{
		id: "aq-e9w",
		appliance: "Truma AquaGo",
		code: "E9W",
		meaning: "CP plus display for code 9. Outlet temperature sensor.",
		fix: "Same reset as code 9."
	},
	{
		id: "aq-w20",
		appliance: "Truma AquaGo",
		code: "W 20 W",
		meaning: "CP plus display for code 20. Inlet sensor.",
		fix: "Same reset as code 20."
	},
	{
		id: "vh-e2",
		appliance: "Truma VarioHeat",
		code: "E 2 H",
		meaning: "Flame not detected. The sheet also lists this as E 16 H.",
		fix: "New cylinder, valves open, propane not butane, and the intake and exhaust clear of ice and leaves."
	},
	{
		id: "vh-w25",
		appliance: "Truma VarioHeat",
		code: "W 25 H",
		meaning: "Voltage over 16.4 V.",
		fix: "Check the battery voltage and the chargers."
	},
	{
		id: "vh-w26",
		appliance: "Truma VarioHeat",
		code: "W 26 H",
		meaning: "Voltage under 10 V.",
		fix: "Charge or replace the battery."
	},
	{
		id: "vh-w27",
		appliance: "Truma VarioHeat",
		code: "W 27 H",
		meaning: "Warm-air outlets or the return air are blocked, or the end outlet is closed.",
		fix: "Clear the blockage and open the end outlet."
	},
	{
		id: "vh-w29",
		appliance: "Truma VarioHeat",
		code: "W 29 H",
		meaning: "Voltage about to fall under 10.4 V.",
		fix: "Charge the battery before it shuts down."
	},
	{
		id: "vh-w255",
		appliance: "Truma VarioHeat",
		code: "W 255 H",
		meaning: "No 12 V at the furnace, or no link to the panel.",
		fix: "Restore 12 V and the cable between the furnace and the panel."
	},
	{
		id: "cb-w17",
		appliance: "Truma Combi",
		code: "W 17 H",
		meaning: "Hot-water mode with an empty tank. US Truma’s Combi page. The international sheet calls this same number a water-overheat warning.",
		fix: "Switch it off, let it cool, fill the tank, then turn it back on. On a US Basecamp this is the empty-tank warning. W 401 H is the international number for the same job."
	},
	{
		id: "cb-w18",
		appliance: "Truma Combi",
		code: "W 18 H",
		meaning: "Warm-air outlet or the return air is blocked.",
		fix: "Connect every duct. Check for kinks. Clear the intake and ventilate the compartment."
	},
	{
		id: "cb-w24",
		appliance: "Truma Combi",
		code: "W 24 H",
		meaning: "Voltage about to fall under 10.4 V. International CP plus list.",
		fix: "Charge the battery and check the connections. On a US panel, under 10.0 V is E 44 H."
	},
	{
		id: "cb-e29",
		appliance: "Truma Combi",
		code: "E 29 H",
		meaning: "FrostControl heating element is drawing too much.",
		fix: "Replace the FrostControl element."
	},
	{
		id: "cb-w42",
		appliance: "Truma Combi",
		code: "W 42 H",
		meaning: "Window switch says a window is open.",
		fix: "Close the window above the cowl. W 412 H is the same message on the international sheet."
	},
	{
		id: "cb-e43",
		appliance: "Truma Combi",
		code: "E 43 H",
		meaning: "Battery voltage over 16.4 V.",
		fix: "Check the battery and the chargers. Measure 12 V at the heater under load. Unplug the converter and solar to see which one is high."
	},
	{
		id: "cb-e44",
		appliance: "Truma Combi",
		code: "E 44 H",
		meaning: "Battery under 10.0 V.",
		fix: "Charge the battery. One that will not hold a charge has to be replaced. US Truma’s Combi page. Not an ST-65 code and not an EMS code."
	},
	{
		id: "cb-w45",
		appliance: "Truma Combi",
		code: "W 45 H",
		meaning: "No 120 V, or the overheat protection opened. Eco Plus and Comfort Plus only. That is a Basecamp 16 through 2022, a Basecamp 20XE, and a World Traveler.",
		fix: "Check shore power and the fuse. If power is good, turn the heater off and push a pen into the hole on the left of the board cover until it clicks. If it stays, call Truma. Do not use the 230 V wording from the international sheet."
	},
	{
		id: "cb-e111",
		appliance: "Truma Combi",
		code: "E 111 H",
		meaning: "Electronics fault. International CP plus list.",
		fix: "Check 12 V at the heater under load. US Truma files a board fault under E 212 H instead."
	},
	{
		id: "cb-e112",
		appliance: "Truma Combi",
		code: "E 112 H",
		meaning: "Gas cylinder or shutoff closed, or overheat protection. US Truma groups E 112 H, E 202 H, and E 211 H. The service handbook also lists E 121 H and E 122 H as flame not seen or unstable.",
		fix: "Open the cylinder and the gas switch on the heater. If it stays, shut it down, let it cool, fill the tank with cold water, and clear the ducts and the intake. Supply about 11–13 in. water column."
	},
	{
		id: "cb-e212",
		appliance: "Truma Combi",
		code: "E 212 H",
		meaning: "Intake or exhaust blocked, gas valve closed, regulator fault, overheat protection, or the board.",
		fix: "Clear the exterior intake and exhaust. Open the gas switch. If it stays, cool it, fill with cold water, and clear the ducts. A code that remains can be the board. That is a Truma job, not a guess at the board."
	},
	{
		id: "cb-w255",
		appliance: "Truma Combi",
		code: "W 255 H",
		meaning: "No 12 V, or no connection to the panel.",
		fix: "The heater wants about 11–15 V. Check the 6-pin cable. The CP plus has its own 12 V feed and a 1 A fuse."
	},
	{
		id: "cb-w301",
		appliance: "Truma Combi",
		code: "W 301 H",
		meaning: "12 V too high. Also shown as W 417 H on the international sheet.",
		fix: "Check 12 V at the heater. US Truma uses E 43 H for voltage over 16.4 V."
	},
	{
		id: "cb-w302",
		appliance: "Truma Combi",
		code: "W 302 H",
		meaning: "12 V too low. Also shown as W 418 H on the international sheet.",
		fix: "Charge the battery and check the connections. On a US panel, under 10.0 V is E 44 H."
	},
	{
		id: "cb-w303",
		appliance: "Truma Combi",
		code: "W 303 H",
		meaning: "Voltage about to fall under 10.4 V. Also shown as W 411 H.",
		fix: "Charge the battery."
	},
	{
		id: "cb-w401",
		appliance: "Truma Combi",
		code: "W 401 H",
		meaning: "Hot-water mode with an empty tank. International CP plus number.",
		fix: "On a US Combi the empty-tank warning is W 17 H. Same fix if this number is the one on your panel: off, cool, fill."
	},
	{
		id: "cb-w402",
		appliance: "Truma Combi",
		code: "W 402 H",
		meaning: "Air overheat warning. International number for the same fault as W 18 H.",
		fix: "Ducts, kinks, and the intake."
	},
	{
		id: "cb-w407",
		appliance: "Truma Combi",
		code: "W 407 H",
		meaning: "Shore-power fault. International number.",
		fix: "Check shore power and the fuse. On a US coach that is 120 V. W 45 H is the US Eco Plus code for the same fault."
	},
	{
		id: "cb-w408",
		appliance: "Truma Combi",
		code: "W 408 H",
		meaning: "Gas supply failed while running in mixed mode.",
		fix: "Check gas pressure. Start in gas mode, clear the fault, then go back to mixed."
	},
	{
		id: "cb-w412",
		appliance: "Truma Combi",
		code: "W 412 H",
		meaning: "Window switch says a window is open.",
		fix: "Close the window above the cowl."
	},
	{
		id: "cb-e507",
		appliance: "Truma Combi",
		code: "E 507 H",
		meaning: "Gas supply interrupted. Also E 516 H and E 517 H. International list.",
		fix: "Check gas operating pressure. US Truma groups the gas-closed codes as E 112 H, E 202 H, and E 211 H."
	},
	{
		id: "cb-e607",
		appliance: "Truma Combi",
		code: "E 607 H",
		meaning: "Locked after more than 4 resets in 15 minutes.",
		fix: "Wait 15 minutes, then reset once."
	},
	{
		id: "cb-e621",
		appliance: "Truma Combi",
		code: "E 621 H",
		meaning: "Room-temperature sensor or its cable.",
		fix: "Check the plugs. Replace the sensor if the cable is good."
	},
	{
		id: "cb-e624",
		appliance: "Truma Combi",
		code: "E 624 H",
		meaning: "FrostControl heating element shorted.",
		fix: "Replace the element."
	},
	{
		id: "cb-e632",
		appliance: "Truma Combi",
		code: "E 632 H",
		meaning: "Shore-power overheat protection tripped. International list.",
		fix: "Reset that protection. Find why it got hot before you leave it running. On a US Eco Plus, W 45 H is the code that covers this."
	},
	{
		id: "ccc-e1",
		appliance: "Dometic CCC2",
		code: "E1",
		meaning: "Lost communication. Every board down means the system stops. One board means that zone.",
		fix: "Zone DIP switches and the cable. Try 12 V straight from the battery."
	},
	{
		id: "ccc-e2",
		appliance: "Dometic CCC2",
		code: "E2",
		meaning: "Indoor return-air sensor open.",
		fix: "The code table does not add a test. Check the sensor before you replace the thermostat."
	},
	{
		id: "ccc-e3",
		appliance: "Dometic CCC2",
		code: "E3",
		meaning: "Indoor sensor shorted.",
		fix: "Check or replace the room sensor."
	},
	{
		id: "ccc-e4",
		appliance: "Dometic CCC2",
		code: "E4",
		meaning: "Outdoor sensor fault. Heat pump locked out.",
		fix: "Check the outdoor sensor. Air conditioning can still run."
	},
	{
		id: "ccc-e5",
		appliance: "Dometic CCC2",
		code: "E5",
		meaning: "Freeze sensor fault. Air conditioning locked out.",
		fix: "Check or replace the freeze sensor."
	},
	{
		id: "ccc-e6",
		appliance: "Dometic CCC2",
		code: "E6",
		meaning: "Humidity sensor fault.",
		fix: "The code table does not add a reset."
	},
	{
		id: "ccc-e7",
		appliance: "Dometic CCC2",
		code: "E7",
		meaning: "Lost 120 V to the roof boards.",
		fix: "Shore or generator power, and the breaker to the roof unit."
	},
	{
		id: "ccc-e8",
		appliance: "Dometic CCC2",
		code: "E8",
		meaning: "Heat-pump and heat-strip DIP switches are both on.",
		fix: "Only one of those switches should be on."
	},
	{
		id: "ccc-e9",
		appliance: "Dometic CCC2",
		code: "E9",
		meaning: "Dehumidifier DIP is on together with heat pump or heat strip.",
		fix: "Correct the DIP switches."
	},
	{
		id: "ccc-ptc",
		appliance: "Dometic CCC2",
		code: "No DC",
		meaning: "No 12 V at the control. The power module uses a PTC, not a fuse.",
		fix: "Find the short, then disconnect DC positive for 30 seconds to reset."
	},
	{
		id: "sz-e1",
		appliance: "Dometic single-zone",
		code: "E1",
		meaning: "Lost communication with the module board.",
		fix: "Check the cable from the thermostat to the board."
	},
	{
		id: "sz-e2",
		appliance: "Dometic single-zone",
		code: "E2",
		meaning: "Room sensor open or out of range.",
		fix: "Check or replace the room sensor."
	},
	{
		id: "sz-e3",
		appliance: "Dometic single-zone",
		code: "E3",
		meaning: "Room sensor shorted.",
		fix: "Check or replace the room sensor."
	},
	{
		id: "sz-e4",
		appliance: "Dometic single-zone",
		code: "E4",
		meaning: "Outdoor sensor open. Heat-pump units.",
		fix: "Check or replace the outdoor sensor."
	},
	{
		id: "sz-e5",
		appliance: "Dometic single-zone",
		code: "E5",
		meaning: "Freeze sensor open. Air conditioning locked out.",
		fix: "Check or replace the freeze sensor."
	},
	{
		id: "mp-1",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 1",
		meaning: "This unit turned off because another phase turned off.",
		fix: "Find the phase that failed. Confirm the label says MultiPlus or Quattro before you use this list."
	},
	{
		id: "mp-3",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 3",
		meaning: "The system did not find the devices it expected.",
		fix: "Check the cables. Switch everything off, then on."
	},
	{
		id: "mp-4",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 4",
		meaning: "No other device was found at all.",
		fix: "Check the communication cables."
	},
	{
		id: "mp-5",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 5",
		meaning: "AC output voltage too high.",
		fix: "Check the AC cables."
	},
	{
		id: "mp-8",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 8",
		meaning: "Ground-relay test failed.",
		fix: "A GX screen shows whether the relay is stuck open or closed. This is an installer job."
	},
	{
		id: "mp-10",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 10",
		meaning: "The units cannot agree on the time.",
		fix: "Check the communication cables."
	},
	{
		id: "mp-11",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 11",
		meaning: "Relay test failed. Usually the wiring, sometimes the relay.",
		fix: "Do not keep resetting it. Have the install checked."
	},
	{
		id: "mp-14",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 14",
		meaning: "The unit cannot send data.",
		fix: "Check the communication cables."
	},
	{
		id: "mp-16",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 16",
		meaning: "A VE.Bus dongle is missing.",
		fix: "Update the firmware. Current firmware does not need the dongle. It stays off until you restart it."
	},
	{
		id: "mp-17",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 17",
		meaning: "A unit made itself master because the master failed.",
		fix: "Check the failed unit and the cables."
	},
	{
		id: "mp-18",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 18",
		meaning: "An over-voltage happened.",
		fix: "Check the AC cables."
	},
	{
		id: "mp-20",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 20",
		meaning: "The configuration is not allowed with the grid code.",
		fix: "Change the configuration. It stays off until you restart it."
	},
	{
		id: "mp-22",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 22",
		meaning: "This unit cannot run as a slave.",
		fix: "Replace the unit."
	},
	{
		id: "mp-24",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 24",
		meaning: "The transfer switch protected itself.",
		fix: "Switch everything off, then on. Shore voltage may be too low."
	},
	{
		id: "mp-25",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 25",
		meaning: "Firmware does not match across the units.",
		fix: "Turn them on one at a time until the error returns. Update that unit."
	},
	{
		id: "mp-26",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 26",
		meaning: "Internal error.",
		fix: "Switch everything off, then on. Victron if it returns."
	},
	{
		id: "mp-30",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 30",
		meaning: "A corrupted message. Also shown as 31.",
		fix: "Check the RJ45 cables and the connections."
	},
	{
		id: "mp-128",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 128",
		meaning: "It will not connect because the relay test failed for more than 5 minutes.",
		fix: "Check the install and the relays. A grid-code Quattro will stay off the shore until this clears."
	},
	{
		id: "mp-bulk",
		appliance: "Victron MultiPlus",
		code: "Bulk LED flashes",
		meaning: "Bulk ran longer than 10 hours, and shore power is present.",
		fix: "Check the batteries. Reset by switching the unit off and on."
	},
	{
		id: "mp-vsense",
		appliance: "Victron MultiPlus",
		code: "Bulk and absorption flash",
		meaning: "Voltage-sense wires disagree by more than 7 V.",
		fix: "Check the sense wiring. The unit keeps running."
	},
	{
		id: "mp-temp",
		appliance: "Victron MultiPlus",
		code: "Absorption and float flash",
		meaning: "The battery temperature reading is not believable.",
		fix: "Check or replace the temperature sensor. The unit keeps running."
	},
	{
		id: "mp-ripple",
		appliance: "Victron MultiPlus",
		code: "Low battery and overload",
		meaning: "The inverter turned off. DC ripple is too high.",
		fix: "Larger cables, shorter runs, or a bigger battery. Then switch it off and on."
	},
	{
		id: "mp-load",
		appliance: "Victron MultiPlus",
		code: "Overload LED",
		meaning: "The overload light is on by itself.",
		fix: "Reduce the load. If it will not charge with shore power present, the input wants about 97–140 V. On a generator, turn on Weak AC and the dynamic current limiter."
	},
	{
		id: "mp-vebus-led",
		appliance: "Victron MultiPlus",
		code: "Inverter light opposite",
		meaning: "The inverter-on light flashes opposite the bulk, absorption, and float lights.",
		fix: "That pattern is a VE.Bus code. Match the number in this list. The LED chart itself is in the MultiPlus manual.",
		source: "Victron MultiPlus manual, the LED chart."
	},
	{
		id: "bb-hv",
		appliance: "Battle Born GC3",
		code: "High voltage",
		meaning: "Charge stopped above 14.7 V. You can still use the battery.",
		fix: "It rebalances over several full charges. Confirm the label is a GC3 or GC3H, Airstream 514020-01, before you use this list."
	},
	{
		id: "bb-lv",
		appliance: "Battle Born GC3",
		code: "Low voltage",
		meaning: "Discharge stopped under 10.6 V. It will still accept a charge.",
		fix: "Charge it within 24 hours. Some chargers will not see a battery under 10 V, so it may need a jump from another 12 V source."
	},
	{
		id: "bb-hot",
		appliance: "Battle Born GC3",
		code: "High temperature",
		meaning: "No charge above 131 °F. No discharge at 140 °F.",
		fix: "Cool the battery."
	},
	{
		id: "bb-cold",
		appliance: "Battle Born GC3",
		code: "Low temperature",
		meaning: "No charge below 32 °F. The sheet heading also says 25 °F.",
		fix: "Use 32 °F. Warm the battery, or use the GC3H heater, before you charge. It can still discharge down to about −4 °F."
	},
	{
		id: "bb-amp",
		appliance: "Battle Born GC3",
		code: "High current",
		meaning: "More than about 500 A for 30 seconds, or a higher spike for half a second.",
		fix: "It reconnects after 5 seconds. Find the load that did it."
	},
	{
		id: "bb-short",
		appliance: "Battle Born GC3",
		code: "Short circuit",
		meaning: "The battery stays disconnected until the cables come off.",
		fix: "Remove the cables and measure voltage. Above 10 V, reconnect. Under 10 V, call Battle Born."
	},
	{
		id: "gx-42",
		appliance: "Cerbo GX",
		code: "GX 42",
		meaning: "Storage is corrupt.",
		fix: "Not a field fix. The unit goes back for repair. Classic, Trade Wind, and Basecamp XE are the coaches this panel is documented on."
	},
	{
		id: "gx-46",
		appliance: "Cerbo GX",
		code: "GX 46",
		meaning: "The data partition is full.",
		fix: "Settings, General, Support status. Remove extra apps."
	},
	{
		id: "gx-47",
		appliance: "Cerbo GX",
		code: "GX 47",
		meaning: "Data partition problem.",
		fix: "Dealer or installer."
	},
	{
		id: "gx-48",
		appliance: "Cerbo GX",
		code: "GX 48",
		meaning: "DVCC is on, and a device has firmware that is too old.",
		fix: "Update every device, or turn DVCC off if your battery notes do not allow it."
	},
	{
		id: "gx-49",
		appliance: "Cerbo GX",
		code: "GX 49",
		meaning: "Grid meter not found.",
		fix: "Check the wiring and the configuration."
	},
	{
		id: "gx-51",
		appliance: "Cerbo GX",
		code: "GX 51",
		meaning: "The MK3 interface needs a firmware update.",
		fix: "Settings, Devices, the MultiPlus, then the update notice. The inverter may restart."
	},
	{
		id: "gx-60",
		appliance: "Cerbo GX",
		code: "GX 60",
		meaning: "Could not connect to the GX.",
		fix: "Reboot the Cerbo, and the display that is talking to it."
	},
	{
		id: "vrm-150",
		appliance: "Cerbo GX",
		code: "VRM 150",
		meaning: "The Wi-Fi network answered with a login page.",
		fix: "The GX cannot join a network that asks you to accept terms. Use another network. VRM 151 is the same idea."
	},
	{
		id: "vrm-152",
		appliance: "Cerbo GX",
		code: "VRM 152",
		meaning: "The connection timed out.",
		fix: "Weak Wi-Fi, or a firewall."
	},
	{
		id: "vrm-153",
		appliance: "Cerbo GX",
		code: "VRM 153",
		meaning: "Connection or certificate problem.",
		fix: "Set the Cerbo date, time, and time zone. Check the router."
	},
	{
		id: "vrm-154",
		appliance: "Cerbo GX",
		code: "VRM 154",
		meaning: "DNS failed.",
		fix: "Set a DNS server on Ethernet or Wi-Fi. DHCP normally does this."
	},
	{
		id: "vrm-155",
		appliance: "Cerbo GX",
		code: "VRM 155",
		meaning: "No route to the internet.",
		fix: "DHCP should hand out a gateway. If you set a static address, the gateway has to be right."
	},
	{
		id: "vrm-159",
		appliance: "Cerbo GX",
		code: "VRM 159",
		meaning: "Unknown VRM error.",
		fix: "Read the message on the screen. The number alone is not enough."
	},
	{
		id: "rm-check",
		appliance: "Dometic RM fridge",
		code: "CHECK",
		meaning: "Gas ignition failed on an absorption fridge.",
		fix: "Press the main power button off, then on. After a new LP tank it can take 3 or 4 tries. This is not the 12 V compressor fridge."
	},
	{
		id: "rm-latch",
		appliance: "Dometic RM fridge",
		code: "CHECK on AC",
		meaning: "The CHECK lamp stayed on from an earlier gas failure, even though shore power is there.",
		fix: "Press the main power button off, then on. It can still cool on AC while the lamp is on."
	},
	{
		id: "rm-limp",
		appliance: "Dometic RM fridge",
		code: "Limp mode",
		meaning: "It cannot read the temperature sensor, so it runs continuously.",
		fix: "It keeps cooling until a new sensor is installed and the system is reset."
	},
	{
		id: "sl-lpg",
		appliance: "SeeLevel II",
		code: "LPG 0",
		meaning: "The propane reading stays at 0 on a 709-BTP3.",
		fix: "The sender wiring is shorted. Check that wiring. Other tanks can still be fine."
	},
	{
		id: "sl-nca",
		appliance: "SeeLevel II",
		code: "nCA",
		meaning: "The propane sender was never calibrated.",
		fix: "Calibrate it with the tank full."
	},
	{
		id: "sl-bid",
		appliance: "SeeLevel II",
		code: "BID",
		meaning: "A sender answered with the wrong ID.",
		fix: "Two senders share an ID, or one sender is bad. The screen may also say crc."
	},
	{
		id: "sl-btc",
		appliance: "SeeLevel II",
		code: "bTC",
		meaning: "The sender sent the wrong number of bits.",
		fix: "Check the tabs cut on the sender, and that the bus does not have a duplicate."
	},
	{
		id: "sl-dis",
		appliance: "SeeLevel II",
		code: "dIS",
		meaning: "That tank is turned off in the display.",
		fix: "Enable it in the programming steps. This is not a sender failure."
	},
	{
		id: "ems-e0",
		appliance: "Progressive Industries EMS",
		code: "E0",
		meaning: "Normal. The shore protector is passing power.",
		fix: "Not a fault. This is not a PD1600 inverter code."
	},
	{
		id: "ems-e1",
		appliance: "Progressive Industries EMS",
		code: "E1",
		meaning: "Reverse polarity. Hot and neutral are swapped.",
		fix: "The EMS will not pass power. Tell the campground. Try another pedestal. This is not the PD1600 low-battery code.",
		source: "Progressive Industries EMS. Not the PD1600 low-battery code."
	},
	{
		id: "ems-e2",
		appliance: "Progressive Industries EMS",
		code: "E2",
		meaning: "Open ground.",
		fix: "Tell the campground. Try another pedestal."
	},
	{
		id: "ems-e3",
		appliance: "Progressive Industries EMS",
		code: "E3",
		meaning: "Line voltage over 132 V.",
		fix: "Do not bypass the EMS. A reading of 240 V means the pedestal is wrong. Have it metered."
	},
	{
		id: "ems-e4",
		appliance: "Progressive Industries EMS",
		code: "E4",
		meaning: "Line voltage under 104 V.",
		fix: "A heavy load can drag a weak pedestal down. Tell the campground if it stays low with the loads off."
	},
	{
		id: "ems-e5",
		appliance: "Progressive Industries EMS",
		code: "E5",
		meaning: "Second line over 132 V. 50 A units only.",
		fix: "Does not apply to a 30 A EMS. Tell the campground."
	},
	{
		id: "ems-e6",
		appliance: "Progressive Industries EMS",
		code: "E6",
		meaning: "Second line under 104 V. 50 A units only.",
		fix: "Does not apply to a 30 A EMS."
	},
	{
		id: "ems-e7",
		appliance: "Progressive Industries EMS",
		code: "E7",
		meaning: "Line frequency over 69 Hz.",
		fix: "Usually a generator. Progressive Industries support, not a campground guess."
	},
	{
		id: "ems-e8",
		appliance: "Progressive Industries EMS",
		code: "E8",
		meaning: "Line frequency under 51 Hz.",
		fix: "Same as E7. Call Progressive Industries."
	},
	{
		id: "ems-e9",
		appliance: "Progressive Industries EMS",
		code: "E9",
		meaning: "The remote display link is down.",
		fix: "Check the display cable. A portable PT unit may not use E9. Hardwired HW30 and HW50 do."
	},
	{
		id: "ems-e10",
		appliance: "Progressive Industries EMS",
		code: "E10",
		meaning: "The surge module is used up.",
		fix: "It may still show errors, but it no longer protects. Contact Progressive Industries."
	},
	{
		id: "ems-pe",
		appliance: "Progressive Industries EMS",
		code: "PE",
		meaning: "A previous error. PE4 means an earlier E4.",
		fix: "It clears when shore power is removed from the EMS."
	},
	{
		id: "pd-none",
		appliance: "Progressive Dynamics",
		code: "No code",
		meaning: "Progressive Dynamics converters, and the Basecamp power center in the 2022 and 2026 books (513802), do not use numeric fault codes. A 1000 W or 2000 W inverter is a different unit. Read the label before you use E-1 through E-7.",
		fix: "A Charge Wizard light is a charge stage, not a fault. Solid green is boost, about 14.4 V. A flash about once a second, or 2–3 times a second, is normal mode at 13.6 V. A flash every 6–8 seconds is storage mode at 13.2 V. No 12 V output is AC supply, a reverse-polarity fuse, or heat."
	},
	{
		id: "nk-e1",
		appliance: "Norcold 12 V fridge",
		code: "E1",
		meaning: "Fresh-food thermistor is not cycling.",
		fix: "Check the plug and the wiring. About 10 kΩ at 77 °F if you test it. N8DC and N10DC, and the larger N15 and N20."
	},
	{
		id: "nk-e2",
		appliance: "Norcold 12 V fridge",
		code: "E2",
		meaning: "Freezer thermistor is not cycling.",
		fix: "Same checks as E1, on the freezer sensor."
	},
	{
		id: "nk-e3",
		appliance: "Norcold 12 V fridge",
		code: "E3",
		meaning: "Voltage outside the cut-out. It drops out near 10.4 V.",
		fix: "Measure 12 V at the fridge while it runs. Battery, wire size, or the board. N15 and N20 restart near 11.7 V."
	},
	{
		id: "nk-e4",
		appliance: "Norcold 12 V fridge",
		code: "E4",
		meaning: "A door has been open more than 2 minutes.",
		fix: "Close it. Check the gasket. These front-panel letters are not the rear-module flash codes."
	},
	{
		id: "nk-e5",
		appliance: "Norcold 12 V fridge",
		code: "E5",
		meaning: "Voltage too low to start. N15 and N20.",
		fix: "It wants about 10.9 V to start. Charge the battery and check the connections. Not used as a front-panel code on an N8 or N10."
	},
	{
		id: "nk-e6",
		appliance: "Norcold 12 V fridge",
		code: "E6",
		meaning: "Ambient thermistor. N15 and N20.",
		fix: "Check the plug. Replace the sensor if it tests bad."
	},
	{
		id: "nk-e7",
		appliance: "Norcold 12 V fridge",
		code: "E7",
		meaning: "Fresh-food evaporator fan. N15 and N20.",
		fix: "Clear ice or a blocked fan, then the plug. Replace the fan if it will not run."
	},
	{
		id: "nk-e8",
		appliance: "Norcold 12 V fridge",
		code: "E8",
		meaning: "Freezer condenser fan. N15 and N20.",
		fix: "Dust, a loose plug, or a dead fan."
	},
	{
		id: "nk-e9",
		appliance: "Norcold 12 V fridge",
		code: "E9",
		meaning: "Fresh-food condenser fan. N15 and N20.",
		fix: "Same as E8, on the fresh-food side."
	},
	{
		id: "vs-e1",
		appliance: "Coleman VS-18",
		code: "E1",
		meaning: "Room sensor fault. Variable-speed system only.",
		fix: "Replace the thermostat. Do not use this list on a Mach 8 or a 9420 network thermostat."
	},
	{
		id: "vs-e2",
		appliance: "Coleman VS-18",
		code: "E2",
		meaning: "Indoor coil sensor fault.",
		fix: "Sensor or the connection. Service."
	},
	{
		id: "vs-e3",
		appliance: "Coleman VS-18",
		code: "E3",
		meaning: "Outside-air sensor fault.",
		fix: "Service."
	},
	{
		id: "vs-e4",
		appliance: "Coleman VS-18",
		code: "E4",
		meaning: "Outdoor coil sensor fault.",
		fix: "Service."
	},
	{
		id: "vs-e5",
		appliance: "Coleman VS-18",
		code: "E5",
		meaning: "Compressor discharge sensor fault.",
		fix: "Service."
	},
	{
		id: "vs-e6",
		appliance: "Coleman VS-18",
		code: "E6",
		meaning: "AC voltage moved more than 10 percent during start.",
		fix: "It clears after 20 seconds. The compressor waits about 3 minutes."
	},
	{
		id: "vs-e7",
		appliance: "Coleman VS-18",
		code: "E7",
		meaning: "Discharge temperature passed 230 °F.",
		fix: "Clear a blocked outdoor coil. Refrigerant work is a tech job. It recovers near 176 °F."
	},
	{
		id: "vs-e8",
		appliance: "Coleman VS-18",
		code: "E8",
		meaning: "Indoor coil below about 10 °F.",
		fix: "A blocked or iced coil. It recovers near 45 °F. Do not open the drive board. High voltage."
	},
	{
		id: "vs-e9",
		appliance: "Coleman VS-18",
		code: "E9",
		meaning: "The thermostat cannot talk to the drive board.",
		fix: "Check the four thermostat wires and the roof plug. H1 and H2 are the two directions of that same fault."
	},
	{
		id: "vs-de",
		appliance: "Coleman VS-18",
		code: "dE",
		meaning: "Compressor driver fault.",
		fix: "Check the compressor wires. If none are loose, the driver is replaced. Sub-codes d2 through dC are on that board."
	},
	{
		id: "cz-1",
		appliance: "CZone",
		code: "1 red",
		meaning: "Module not configured.",
		fix: "A replacement module still needs a configuration. Classic Smart Control."
	},
	{
		id: "cz-2",
		appliance: "CZone",
		code: "2 red",
		meaning: "Configuration conflict.",
		fix: "The modules do not agree. A dealer with the config tool."
	},
	{
		id: "cz-3",
		appliance: "CZone",
		code: "3 red",
		meaning: "DIP switch conflict.",
		fix: "The switches do not match the configuration."
	},
	{
		id: "cz-5",
		appliance: "CZone",
		code: "5 red",
		meaning: "No modules detected.",
		fix: "Network power and the connections."
	},
	{
		id: "cz-7",
		appliance: "CZone",
		code: "7 red",
		meaning: "Over current, or a fuse is blown.",
		fix: "Find the channel. The fuse can be moved to Bypass for a manual override."
	},
	{
		id: "cz-9",
		appliance: "CZone",
		code: "9 red",
		meaning: "Commander missing.",
		fix: "The display is off the network."
	},
	{
		id: "tst-hi",
		appliance: "TST TPMS",
		code: "HI PRESSURE",
		meaning: "Above the high limit you set.",
		fix: "Let air out to the placard pressure. Classic monitors use this family. Read the brand on the display."
	},
	{
		id: "tst-lo",
		appliance: "TST TPMS",
		code: "LO PRESSURE",
		meaning: "Under the low limit you set.",
		fix: "Inflate to the placard. Cold air can trip a limit that was set tight."
	},
	{
		id: "tst-temp",
		appliance: "TST TPMS",
		code: "HI TEMP",
		meaning: "Over the high temperature. The default is about 158 °F.",
		fix: "Stop. Low pressure, a dragging brake, or a hot bearing."
	},
	{
		id: "tst-leak",
		appliance: "TST TPMS",
		code: "FAST LEAK",
		meaning: "Lost at least 2 psi in under a minute.",
		fix: "The alarm stays until the pressure is back in range. Do not keep driving on it."
	},
	{
		id: "mp-2",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 2",
		meaning: "Old and new MK2 protocol mixed.",
		fix: "Victron says this should not happen. Service."
	},
	{
		id: "mp-6",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 6",
		meaning: "Assistant or DDC program error.",
		fix: "Update the firmware on every unit and load the assistant again."
	},
	{
		id: "mp-7",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 7",
		meaning: "An external device is connected and the assistant is missing.",
		fix: "A VE.Bus BMS with no assistant. Configure it."
	},
	{
		id: "mp-12",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 12",
		meaning: "The two microcontrollers do not have the same settings.",
		fix: "Send all settings from VEConfigure, not only the changed ones."
	},
	{
		id: "mp-15",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 15",
		meaning: "The products or firmware cannot run together.",
		fix: "Update every device."
	},
	{
		id: "mp-19",
		appliance: "Victron MultiPlus",
		code: "VE.Bus 19",
		meaning: "A slave has no AC input.",
		fix: "Feed AC to every unit, or turn off Switch as Group."
	},
	{
		id: "tank-dsi",
		appliance: "Suburban tank",
		code: "DSI light",
		meaning: "Ignition lockout on a tank heater. No E-number.",
		fix: "Switch off, wait 5 seconds, on. Light a stove burner first to clear air. Check the ECO reset. Do not use ST-65 E-codes on this heater."
	},
	{
		id: "gx-91",
		appliance: "Cerbo GX",
		code: "WS500 91",
		meaning: "The alternator regulator lost the BMS.",
		fix: "It drops to get-home mode and recovers when the BMS answers. Only if a WS500 is fitted."
	},
	...extraFaultCodes
];
//#endregion
export { faultCodes as a, faultCodeRank as i, faultCodeExact as n, ownerReportedCode as o, faultCodeMatches as r, symptomForCode as s, appliances as t };
