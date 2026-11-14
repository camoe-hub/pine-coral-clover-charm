import { i as __toESM } from "../_runtime.mjs";
import { m as modelById } from "./checklists-CYZuG9Db.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { J as tiltFromAccel, O as parseSpan, R as readSpans, a as accelConvention, ct as zeroFromTilt, d as correctAccel, et as typedFloorTilt, o as applyZero, ot as writeSpans, st as writeZero, tt as useApp, y as floorRead, z as readZero } from "./store-DUUzfVvp.mjs";
import { j as Check } from "../_libs/lucide-react.mjs";
import { u as PageTitle } from "./router-Cw9i5Ud6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/level-view-HhRHf8m3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WIDE = /* @__PURE__ */ new Set([
	"Classic",
	"Globetrotter",
	"International",
	"Flying Cloud",
	"Trade Wind"
]);
var NARROW = /* @__PURE__ */ new Set(["Bambi", "Caravel"]);
var RANGE = /* @__PURE__ */ new Set(["Basecamp", "World Traveler"]);
var WIDE_NOTE = "Starting figure for this wide-body: 86.5 in, hub-face to hub-face. Not the body width. Type over it if you measure yours.";
var NARROW_NOTE = "Starting figure for this body: about 81 in, hub-face to hub-face. Not the body width. Type over it if you measure yours.";
var RANGE_NOTE = "No single track is listed. These narrow bodies are often 69 to 75 in, hub-face to hub-face. Measure once and type it.";
var OTHER_NOTE = "No track is listed. Measure hub-face to hub-face. A mid-1960s trailer was about 74.5 in.";
var UNKNOWN_NOTE = "No hub-face track is listed for this model. Measure it once. A wide-body of this length is often 86.5 in.";
function nominalFeet(short) {
	const match = /^(\d{2})/.exec(short);
	return match ? Number(match[1]) : null;
}
/** A model track, when one number is known. A saved measurement still wins. */
function trackStart(model) {
	if (RANGE.has(model.family)) return {
		inches: null,
		note: RANGE_NOTE
	};
	if (NARROW.has(model.family)) return {
		inches: 81,
		note: NARROW_NOTE
	};
	if (WIDE.has(model.family)) {
		const feet = nominalFeet(model.short);
		if (feet != null && feet >= 25) return {
			inches: 86.5,
			note: WIDE_NOTE
		};
		if (feet != null && feet >= 16 && feet <= 23) return {
			inches: 81,
			note: NARROW_NOTE
		};
	}
	if (model.family === "Other") return {
		inches: null,
		note: OTHER_NOTE
	};
	return {
		inches: null,
		note: UNKNOWN_NOTE
	};
}
var JACK_MEASURE = "Jack foot to the axle centerline. On a tandem, to the point halfway between the axles.";
/** Jack foot to axle centerline, only where a floor plan has a listed figure. */
var JACK = {
	bc16: 111,
	b16: 112,
	bc20: 140,
	bcxe: 140,
	cv19: 134,
	b22: 162,
	cv22: 162,
	fc23: 173,
	i23: 173,
	fc25: 190,
	i25: 190,
	tw25: 190,
	fc27: 193,
	i27: 193,
	g27: 193,
	c28: 201,
	c30: 220,
	fc30: 220,
	c33: 233
};
function jackStart(model) {
	const inches = JACK[model.id];
	if (inches == null) return {
		inches: null,
		note: JACK_MEASURE
	};
	return {
		inches,
		note: `Starting figure for this floor plan: ${inches} in, jack foot to axle centerline. Type over it if you measure yours.`
	};
}
var field = "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink";
/** How often the floor reading updates. The phone reports motion much faster than this. */
var SAMPLE_MS = 500;
/** No new motion for this long means the last reading is no longer current. */
var STALE_MS = 2e3;
/** A case bump of a couple of degrees should leave the center. Past this, the dot stays on the rim. */
var BUBBLE_FULL_DEG = 4;
var BUBBLE_TRAVEL_PX = 48;
function bubbleShift(deg) {
	return Math.max(-4, Math.min(BUBBLE_FULL_DEG, deg)) / BUBBLE_FULL_DEG * BUBBLE_TRAVEL_PX;
}
/** Bubble runs to the high side. Pitch up is toward the tongue. */
function LevelMark({ tilt, steady }) {
	const level = !!tilt && steady && Math.abs(tilt.pitchDeg) < .5 && Math.abs(tilt.rollDeg) < .5;
	const dx = tilt ? bubbleShift(-tilt.rollDeg) * 1.3 : 0;
	const dy = tilt ? bubbleShift(-tilt.pitchDeg) * 1.3 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative h-52 w-52 shrink-0 rounded-full border-2 border-line bg-paper",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rule" }), tilt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `absolute left-1/2 top-1/2 h-10 w-10 rounded-full ${level ? "bg-ok" : "bg-ink"}`,
			style: { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` }
		}) : null]
	});
}
function permissionKind() {
	if (typeof DeviceMotionEvent === "undefined") return "missing";
	return typeof DeviceMotionEvent.requestPermission === "function" ? "ask" : "listen";
}
function average(samples) {
	const n = samples.length;
	const sum = samples.reduce((acc, sample) => ({
		pitchDeg: acc.pitchDeg + sample.pitchDeg,
		rollDeg: acc.rollDeg + sample.rollDeg,
		flatDeg: acc.flatDeg + sample.flatDeg,
		mag: acc.mag + sample.mag,
		z: acc.z + sample.z
	}), {
		pitchDeg: 0,
		rollDeg: 0,
		flatDeg: 0,
		mag: 0,
		z: 0
	});
	return {
		pitchDeg: sum.pitchDeg / n,
		rollDeg: sum.rollDeg / n,
		flatDeg: sum.flatDeg / n,
		mag: sum.mag / n,
		z: sum.z / n
	};
}
function steadyEnough(samples) {
	if (samples.length < 3) return false;
	const pitch = samples.map((sample) => sample.pitchDeg);
	const roll = samples.map((sample) => sample.rollDeg);
	const spread = (values) => Math.max(...values) - Math.min(...values);
	return spread(pitch) <= 1 && spread(roll) <= 1;
}
function LevelView() {
	const modelId = useApp((s) => s.modelId);
	const [track, setTrack] = (0, import_react.useState)("");
	const [jack, setJack] = (0, import_react.useState)("");
	const [trackOwn, setTrackOwn] = (0, import_react.useState)(false);
	const [jackOwn, setJackOwn] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)(null);
	const [steady, setSteady] = (0, import_react.useState)(false);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [denied, setDenied] = (0, import_react.useState)(false);
	const [unavailable, setUnavailable] = (0, import_react.useState)(false);
	const [typedOn, setTypedOn] = (0, import_react.useState)(false);
	const [sideDeg, setSideDeg] = (0, import_react.useState)("");
	const [side, setSide] = (0, import_react.useState)("");
	const [endDeg, setEndDeg] = (0, import_react.useState)("");
	const [end, setEnd] = (0, import_react.useState)("");
	const [typed, setTyped] = (0, import_react.useState)(null);
	const [typedMsg, setTypedMsg] = (0, import_react.useState)("");
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [zero, setZero] = (0, import_react.useState)(null);
	const [zeroMsg, setZeroMsg] = (0, import_react.useState)("");
	const [spanMsg, setSpanMsg] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const samples = (0, import_react.useRef)([]);
	const saw = (0, import_react.useRef)(false);
	const lastMotion = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setReady(true);
		setZero(readZero());
	}, []);
	(0, import_react.useEffect)(() => {
		const saved = readSpans(modelId);
		const model = modelById(modelId);
		const trackFigure = trackStart(model);
		const jackFigure = jackStart(model);
		if (saved.jack != null) {
			setJack(String(saved.jack));
			setJackOwn(true);
		} else {
			setJack(jackFigure.inches == null ? "" : String(jackFigure.inches));
			setJackOwn(false);
		}
		if (saved.track != null) {
			setTrack(String(saved.track));
			setTrackOwn(true);
		} else {
			setTrack(trackFigure.inches == null ? "" : String(trackFigure.inches));
			setTrackOwn(false);
		}
	}, [modelId]);
	(0, import_react.useEffect)(() => {
		if (!listening) return;
		const convention = accelConvention({
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			maxTouchPoints: navigator.maxTouchPoints
		});
		saw.current = false;
		samples.current = [];
		lastMotion.current = 0;
		let bucket = [];
		let lastAt = 0;
		const onMotion = (event) => {
			const accel = event.accelerationIncludingGravity;
			if (!accel || accel.x == null || accel.y == null || accel.z == null) return;
			const corrected = correctAccel(accel.x, accel.y, accel.z, convention);
			const tilt = tiltFromAccel(corrected.x, corrected.y, corrected.z);
			if (!tilt) return;
			saw.current = true;
			lastMotion.current = Date.now();
			setPaused(false);
			bucket.push(tilt);
			const now = lastMotion.current;
			if (lastAt !== 0 && now - lastAt < SAMPLE_MS) return;
			lastAt = now;
			const sample = average(bucket);
			bucket = [];
			const next = samples.current.concat(sample).slice(-8);
			samples.current = next;
			setUnavailable(false);
			setSteady(steadyEnough(next.slice(-4)));
			setLive(average(next.slice(-4)));
			setTyped(null);
		};
		window.addEventListener("devicemotion", onMotion);
		const timer = window.setTimeout(() => {
			if (!saw.current) setUnavailable(true);
		}, 2500);
		const stale = window.setInterval(() => {
			if (!saw.current || lastMotion.current === 0 || Date.now() - lastMotion.current < STALE_MS) return;
			setPaused(true);
			setSteady(false);
			setLive(null);
			samples.current = [];
		}, 500);
		return () => {
			window.removeEventListener("devicemotion", onMotion);
			window.clearTimeout(timer);
			window.clearInterval(stale);
		};
	}, [listening]);
	function persist(nextTrack, nextJack, ownTrack, ownJack) {
		const trackSpan = !ownTrack || nextTrack.trim() === "" ? null : parseSpan(nextTrack);
		const jackSpan = !ownJack || nextJack.trim() === "" ? null : parseSpan(nextJack);
		const trackOk = !ownTrack || nextTrack.trim() === "" || trackSpan != null;
		const jackOk = !ownJack || nextJack.trim() === "" || jackSpan != null;
		if (!trackOk || !jackOk) return;
		setSpanMsg(writeSpans(modelId, {
			track: trackSpan,
			jack: jackSpan
		}) ? "" : "The spans did not save on this phone.");
	}
	function stop() {
		setListening(false);
		setPaused(false);
		setSteady(false);
		setLive(null);
		samples.current = [];
	}
	function recheck() {
		samples.current = [];
		lastMotion.current = Date.now();
		setPaused(false);
		setSteady(false);
		setLive(null);
		setTyped(null);
		setTypedMsg("");
		if (!listening) start();
	}
	async function start() {
		setDenied(false);
		setUnavailable(false);
		setPaused(false);
		setTyped(null);
		setTypedMsg("");
		const kind = permissionKind();
		if (kind === "missing") {
			setUnavailable(true);
			return;
		}
		if (kind === "ask") try {
			if (await DeviceMotionEvent.requestPermission?.() === "denied") {
				setDenied(true);
				setListening(false);
				return;
			}
		} catch {
			setDenied(true);
			setListening(false);
			return;
		}
		setListening(true);
	}
	function zeroPhone() {
		if (!live || !steady) {
			setZeroMsg(listening ? "Hold still on a level surface, then zero." : "Read the floor first. Then set the phone on a level surface and zero.");
			return;
		}
		const next = zeroFromTilt(live);
		if (!next) {
			setZeroMsg("Hold the phone flat, screen up, on a level surface, then zero.");
			return;
		}
		setZero(next);
		setZeroMsg("");
		writeZero(next);
	}
	function clearZero() {
		setZero(null);
		setZeroMsg("");
		writeZero(null);
	}
	function acceptFigures() {
		const ownTrack = parseSpan(track) != null;
		const ownJack = parseSpan(jack) != null;
		if (!ownTrack && !ownJack) return;
		setTrackOwn(ownTrack);
		setJackOwn(ownJack);
		persist(track, jack, ownTrack, ownJack);
	}
	function useTyped() {
		if (!side || !end) {
			setTypedMsg("Pick the low side and the low end, or Level, before the inches.");
			return;
		}
		const result = typedFloorTilt({
			side,
			sideDeg,
			end,
			endDeg
		});
		if (!result.ok) {
			setTypedMsg(result.message);
			return;
		}
		setTypedMsg("");
		setListening(false);
		setPaused(false);
		setLive(null);
		setSteady(true);
		setTyped(result.tilt);
	}
	const model = modelById(modelId);
	const figure = trackStart(model);
	const jackFigure = jackStart(model);
	const spans = {
		track: trackOwn ? parseSpan(track) : null,
		jack: jackOwn ? parseSpan(jack) : null
	};
	const bubbleTilt = live ? applyZero(live, zero) : null;
	const tilt = typed ?? bubbleTilt;
	const read = tilt ? floorRead(tilt, spans, typed ? true : steady) : null;
	const trackBad = track.trim() !== "" && parseSpan(track) == null;
	const jackBad = jack.trim() !== "" && parseSpan(jack) == null;
	const canAccept = !trackOwn && parseSpan(track) != null || !jackOwn && parseSpan(jack) != null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
			children: "On site"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Trailer level"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: "Top of the phone toward the tongue. Screen up, flat on the floor. Side to side first, then the jack. Stabilizers are not for leveling."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelMark, {
				tilt: bubbleTilt,
				steady
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-[20px] border border-line bg-sheet",
			"aria-live": "polite",
			children: paused && listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-4 font-display text-2xl leading-tight text-ink",
				children: "Reading paused. Hold the phone still and try again."
			}) : read?.axes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisCard, {
					axis: read.axes[0],
					deg: tilt ? formatDeg(tilt.rollDeg) : ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-4 border-t border-rule" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisCard, {
					axis: read.axes[1],
					deg: tilt ? formatDeg(tilt.pitchDeg) : ""
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-4 font-display text-2xl leading-tight text-ink",
				children: read ? read.lines[0] : "Set the phone on the floor, top toward the tongue."
			})
		}),
		read?.estimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Estimate from the phone on the floor. Not a certified level."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4",
			"aria-label": "Sensor status",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
				children: "Sensor"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 space-y-2 text-sm text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
					on: !!typed || listening && steady && !paused,
					label: paused && listening ? "Reading paused" : typed || listening && steady ? "Stable reading" : listening ? "Hold still" : "Not reading yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
					on: !!tilt && tilt.z > 0,
					label: tilt && tilt.z <= 0 ? "Turn the phone screen up" : tilt ? "Screen up" : "Screen up, top toward the tongue"
				})]
			})]
		}),
		denied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-ink",
			children: "Motion is off for RivetCare. Type a Level reading below, or turn motion on in Settings."
		}) : null,
		unavailable && !denied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-ink",
			children: "This window is not sending motion. Type a Level reading, or open RivetCare on the phone."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-2",
			children: listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: stop,
				className: "min-h-14 rounded-[18px] border border-line bg-sheet px-3 text-sm font-semibold text-ink",
				children: "Stop reading"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: recheck,
				className: "min-h-14 rounded-[18px] border border-line bg-sheet px-3 text-sm font-semibold text-ink",
				children: "Recheck"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void start(),
				className: "col-span-2 min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
				children: ready && permissionKind() === "ask" ? "Allow motion" : "Read the floor"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: zeroPhone,
			className: "mt-2 flex min-h-14 w-full items-center justify-center rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink",
			children: "Zero the phone"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Set the phone on a surface you know is level, and hold still. Zero takes out a case or a camera bump. It does not level the trailer, and it stays on this phone."
		}),
		zero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: "Zero is set for this phone."
		}) : null,
		zeroMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: zeroMsg
		}) : null,
		zero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: clearZero,
			className: "mt-2 min-h-11 text-sm font-semibold text-ink",
			children: "Clear zero"
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
					children: "For this coach"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-sm font-semibold text-ink",
					htmlFor: "level-track",
					children: [
						"Track, inches",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-normal text-muted",
							children: trackOwn ? "Saved for this coach. Hub-face to hub-face, not the body width." : figure.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "level-track",
							inputMode: "decimal",
							value: track,
							onChange: (e) => {
								const next = e.target.value.replace(/[^\d.]/g, "").slice(0, 6);
								const own = next.trim() !== "";
								setTrack(next);
								setTrackOwn(own);
								persist(next, jack, own, jackOwn);
							},
							className: field
						})
					]
				}),
				trackBad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-caution",
					children: "Use 20 to 400 inches, one decimal."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-sm font-semibold text-ink",
					htmlFor: "level-jack",
					children: [
						"Jack to axle, inches",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-normal text-muted",
							children: jackOwn ? "Saved for this coach. Jack foot to the axle centerline." : jackFigure.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "level-jack",
							inputMode: "decimal",
							value: jack,
							onChange: (e) => {
								const next = e.target.value.replace(/[^\d.]/g, "").slice(0, 6);
								const own = next.trim() !== "";
								setJack(next);
								setJackOwn(own);
								persist(track, next, trackOwn, own);
							},
							className: field
						})
					]
				}),
				jackBad ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-caution",
					children: "Use 20 to 400 inches, one decimal."
				}) : null,
				spanMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-ink",
					children: spanMsg
				}) : null,
				canAccept ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "The inches stay off until you use these starting figures or type your own. A number already in the box is not a measurement of this trailer."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "A number you type replaces the starting figure and stays on this phone with this coach."
				}),
				canAccept ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: acceptFigures,
					className: "mt-3 min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink",
					children: "Use these starting figures"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-[20px] border border-line bg-sheet px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTypedOn((on) => !on),
				className: "min-h-11 text-sm font-semibold text-ink",
				"aria-expanded": typedOn,
				children: typedOn ? "Hide the Level reading" : "Type a Level reading"
			}), typedOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "From the Measure app, Level, phone flat. Do not tap that screen to zero it. Degrees here are only the input. The answer above stays in inches."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-sm font-semibold text-ink",
						htmlFor: "level-side-deg",
						children: ["Across, degrees", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "level-side-deg",
							inputMode: "decimal",
							value: sideDeg,
							onChange: (e) => setSideDeg(e.target.value.replace(/[^\d.]/g, "").slice(0, 5)),
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: side === "curbside",
								onClick: () => setSide("curbside"),
								children: "Curbside low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: side === "roadside",
								onClick: () => setSide("roadside"),
								children: "Roadside low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: side === "level",
								onClick: () => setSide("level"),
								children: "Level"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm font-semibold text-ink",
						htmlFor: "level-end-deg",
						children: ["Lengthwise, degrees", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "level-end-deg",
							inputMode: "decimal",
							value: endDeg,
							onChange: (e) => setEndDeg(e.target.value.replace(/[^\d.]/g, "").slice(0, 5)),
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: end === "tongue",
								onClick: () => setEnd("tongue"),
								children: "Tongue low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: end === "front",
								onClick: () => setEnd("front"),
								children: "Front high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
								on: end === "level",
								onClick: () => setEnd("level"),
								children: "Level"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: useTyped,
						className: "mt-4 min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink",
						children: "Show the inches"
					}),
					typedMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink",
						children: typedMsg
					}) : null
				]
			}) : null]
		})
	] });
}
function formatDeg(deg) {
	return `${Math.round(Math.abs(deg) * 10) / 10}°`;
}
function AxisCard({ axis, deg }) {
	const chip = axis.state === "level" ? {
		label: "Level",
		className: "bg-sage-soft text-ok"
	} : axis.state === "stop" ? {
		label: "Too far",
		className: "bg-warn-soft text-caution"
	} : axis.state === "ask" ? {
		label: "Need a span",
		className: "bg-warn-soft text-caution"
	} : {
		label: "Adjustment needed",
		className: "bg-warn-soft text-caution"
	};
	const inches = axis.figure !== "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sans text-lg font-semibold text-ink",
					children: axis.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `shrink-0 rounded-full px-2.5 py-1 text-[13px] font-semibold ${chip.className}`,
					children: chip.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-display text-4xl tabular-nums leading-none text-ink",
				children: [inches ? axis.figure : deg || "—", inches ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 font-sans text-lg font-semibold text-muted",
					children: "in"
				}) : null]
			}),
			inches && deg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: deg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink",
				children: axis.action
			})
		]
	});
}
function StatusRow({ on, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-2",
		children: [on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-4 shrink-0 text-ok",
			"aria-hidden": true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-4 shrink-0 rounded-full border border-line",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function Pick({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: `min-h-11 rounded-full border px-2 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-paper text-ink"}`,
		children
	});
}
//#endregion
export { LevelView };
