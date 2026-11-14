import { i as __toESM } from "../_runtime.mjs";
import { m as modelById } from "./checklists-CYZuG9Db.mjs";
import { S as weightsFit, _ as tongueShareNote, a as cumulativeOrder, b as weightEntry, c as logReady, d as readWeightsFile, g as stickerPounds, h as seedTow, m as scaleProblems, n as asTow, o as explainTicket, r as asWeighIns, s as fromCumulative, t as WEIGHTS_KEY, u as newId, v as weigh, w as writeWeightsFile, x as weightProblem, y as weightDistribution } from "./weights-DTEOTqeP.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as prepareFile, I as putFile, Z as todayIso, b as formatWhen, m as deleteFile, tt as useApp, x as getFile } from "./store-DUUzfVvp.mjs";
import { a as Btn, c as Kicker, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/weights-view-BIn6hhkt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = WEIGHTS_KEY;
var empty = {
	truckName: "",
	trailerName: "",
	mode: "axle",
	steerRating: "",
	driveRating: "",
	gvwRating: "",
	payloadRating: "",
	gcwr: "",
	trailerRating: "",
	tongueRating: "",
	factory: "",
	truckFront: "",
	truckRear: "",
	bareFront: "",
	bareRear: "",
	bareTrailer: "",
	wdFront: "",
	wdRear: "",
	wdTrailer: "",
	psi: "",
	bars: "",
	washers: "",
	shank: "",
	shankHole: "",
	perchHole: "",
	trailerOnly: "",
	combinedTyped: "",
	ticketPhoto: ""
};
function scaleFilled(form) {
	return [
		form.truckFront,
		form.truckRear,
		form.bareFront,
		form.bareRear,
		form.bareTrailer,
		form.wdFront,
		form.wdRear,
		form.wdTrailer,
		form.trailerOnly,
		form.combinedTyped
	].some((value) => value.trim());
}
function pounds(text) {
	return stickerPounds(text);
}
function num(text) {
	const t = text.trim();
	if (!/^\d+(\.\d+)?$/.test(t)) return null;
	const n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function pass(front, rear, trailer, mode) {
	if (mode === "total") return fromCumulative(num(front), num(rear), trailer ? num(trailer) : null);
	return {
		steer: num(front),
		drive: num(rear),
		trailer: trailer ? num(trailer) : null
	};
}
function lb(n) {
	if (n == null || Number.isNaN(n)) return "Not entered";
	return `${Math.round(n).toLocaleString()} lb`;
}
function pct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${Math.round(n * 100)}%`;
}
function blankForm(trailerName, gvwr, uvw) {
	return {
		...empty,
		trailerName,
		trailerRating: gvwr,
		factory: uvw
	};
}
function isSingleForm(value) {
	return !!value && typeof value === "object" && !Array.isArray(value) && ("mode" in value || "truckFront" in value || "trailerRating" in value);
}
function readForm(value) {
	return {
		...empty,
		...value,
		mode: value.mode === "total" ? "total" : "axle"
	};
}
function loadStored(modelId, trailerName, gvwr, uvw) {
	const blank = {
		form: blankForm(trailerName, gvwr, uvw),
		trips: []
	};
	if (typeof window === "undefined") return blank;
	const file = readWeightsFile();
	let form = blank.form;
	let trips = blank.trips;
	if (file && isSingleForm(file)) {
		form = readForm(file);
		const next = { [modelId]: {
			...form,
			trips: []
		} };
		const tow = asTow(form);
		localStorage.setItem(KEY, JSON.stringify({
			...next,
			["tow"]: tow
		}));
	} else if (file) {
		const row = file[modelId];
		if (row && typeof row === "object" && !Array.isArray(row)) {
			form = readForm(row);
			trips = asWeighIns(row.trips);
		}
	}
	const tow = seedTow(file && isSingleForm(file) ? {
		[modelId]: form,
		["tow"]: asTow(form)
	} : file, modelId);
	return {
		form: tow ? {
			...form,
			...tow
		} : form,
		trips
	};
}
function saveStored(modelId, form, trips) {
	try {
		let all = {};
		const raw = localStorage.getItem(KEY);
		if (raw && raw.length > 1e5) return false;
		if (raw) try {
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && !isSingleForm(parsed)) all = parsed;
		} catch {}
		all[modelId] = {
			...form,
			trips
		};
		all["tow"] = asTow(form);
		if (!weightsFit(all)) return false;
		return writeWeightsFile(all);
	} catch {
		return false;
	}
}
function WeightsView() {
	const model = modelById(useApp((s) => s.modelId));
	const addLog = useApp((s) => s.addLog);
	const flash = useApp((s) => s.flash);
	const loaded = (0, import_react.useRef)(model.id);
	const initial = (0, import_react.useRef)(null);
	if (!initial.current) initial.current = loadStored(model.id, model.name, pounds(model.gvwr), pounds(model.ubw));
	const [form, setForm] = (0, import_react.useState)(initial.current.form);
	const [trips, setTrips] = (0, import_react.useState)(initial.current.trips);
	const toldFull = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (loaded.current !== model.id) {
			loaded.current = model.id;
			const next = loadStored(model.id, model.name, pounds(model.gvwr), pounds(model.ubw));
			setForm(next.form);
			setTrips(next.trips);
			return;
		}
		if (saveStored(model.id, form, trips)) toldFull.current = false;
		else if (!toldFull.current) {
			toldFull.current = true;
			flash("The scale tickets did not save. This phone's copy is full, so backup would drop them.");
		}
	}, [
		form,
		trips,
		model.id,
		model.name,
		model.gvwr,
		model.ubw,
		flash
	]);
	async function saveTicket() {
		if (![
			form.truckFront,
			form.truckRear,
			form.bareFront,
			form.bareRear,
			form.bareTrailer,
			form.wdFront,
			form.wdRear,
			form.wdTrailer
		].some((value) => value.trim())) {
			flash("Enter a scale weight first");
			return;
		}
		const missing = logReady(result);
		if (missing) {
			flash(missing);
			return;
		}
		const problems = scaleProblems(result);
		if (problems.block) {
			flash(problems.block);
			return;
		}
		const reading = (label, value) => value.trim() ? `${label} ${value.trim()} lb` : "";
		const bits = [
			"CAT scale",
			reading("truck steer", form.truckFront),
			reading("truck drive", form.truckRear),
			reading("bars off steer", form.bareFront),
			reading("bars off drive", form.bareRear),
			reading("bars off trailer", form.bareTrailer),
			reading("bars on steer", form.wdFront),
			reading("bars on drive", form.wdRear),
			reading("bars on trailer", form.wdTrailer)
		].filter(Boolean);
		const tongue = result.trailer.tongue.actual;
		const trailer = result.trailer.weight.actual;
		if (trailer != null) bits.push(`trailer ${Math.round(trailer).toLocaleString()} lb`);
		if (tongue != null) bits.push(`tongue ${Math.round(tongue).toLocaleString()} lb`);
		if (problems.warn) bits.push(problems.warn);
		if (!await Promise.resolve(addLog(`${bits.join(". ")}.`))) return;
		flash("Saved in the service log");
	}
	function saveWeighIn() {
		if (![
			form.truckFront,
			form.truckRear,
			form.bareFront,
			form.bareRear,
			form.bareTrailer,
			form.wdFront,
			form.wdRear,
			form.wdTrailer,
			form.trailerOnly
		].some((value) => value.trim())) {
			flash("Enter a scale weight first");
			return;
		}
		if (problems.block) {
			flash(problems.block);
			return;
		}
		const trip = {
			id: newId(),
			iso: todayIso(),
			name: form.trailerName || "Weigh-in",
			mode: form.mode,
			truckFront: form.truckFront,
			truckRear: form.truckRear,
			bareFront: form.bareFront,
			bareRear: form.bareRear,
			bareTrailer: form.bareTrailer,
			wdFront: form.wdFront,
			wdRear: form.wdRear,
			wdTrailer: form.wdTrailer,
			trailerOnly: form.trailerOnly,
			combinedTyped: form.combinedTyped
		};
		setTrips((list) => {
			if (list.length >= 12) flash("The oldest weigh-in was dropped. Twelve are kept.");
			return [trip, ...list].slice(0, 12);
		});
		flash("Weigh-in kept on this phone");
	}
	async function exportReport() {
		const entered = (label, value) => `${label}: ${value.trim() ? `${value.trim()} lb` : "not entered"}`;
		const text = [
			"Weight report. Measured weights, not ratings.",
			form.truckName || "Truck",
			form.trailerName || "Trailer",
			form.mode === "total" ? "Ticket style: running total" : "Ticket style: each axle alone",
			"",
			entered("Truck only, steer", form.truckFront),
			entered("Truck only, drive", form.truckRear),
			entered("Bars off, steer", form.bareFront),
			entered("Bars off, drive", form.bareRear),
			entered("Bars off, trailer axles", form.bareTrailer),
			entered("Bars on, steer", form.wdFront),
			entered("Bars on, drive", form.wdRear),
			entered("Bars on, trailer axles", form.wdTrailer),
			entered("Truck GVWR", form.gvwRating),
			entered("Payload rating", form.payloadRating),
			entered("GCWR", form.gcwr),
			entered("Trailer GVWR", form.trailerRating),
			entered("Tongue rating", form.tongueRating),
			"",
			`Payload, truck only: ${lb(result.truck.payload.actual)}`,
			`Payload, bars off: ${lb(result.noWd.payload.actual)}`,
			`Payload, bars on: ${lb(result.wd.payload.actual)}`,
			"",
			...sheetRows(explained).map((row) => `${row.label}: ${row.value}`),
			...tongueNote ? [tongueNote] : [],
			"",
			...explained.notes,
			...explained.flags,
			"",
			"Not a towing safety assessment. Confirm the door stickers."
		].filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
		if (typeof navigator.share === "function") try {
			await navigator.share({
				title: "Weight report",
				text
			});
			return;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
		}
		try {
			await navigator.clipboard.writeText(text);
			flash("Weight report copied");
		} catch {
			flash("Could not share the weight report");
		}
	}
	async function onTicketPhoto(list) {
		const file = list?.[0];
		if (!file) return;
		try {
			const prepared = await prepareFile(file);
			if (!prepared.mime.startsWith("image/")) {
				flash("Use a photo of the ticket.");
				return;
			}
			const id = newId();
			await putFile(id, prepared.blob);
			const prev = form.ticketPhoto;
			set("ticketPhoto", id);
			if (prev) deleteFile(prev);
			flash("Photo kept. Type the numbers and check them. This app does not read the ticket.");
		} catch (err) {
			const heic = err instanceof Error && err.message === "heic";
			flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
		}
	}
	function setMode(mode) {
		if (mode === form.mode) return;
		const filled = [
			form.truckFront,
			form.truckRear,
			form.bareFront,
			form.bareRear,
			form.bareTrailer,
			form.wdFront,
			form.wdRear,
			form.wdTrailer
		].some((value) => value.trim());
		set("mode", mode);
		if (filled) flash(mode === "total" ? "Those numbers are now read as a running total." : "Those numbers are now read as each axle alone.");
	}
	function openWeighIn(trip) {
		if (scaleFilled(form) && !window.confirm("Replace the numbers on this screen with that weigh-in?")) return;
		setForm((current) => ({
			...current,
			mode: trip.mode,
			truckFront: trip.truckFront,
			truckRear: trip.truckRear,
			bareFront: trip.bareFront,
			bareRear: trip.bareRear,
			bareTrailer: trip.bareTrailer,
			wdFront: trip.wdFront,
			wdRear: trip.wdRear,
			wdTrailer: trip.wdTrailer,
			trailerOnly: trip.trailerOnly,
			combinedTyped: trip.combinedTyped
		}));
	}
	function clearNumbers() {
		if (scaleFilled(form) && !window.confirm("Clear the scale numbers on this screen? Saved weigh-ins stay.")) return;
		setForm((current) => ({
			...current,
			truckFront: "",
			truckRear: "",
			bareFront: "",
			bareRear: "",
			bareTrailer: "",
			wdFront: "",
			wdRear: "",
			wdTrailer: "",
			trailerOnly: "",
			combinedTyped: ""
		}));
	}
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	const result = (0, import_react.useMemo)(() => {
		return weigh(pass(form.truckFront, form.truckRear, "", form.mode), pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode), pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode), {
			steer: num(form.steerRating),
			drive: num(form.driveRating),
			gvw: num(form.gvwRating),
			payload: num(form.payloadRating),
			gcwr: num(form.gcwr),
			trailer: num(form.trailerRating),
			tongue: num(form.tongueRating),
			factory: num(form.factory)
		});
	}, [form]);
	const problems = scaleProblems(result);
	const tongueNote = tongueShareNote(result.trailer.tonguePct);
	const explained = (0, import_react.useMemo)(() => {
		const bareOn = [
			form.bareFront,
			form.bareRear,
			form.bareTrailer
		].some((value) => value.trim());
		const barsOn = [
			form.wdFront,
			form.wdRear,
			form.wdTrailer
		].some((value) => value.trim());
		const passName = bareOn ? "bars off" : barsOn ? "bars on" : "none";
		const coupled = passName === "bars off" ? pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode) : passName === "bars on" ? pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode) : null;
		return explainTicket({
			coupled,
			truckOnly: result.truck.gvw.actual,
			trailerOnly: num(form.trailerOnly),
			combinedTyped: num(form.combinedTyped),
			barsOnCombined: result.wd.gcw.actual,
			ratings: {
				gvw: num(form.gvwRating),
				gcwr: num(form.gcwr),
				trailer: num(form.trailerRating),
				tongue: num(form.tongueRating)
			},
			passName
		});
	}, [form, result]);
	const frontLabel = form.mode === "total" ? "Front axle on the scale" : "Steer axle";
	const rearLabel = form.mode === "total" ? "Front and rear on the scale" : "Drive axle";
	const trailerLabel = form.mode === "total" ? "Truck and trailer on the scale" : "Trailer axles";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Truck scale" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
					className: "mt-1 font-display text-3xl text-ink",
					children: "Truck and trailer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Ratings come from the door stickers. Weights come from a truck scale. A CAT Scale ticket is one kind. GVW is a measured weight. GVWR is the rated maximum. A red number is a measured weight over a rating. This is not a towing safety assessment."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
						children: "Names"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Truck",
						value: form.truckName,
						onChange: (v) => set("truckName", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Trailer",
						value: form.trailerName,
						onChange: (v) => set("trailerName", v)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
						children: "Rated capacities, pounds"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-steer",
								label: "Steer axle",
								value: form.steerRating,
								onChange: (v) => set("steerRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-drive",
								label: "Drive axle",
								value: form.driveRating,
								onChange: (v) => set("driveRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-gvw",
								label: "Truck GVWR",
								value: form.gvwRating,
								onChange: (v) => set("gvwRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-payload",
								label: "Payload",
								value: form.payloadRating,
								onChange: (v) => set("payloadRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-gcwr",
								label: "GCWR",
								value: form.gcwr,
								onChange: (v) => set("gcwr", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-trailer",
								label: "Trailer GVWR",
								value: form.trailerRating,
								onChange: (v) => set("trailerRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-tongue",
								label: "Tongue rating",
								value: form.tongueRating,
								onChange: (v) => set("tongueRating", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
								id: "rate-factory",
								label: "Trailer as built",
								value: form.factory,
								onChange: (v) => set("factory", v)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Trailer GVWR and as-built weight start from the selected floor. Confirm both on your sticker. They do not change with the VIN year. The truck name and the truck ratings stay when you change trailers. Enter pounds. Pasting a number that ends in kg converts it."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
					children: "How the scale ticket is written"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					role: "group",
					"aria-label": "Scale ticket style",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: form.mode === "axle",
						onClick: () => setMode("axle"),
						children: "Each axle alone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: form.mode === "total",
						onClick: () => setMode("total"),
						children: "Running total"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						form.mode === "total" ? "Enter the number on the scale as the front axle stops, then with the rear on too, then with the trailer." : "Enter the weight of each axle group by itself.",
						" ",
						"Use the three passes in order. A blank pass is missing, not a safe result."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weigh, {
				title: "Pass 1. Truck only",
				front: frontLabel,
				rear: rearLabel,
				form,
				keys: ["truckFront", "truckRear"],
				set
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weigh, {
				title: "Pass 2. Coupled, bars off",
				front: frontLabel,
				rear: rearLabel,
				trailer: trailerLabel,
				form,
				keys: [
					"bareFront",
					"bareRear",
					"bareTrailer"
				],
				set
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weigh, {
				title: "Pass 3. Coupled, bars on",
				front: frontLabel,
				rear: rearLabel,
				trailer: trailerLabel,
				form,
				keys: [
					"wdFront",
					"wdRear",
					"wdTrailer"
				],
				set
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
						children: "Also on the ticket, if you have them"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
						id: "combined-typed",
						label: "Combined weight printed on the ticket",
						value: form.combinedTyped,
						onChange: (v) => set("combinedTyped", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
						id: "trailer-only",
						label: "Trailer weighed alone",
						value: form.trailerOnly,
						onChange: (v) => set("trailerOnly", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Leave these blank if the ticket does not show them. A trailer-only weigh is not the same as the trailer axle group on a coupled ticket."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent",
						children: ["Photograph the ticket", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "sr-only",
							onChange: (e) => {
								onTicketPhoto(e.target.files);
								e.target.value = "";
							}
						})]
					}),
					form.ticketPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketPhoto, { id: form.ticketPhoto }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "The photo is kept so you can check the numbers. Nothing is read off it, and nothing is uploaded."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketSheet, { explained }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
				title: "Truck only",
				lines: [
					[
						"Steer axle",
						result.truck.steer,
						"Steer rating"
					],
					[
						"Drive axle",
						result.truck.drive,
						"Drive rating"
					],
					[
						"Measured GVW",
						result.truck.gvw,
						"GVWR"
					],
					[
						"Payload, truck only",
						result.truck.payload,
						"Payload rating"
					]
				],
				note: result.truck.factory != null ? `Truck as built, from the GVWR minus the payload rating: ${lb(result.truck.factory)}. That is not a measured GVW.` : "Measured GVW is the scale. GVWR is the rating."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
				title: "Coupled, bars off",
				lines: [
					[
						"Steer axle",
						result.noWd.steer,
						"Steer rating"
					],
					[
						"Drive axle",
						result.noWd.drive,
						"Drive rating"
					],
					[
						"Measured GVW",
						result.noWd.gvw,
						"GVWR"
					],
					[
						"Payload with the trailer",
						result.noWd.payload,
						"Payload rating"
					],
					[
						"Trailer axles",
						result.noWd.trailer,
						"measured"
					],
					[
						"Measured GCW",
						result.noWd.gcw,
						"GCWR"
					]
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
				title: "Coupled, bars on",
				lines: [
					[
						"Steer axle",
						result.wd.steer,
						"Steer rating"
					],
					[
						"Drive axle",
						result.wd.drive,
						"Drive rating"
					],
					[
						"Measured GVW",
						result.wd.gvw,
						"GVWR"
					],
					[
						"Payload with the trailer",
						result.wd.payload,
						"Payload rating"
					],
					[
						"Trailer axles",
						result.wd.trailer,
						"measured"
					],
					[
						"Measured GCW",
						result.wd.gcw,
						"GCWR"
					]
				],
				note: "Bars move load between axles. This measured GVW is not the tongue weight."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitchCalc, {
				truck: pass(form.truckFront, form.truckRear, "", form.mode),
				noWd: pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode),
				wd: pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "What the hitch is doing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Trailer weight",
								value: lb(result.trailer.weight.actual),
								margin: result.trailer.weight.left,
								marginOf: "trailer GVWR",
								share: result.trailer.weight.pct,
								shareOf: "loaded trailer as a share of GVWR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Tongue weight, bars off",
								value: lb(result.trailer.tongue.actual),
								margin: result.trailer.tongue.left,
								marginOf: "tongue rating",
								share: result.trailer.tongue.pct,
								shareOf: "tongue rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Tongue as a share of the loaded trailer",
								value: shareText(result.trailer.tonguePct)
							}),
							tongueNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-rule py-2 text-sm text-ink",
								children: tongueNote
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Tongue still on the truck, bars on",
								value: lb(result.trailer.tongueOnTruck)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Tongue moved onto the trailer axles",
								value: lb(result.trailer.xfer),
								share: result.trailer.xferPct,
								shareOf: "bars-off tongue weight"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
								label: "Trailer cargo",
								value: lb(result.trailer.cargo.actual),
								margin: result.trailer.cargo.left,
								marginOf: "cargo capacity",
								share: result.trailer.cargo.pct,
								shareOf: "cargo capacity"
							})
						]
					}),
					problems.block ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-ink",
						children: problems.block
					}) : null,
					problems.warn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold text-ink",
						children: problems.warn
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
					children: "Hitch setup notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Tire pressure, front / rear",
							value: form.psi,
							onChange: (v) => set("psi", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Bars",
							value: form.bars,
							onChange: (v) => set("bars", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Washers",
							value: form.washers,
							onChange: (v) => set("washers", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Shank",
							value: form.shank,
							onChange: (v) => set("shank", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Hole on the shank",
							value: form.shankHole,
							onChange: (v) => set("shankHole", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							label: "Hole on the perch",
							value: form.perchHole,
							onChange: (v) => set("perchHole", v)
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "w-full",
				onClick: saveWeighIn,
				children: "Save this weigh-in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				className: "w-full",
				onClick: saveTicket,
				children: "Save this ticket in the log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				className: "w-full",
				onClick: () => void exportReport(),
				children: "Export the weight report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {
				trips,
				onOpen: openWeighIn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 text-sm font-semibold text-accent",
				onClick: clearNumbers,
				children: "Clear the scale numbers"
			})
		]
	});
}
function Weigh({ title, front, rear, trailer, form, keys, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
				id: String(keys[0]),
				label: front,
				value: String(form[keys[0]]),
				onChange: (v) => set(keys[0], v)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
				id: String(keys[1]),
				label: rear,
				value: String(form[keys[1]]),
				onChange: (v) => set(keys[1], v)
			}),
			trailer && keys[2] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lb, {
				id: String(keys[2]),
				label: trailer,
				value: String(form[keys[2]]),
				onChange: (v) => set(keys[2], v)
			}),
			form.mode === "total" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNote, {
				front: String(form[keys[0]]),
				mid: String(form[keys[1]]),
				all: keys[2] ? String(form[keys[2]]) : ""
			}) : null
		]
	});
}
function Result({ title, lines, note }) {
	const over = lines.some(([, row]) => row.left != null && row.left < 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 rounded-card border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: title
			}),
			over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-semibold text-stop",
				children: "A measured weight is over its rating."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-3",
				children: lines.map(([label, row, rating]) => {
					const hot = row.left != null && row.left < 0;
					const aside = resultAside(row, rating);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 border-b border-rule py-2 last:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "min-w-0 text-sm font-semibold text-ink",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: `shrink-0 text-right text-sm tabular-nums ${hot ? "font-semibold text-stop" : "text-ink"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold",
									children: row.actual == null ? "Not entered" : lb(row.actual)
								})
							})]
						}), aside.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-1 text-sm ${hot ? "text-stop" : "text-muted"}`,
							children: line
						}, line))]
					}, label);
				})
			}),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: note
			})
		]
	});
}
function resultAside(row, rating) {
	if (row.actual == null) return [];
	if (rating === "measured") return ["Measured axle load. Trailer GVWR is for the loaded trailer, axles plus tongue."];
	const name = rating ?? "rating";
	if (row.rated == null) return [`No ${name} entered. This measured weight is not room left under a limit, and it is not a safe-tow result.`];
	const lines = [`${name} ${lb(row.rated)}`];
	if (row.left != null) lines.push(row.left < 0 ? `${lb(Math.abs(row.left))} over the ${name}` : `${lb(row.left)} under the ${name}`);
	if (row.pct != null && Number.isFinite(row.pct)) lines.push(`${pct(row.pct)} of the ${name}`);
	return lines;
}
function sheetRows(explained) {
	return [
		{
			label: "Truck front axle",
			value: lb(explained.front),
			detail: "Measured."
		},
		{
			label: "Truck rear axle",
			value: lb(explained.rear),
			detail: "Measured."
		},
		{
			label: "Trailer axle group",
			value: lb(explained.trailerAxles),
			detail: "Measured. This does not include tongue weight."
		},
		{
			label: "Combined weight",
			value: lb(explained.combined),
			detail: "Measured GCW. Front, rear, and trailer axles added. Not a GCWR."
		},
		{
			label: "Truck GVW",
			value: lb(explained.gvw),
			detail: "Measured on this configuration. The tongue is already in it when the trailer is coupled."
		},
		{
			label: "Truck-only weight",
			value: lb(explained.truckOnly),
			detail: "Measured with the trailer off, when you entered it."
		},
		{
			label: "Tongue weight",
			value: lb(explained.tongue),
			detail: "Bars-off truck GVW minus the truck alone. Not printed on a single coupled ticket."
		},
		{
			label: "Tongue share",
			value: shareText(explained.share),
			detail: "Tongue weight divided by the loaded trailer."
		},
		{
			label: "Loaded trailer",
			value: lb(explained.loaded),
			detail: "Trailer axles plus tongue. Not the trailer GVWR."
		}
	];
}
function shareText(n) {
	if (n == null || !Number.isFinite(n)) return "Not entered";
	return `${(Math.round(n * 1e4) / 100).toFixed(2)}%`;
}
function HitchCalc({ truck, noWd, wd }) {
	const hitch = weightDistribution(truck, noWd, wd);
	const missing = hitch.lostFront == null || hitch.restoredFront == null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-card border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "Weight-distribution hitch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink",
				children: "The bars move load among the axles. They do not change the tongue weight or the combined weight."
			}),
			missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink",
				children: "Enter the truck alone, then the coupled weigh with the bars off, then the same weigh with the bars on. Those three front-axle numbers are the hitch calculation."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Lost off the front axle, bars off",
						value: lb(hitch.lostFront)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Put back on the front axle by the bars",
						value: lb(hitch.restoredFront)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Front-axle restoration",
						value: hitch.restoration == null ? "Not defined" : pct(hitch.restoration)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Rear axle, bars on versus bars off",
						value: signedMove(hitch.rearChange, "added to the rear", "taken off the rear")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Trailer axles, bars on versus bars off",
						value: signedMove(hitch.trailerChange, "added to the trailer axles", "taken off the trailer axles")
					})
				]
			}),
			hitch.restoration == null && hitch.lostFront != null && hitch.lostFront <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink",
				children: "The front axle did not get lighter when you coupled, so there is no lost weight for the bars to put back."
			}) : null,
			hitch.balance != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: Math.abs(hitch.balance) <= 20 ? "The front, rear, and trailer changes add up. The bars moved load. They did not add or remove weight." : `The axle changes disagree by ${lb(Math.abs(hitch.balance))}. Re-enter the two coupled tickets.`
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "The hitch maker’s instructions set how much front-axle weight to put back. This page does not."
			})
		]
	});
}
function signedMove(n, gained, lost) {
	if (n == null) return "Not entered";
	if (n === 0) return "No change";
	return n > 0 ? `${lb(n)} ${gained}` : `${lb(Math.abs(n))} ${lost}`;
}
function TicketSheet({ explained }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-card border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "This ticket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-3",
				children: sheetRows(explained).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-rule py-2 last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm font-semibold text-ink",
							children: row.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-sm font-semibold tabular-nums text-ink",
							children: row.value
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: row.detail
					})]
				}, row.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [explained.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink",
					children: note
				}, note)), explained.flags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-ink",
					children: flag
				}, flag))]
			})
		]
	});
}
function History({ trips, onOpen }) {
	if (!trips.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No earlier weigh-in is saved yet. Save this weigh-in keeps it on the phone. The log line is separate."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
			children: "Earlier weigh-ins"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2",
			children: trips.map((trip, index) => {
				const current = explainSaved(trip);
				const prev = trips[index + 1] ? explainSaved(trips[index + 1]) : null;
				const delta = current.combined != null && prev?.combined != null ? current.combined - prev.combined : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-rule py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 w-full text-left",
						onClick: () => onOpen(trip),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-ink",
								children: trip.name || "Weigh-in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-sm tabular-nums text-ink",
								children: [
									formatWhen(trip.iso),
									current.combined != null ? ` · Combined ${lb(current.combined)}` : "",
									current.tongue != null ? ` · Tongue ${lb(current.tongue)}` : "",
									current.loaded != null ? ` · Trailer ${lb(current.loaded)}` : ""
								]
							}),
							delta != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm tabular-nums text-muted",
								children: delta === 0 ? "Same combined weight as the older weigh-in" : `${delta > 0 ? "Up" : "Down"} ${lb(Math.abs(delta))} combined from the older weigh-in`
							}) : null
						]
					})
				}, trip.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Open a row to put those numbers back in the form. Twelve weigh-ins are kept. Saving a thirteenth drops the oldest."
		})
	] });
}
function explainSaved(trip) {
	const bareOn = [
		trip.bareFront,
		trip.bareRear,
		trip.bareTrailer
	].some((value) => value.trim());
	const barsOn = [
		trip.wdFront,
		trip.wdRear,
		trip.wdTrailer
	].some((value) => value.trim());
	const passName = bareOn ? "bars off" : barsOn ? "bars on" : "none";
	const coupled = passName === "bars off" ? pass(trip.bareFront, trip.bareRear, trip.bareTrailer, trip.mode) : passName === "bars on" ? pass(trip.wdFront, trip.wdRear, trip.wdTrailer, trip.mode) : null;
	const truck = pass(trip.truckFront, trip.truckRear, "", trip.mode);
	const truckOnly = truck.steer != null && truck.drive != null ? truck.steer + truck.drive : null;
	const bars = pass(trip.wdFront, trip.wdRear, trip.wdTrailer, trip.mode);
	const barsCombined = bars.steer != null && bars.drive != null && bars.trailer != null ? bars.steer + bars.drive + bars.trailer : null;
	return explainTicket({
		coupled,
		truckOnly,
		trailerOnly: num(trip.trailerOnly),
		combinedTyped: num(trip.combinedTyped),
		barsOnCombined: barsCombined,
		ratings: {
			gvw: null,
			gcwr: null,
			trailer: null,
			tongue: null
		},
		passName
	});
}
function TicketPhoto({ id }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		let object = "";
		getFile(id).then((blob) => {
			if (!blob || !live) return;
			object = URL.createObjectURL(blob);
			setUrl(object);
		});
		return () => {
			live = false;
			if (object) URL.revokeObjectURL(object);
		};
	}, [id]);
	return url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "Scale ticket",
		className: "h-24 w-24 rounded-lg object-cover"
	}) : null;
}
function Fact({ label, value, margin, marginOf, share, shareOf }) {
	const over = margin != null && margin < 0;
	const lines = [];
	if (margin != null && marginOf) lines.push(over ? `${lb(Math.abs(margin))} over the ${marginOf}` : `${lb(margin)} under the ${marginOf}`);
	if (share != null && Number.isFinite(share) && shareOf) lines.push(shareOf.includes(" as a share ") ? `${pct(share)} — ${shareOf}` : `${pct(share)} of the ${shareOf}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "min-w-0 text-sm font-semibold text-ink",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: `shrink-0 text-right text-sm tabular-nums ${over ? "font-semibold text-stop" : "text-ink"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-semibold",
				children: value
			}), lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `block font-normal ${over ? "text-stop" : "text-muted"}`,
				children: line
			}, line))]
		})]
	});
}
function OrderNote({ front, mid, all }) {
	const note = cumulativeOrder(num(front), num(mid), all.trim() ? num(all) : null);
	return note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-caution",
		children: note
	}) : null;
}
function toPounds(raw) {
	return weightEntry(raw);
}
function Lb({ id, label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-xs font-semibold uppercase tracking-wider text-muted",
			htmlFor: id,
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			inputMode: "decimal",
			value,
			onChange: (e) => onChange(toPounds(e.target.value)),
			className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
		}),
		weightProblem(value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-caution",
			children: weightProblem(value)
		}) : null
	] });
}
function Text({ label, value, onChange }) {
	const id = `note-${label.replace(/\s+/g, "-").toLowerCase()}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-xs font-semibold uppercase tracking-wider text-muted",
		htmlFor: id,
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		id,
		value,
		onChange: (e) => onChange(e.target.value),
		className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
	})] });
}
function Toggle({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: `min-h-11 rounded-full px-3 text-sm font-semibold ${on ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
		children
	});
}
//#endregion
export { WeightsView };
