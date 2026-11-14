import { i as __toESM } from "../_runtime.mjs";
import { p as modelById } from "./coach-KEaWY9VI.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as lowWheels, E as oldestTire, F as putFile, J as tireAges, P as prepareFile, U as sideNeedsReplace, X as todayIso, Z as treadNeedsReplace, _ as fileStillUsed, b as getFile, et as useApp, g as emptyWheel, i as WHEELS, it as withoutCheck, p as deleteFile, rt as withCheck, y as formatWhen } from "./store-C3gr-Jyz.mjs";
import { f as Btn, m as Kicker, p as Card } from "./routes-BL7pyKhp.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/tires-view-BjBkuol3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Single-tire rows only. Dual ratings are lower and are not used.
* ST225/75R15 is the Goodyear highway trailer table through load range E.
* The LT sizes are the Goodyear load and inflation table through load range E at 80 psi.
* A higher load range, or a different brand, is not in this table.
*/
var TIRE_TABLES = [
	{
		size: "ST225/75R15",
		source: "Goodyear highway trailer table, single tire, load range E.",
		rows: [
			{
				psi: 25,
				lb: 1430
			},
			{
				psi: 30,
				lb: 1600
			},
			{
				psi: 35,
				lb: 1760
			},
			{
				psi: 40,
				lb: 1880
			},
			{
				psi: 45,
				lb: 2020
			},
			{
				psi: 50,
				lb: 2150
			},
			{
				psi: 55,
				lb: 2270
			},
			{
				psi: 60,
				lb: 2380
			},
			{
				psi: 65,
				lb: 2540
			},
			{
				psi: 70,
				lb: 2620
			},
			{
				psi: 75,
				lb: 2720
			},
			{
				psi: 80,
				lb: 2830
			}
		]
	},
	{
		size: "LT225/75R16",
		source: "Goodyear load and inflation table, single tire, through load range E at 80 psi.",
		rows: [
			{
				psi: 35,
				lb: 1500
			},
			{
				psi: 40,
				lb: 1650
			},
			{
				psi: 45,
				lb: 1790
			},
			{
				psi: 50,
				lb: 1940
			},
			{
				psi: 55,
				lb: 2060
			},
			{
				psi: 60,
				lb: 2190
			},
			{
				psi: 65,
				lb: 2335
			},
			{
				psi: 70,
				lb: 2440
			},
			{
				psi: 75,
				lb: 2560
			},
			{
				psi: 80,
				lb: 2680
			}
		]
	},
	{
		size: "LT235/85R16",
		source: "Goodyear load and inflation table, single tire, through load range E at 80 psi.",
		rows: [
			{
				psi: 35,
				lb: 1700
			},
			{
				psi: 40,
				lb: 1870
			},
			{
				psi: 45,
				lb: 2030
			},
			{
				psi: 50,
				lb: 2205
			},
			{
				psi: 55,
				lb: 2335
			},
			{
				psi: 60,
				lb: 2485
			},
			{
				psi: 65,
				lb: 2623
			},
			{
				psi: 70,
				lb: 2765
			},
			{
				psi: 75,
				lb: 2905
			},
			{
				psi: 80,
				lb: 3042
			}
		]
	}
];
function tireTable(size) {
	return TIRE_TABLES.find((table) => table.size === size) ?? null;
}
/** Lowest cold pressure whose row carries this axle-end load. Over the last row is not a made-up pressure. */
function coldForLoad(size, pounds) {
	const table = tireTable(size);
	if (!table || !Number.isFinite(pounds) || pounds <= 0) return "empty";
	const row = table.rows.find((item) => item.lb >= pounds);
	if (!row) return "over";
	return {
		psi: row.psi,
		carries: row.lb
	};
}
var field = "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink";
function years(n) {
	const whole = Math.max(0, Math.floor(n));
	return whole === 1 ? "about 1 year" : `about ${whole} years`;
}
function mountYears(on) {
	if (!on) return null;
	const mounted = /* @__PURE__ */ new Date(`${on}T12:00:00`);
	if (Number.isNaN(mounted.getTime())) return null;
	return (Date.now() - mounted.getTime()) / 315576e5;
}
function draftFrom(tires) {
	const wheels = {};
	for (const wheel of WHEELS) wheels[wheel.id] = {
		...emptyWheel(),
		...tires.wheels[wheel.id]
	};
	return {
		psi: tires.psi,
		endLb: tires.endLb,
		dot: tires.dot,
		on: tires.on,
		rotated: tires.rotated,
		wheels
	};
}
function wheelSummary(wheel) {
	const bits = [];
	if (wheel.dot) bits.push(`DOT ${wheel.dot}`);
	if (wheel.on) bits.push(`mounted ${formatWhen(wheel.on)}`);
	if (wheel.tread === "ok" || wheel.tread === "replace") bits.push(`tread ${wheel.tread}`);
	else if (wheel.tread) bits.push(`${wheel.tread}/32`);
	if (wheel.side === "replace") bits.push("sidewall replace");
	else if (wheel.side === "ok") bits.push("sidewall ok");
	return bits.join(" · ") || "Not set";
}
function MarkButton({ pressed, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": pressed,
		onClick,
		className: `min-h-11 rounded-full px-3 text-sm font-semibold ${pressed ? "bg-navy text-on-navy" : "border border-line bg-paper text-ink"}`,
		children: label
	});
}
function Thumb({ photo }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		let object = "";
		getFile(photo.id).then((blob) => {
			if (!live || !blob) return;
			object = URL.createObjectURL(blob);
			setUrl(object);
		});
		return () => {
			live = false;
			if (object) URL.revokeObjectURL(object);
		};
	}, [photo.id]);
	return url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		className: "h-16 w-16 rounded-lg object-cover"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid h-16 w-16 place-items-center rounded-lg bg-paper text-xs text-muted",
		children: "Photo"
	});
}
var placedWheels = [
	"lf",
	"rf",
	"lr",
	"rr",
	"spare"
].map((id) => WHEELS.find((wheel) => wheel.id === id));
function TiresView() {
	const saved = useApp((s) => s.tires);
	const modelId = useApp((s) => s.modelId);
	const model = modelById(modelId);
	const setTires = useApp((s) => s.setTires);
	const flash = useApp((s) => s.flash);
	const [draft, setDraft] = (0, import_react.useState)(() => draftFrom(saved));
	const [today, setToday] = (0, import_react.useState)("");
	const [checkOn, setCheckOn] = (0, import_react.useState)("");
	const [checkPsi, setCheckPsi] = (0, import_react.useState)({});
	const [checkNote, setCheckNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setToday(todayIso());
	}, []);
	(0, import_react.useEffect)(() => {
		setDraft(draftFrom(useApp.getState().tires));
		setCheckOn(todayIso());
		setCheckPsi({});
		setCheckNote("");
	}, [modelId]);
	const oldest = oldestTire(saved);
	const ages = tireAges(saved);
	const old = oldest != null && oldest.years >= 6 || ages.onYears != null && ages.onYears >= 6 || WHEELS.some((wheel) => {
		const mounted = mountYears(saved.wheels[wheel.id]?.on ?? "");
		return mounted != null && mounted >= 6;
	});
	function patchWheel(id, patch) {
		setDraft((current) => ({
			...current,
			wheels: {
				...current.wheels,
				[id]: {
					...current.wheels[id],
					...patch
				}
			}
		}));
	}
	async function saveRecord() {
		const wheels = {};
		for (const wheel of WHEELS) wheels[wheel.id] = draft.wheels[wheel.id];
		if (await Promise.resolve(setTires({
			psi: draft.psi,
			endLb: draft.endLb,
			dot: draft.dot,
			on: draft.on,
			rotated: draft.rotated,
			wheels
		}))) flash("Tire record saved");
	}
	async function choosePhoto(file, next, previous) {
		if (!file) return;
		setBusy(true);
		try {
			const prepared = await prepareFile(file);
			if (!prepared.mime.startsWith("image/")) {
				flash("Use a photo, not a PDF.");
				return;
			}
			const id = crypto.randomUUID();
			const photo = {
				id,
				name: prepared.name,
				mime: prepared.mime
			};
			await putFile(id, prepared.blob);
			if (!await Promise.resolve(setTires({ photos: next(photo) }))) {
				if (!fileStillUsed(id)) deleteFile(id);
				return;
			}
			if (previous && previous.id !== id && !fileStillUsed(previous.id)) deleteFile(previous.id);
		} catch (err) {
			const heic = err instanceof Error && err.message === "heic";
			flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
		} finally {
			setBusy(false);
		}
	}
	async function removePhoto(photos, id) {
		if (await Promise.resolve(setTires({ photos })) && !fileStillUsed(id)) deleteFile(id);
	}
	async function saveCheck() {
		const checks = withCheck(useApp.getState().tires, {
			on: checkOn,
			psi: checkPsi,
			note: checkNote
		});
		if (!checks) {
			flash("Use a real date, and a pressure or a note.");
			return;
		}
		if (!await Promise.resolve(setTires({ checks }))) return;
		setCheckPsi({});
		setCheckNote("");
		flash("Pressure check saved");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Sidewall and placard" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Tires"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Cold pressure is the number you run, from the placard for this load. Each tire gets its own DOT code, including the spare. The maximum on the spec card is not the pressure to use."
		}),
		oldest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-ink",
			children: [
				oldest.id === "set" ? "One DOT for the set" : `Oldest tire: ${oldest.label}`,
				", DOT ",
				oldest.dot,
				", ",
				years(oldest.years),
				". The 5-year replace follows this tire."
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "tire-psi",
					children: "Placard cold pressure (psi)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "tire-psi",
					inputMode: "numeric",
					value: draft.psi,
					onChange: (e) => setDraft({
						...draft,
						psi: e.target.value.replace(/[^\d]/g, "").slice(0, 3)
					}),
					placeholder: "80",
					className: `${field} tabular-nums`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "This is the number you inflate to. A walk-around below compares a reading to it. It does not replace this number."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoRow, {
					photo: saved.photos.placard,
					label: "Placard photo",
					busy,
					onPick: (file) => {
						const live = useApp.getState().tires.photos;
						choosePhoto(file, (photo) => ({
							...live,
							placard: photo
						}), live.placard);
					},
					onRemove: () => {
						const live = useApp.getState().tires.photos;
						if (!live.placard) return;
						removePhoto({
							...live,
							placard: null
						}, live.placard.id);
					}
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadCard, {
			size: model.tire,
			placard: draft.psi,
			endLb: draft.endLb,
			onEnd: (endLb) => setDraft({
				...draft,
				endLb
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "tire-rotated",
					children: "Last rotation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "tire-rotated",
					type: "date",
					value: draft.rotated,
					max: today || void 0,
					onChange: (e) => setDraft({
						...draft,
						rotated: e.target.value
					}),
					className: field
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Same side only. Front and rear trade places. Do not cross them left to right. The 10,000-mile or 6-month job uses this date."
				}),
				(saved.dot || saved.on) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink",
							children: "Older record, one code for the set. It is used until a wheel below has its own DOT."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-semibold text-ink",
							htmlFor: "tire-dot",
							children: "DOT date code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "tire-dot",
							inputMode: "numeric",
							value: draft.dot,
							onChange: (e) => setDraft({
								...draft,
								dot: e.target.value.replace(/[^\d]/g, "").slice(0, 4)
							}),
							placeholder: "2323",
							className: `${field} tabular-nums`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-semibold text-ink",
							htmlFor: "tire-on",
							children: "Date they were mounted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "tire-on",
							type: "date",
							value: draft.on,
							max: today || void 0,
							onChange: (e) => setDraft({
								...draft,
								on: e.target.value
							}),
							className: field
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "col-span-2 text-sm text-muted",
				children: "Leave a tire blank if this coach does not have it. The spare counts."
			}), placedWheels.map((wheel) => {
				const row = draft.wheels[wheel.id];
				const savedWheel = saved.wheels[wheel.id];
				const photo = saved.photos.side[wheel.id] ?? null;
				const replace = treadNeedsReplace(row.tread) || sideNeedsReplace(row.side);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: `rounded-card border border-rule bg-sheet ${wheel.id === "spare" ? "col-span-2" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 [&::-webkit-details-marker]:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-ink",
							children: wheel.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right text-sm text-muted",
							children: wheelSummary(savedWheel ?? emptyWheel())
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 px-4 pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-semibold text-ink",
								htmlFor: `dot-${wheel.id}`,
								children: "DOT date code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: `dot-${wheel.id}`,
								inputMode: "numeric",
								value: row.dot,
								onChange: (e) => patchWheel(wheel.id, { dot: e.target.value.replace(/[^\d]/g, "").slice(0, 4) }),
								placeholder: "2323",
								className: `${field} tabular-nums`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Last four digits. 2323 means week 23 of 2023."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-semibold text-ink",
								htmlFor: `on-${wheel.id}`,
								children: "Date mounted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: `on-${wheel.id}`,
								type: "date",
								value: row.on,
								max: today || void 0,
								onChange: (e) => patchWheel(wheel.id, { on: e.target.value }),
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: "Tread"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkButton, {
										pressed: row.tread === "ok",
										label: "OK",
										onClick: () => patchWheel(wheel.id, { tread: row.tread === "ok" ? "" : "ok" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkButton, {
										pressed: row.tread === "replace",
										label: "Replace",
										onClick: () => patchWheel(wheel.id, { tread: row.tread === "replace" ? "" : "replace" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										"aria-label": `${wheel.label} tread in 32nds`,
										inputMode: "numeric",
										value: /^\d+$/.test(row.tread) ? row.tread : "",
										onChange: (e) => patchWheel(wheel.id, { tread: e.target.value.replace(/[^\d]/g, "").slice(0, 2) }),
										placeholder: "32nds",
										className: "min-h-11 w-24 rounded-full border border-line bg-paper px-3 text-base tabular-nums text-ink"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Replace at 2/32 in. A number is a reading, not a guess of how long the tire has left."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: "Sidewall"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkButton, {
									pressed: row.side === "ok",
									label: "OK",
									onClick: () => patchWheel(wheel.id, { side: row.side === "ok" ? "" : "ok" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkButton, {
									pressed: row.side === "replace",
									label: "Replace",
									onClick: () => patchWheel(wheel.id, { side: row.side === "replace" ? "" : "replace" })
								})]
							}),
							replace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-ink",
								children: [wheel.label, " is at the replace line."]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoRow, {
								photo,
								label: "Sidewall date code",
								busy,
								onPick: (file) => {
									const live = useApp.getState().tires.photos;
									choosePhoto(file, (next) => ({
										...live,
										side: {
											...live.side,
											[wheel.id]: next
										}
									}), live.side[wheel.id] ?? null);
								},
								onRemove: () => {
									const live = useApp.getState().tires.photos;
									const current = live.side[wheel.id];
									if (!current) return;
									const side = { ...live.side };
									delete side[wheel.id];
									removePhoto({
										...live,
										side
									}, current.id);
								}
							})
						]
					})]
				}, wheel.id);
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "mt-4 w-full",
			onClick: () => void saveRecord(),
			children: "Save on this phone"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-ink",
					children: "Cold-pressure check"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "One walk-around. Cold, after at least 3 hours. These readings sit next to the placard number. They do not change it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "check-on",
					children: "Date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "check-on",
					type: "date",
					value: checkOn,
					max: today || void 0,
					onChange: (e) => setCheckOn(e.target.value),
					className: field
				}),
				WHEELS.map((wheel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: `psi-${wheel.id}`,
					children: [wheel.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: `psi-${wheel.id}`,
						inputMode: "numeric",
						value: checkPsi[wheel.id] ?? "",
						onChange: (e) => setCheckPsi({
							...checkPsi,
							[wheel.id]: e.target.value.replace(/[^\d]/g, "").slice(0, 3)
						}),
						placeholder: draft.psi || "psi",
						className: `${field} mt-1 tabular-nums`
					})]
				}, wheel.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "check-note",
					children: "Note"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "check-note",
					value: checkNote,
					maxLength: 80,
					onChange: (e) => setCheckNote(e.target.value),
					placeholder: "Optional",
					className: field
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					onClick: () => void saveCheck(),
					children: "Save this check"
				}),
				saved.checks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3 border-t border-line pt-3",
					children: saved.checks.map((check) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRow, {
						check,
						placard: saved.psi,
						onRemove: () => {
							Promise.resolve(setTires({ checks: withoutCheck(useApp.getState().tires, check.on) })).then((ok) => {
								if (ok) flash("Check removed");
							});
						}
					}, check.on))
				})
			]
		}),
		(oldest || ages.onYears != null || saved.psi) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-2 p-4 text-sm text-ink",
			children: [
				saved.psi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Saved placard pressure ",
					saved.psi,
					" psi."
				] }) : null,
				oldest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					oldest.id === "set" ? "DOT" : oldest.label,
					" ",
					oldest.dot,
					" · ",
					years(oldest.years),
					" from the date code."
				] }) : null,
				ages.onYears != null && saved.on && !oldest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Mounted ",
					formatWhen(saved.on),
					" · ",
					years(ages.onYears),
					"."
				] }) : null,
				old ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Many tire makers replace a tire 6 years after the DOT date, even with tread left. Confirm with the tire maker, not this app."
				}) : null
			]
		})
	] });
}
function LoadCard({ size, placard, endLb, onEnd }) {
	const known = tireTable(size);
	const [truckSize, setTruckSize] = (0, import_react.useState)("LT225/75R16");
	const [truckTyped, setTruckTyped] = (0, import_react.useState)(false);
	const [truckEnd, setTruckEnd] = (0, import_react.useState)("");
	const [typedLb, setTypedLb] = (0, import_react.useState)("");
	const [typedPsi, setTypedPsi] = (0, import_react.useState)("");
	const [truckLb, setTruckLb] = (0, import_react.useState)("");
	const [truckPsi, setTruckPsi] = (0, import_react.useState)("");
	const pounds = (value) => value.replace(/[^\d]/g, "").slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 space-y-3 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-ink",
				children: "Cold pressure for this load"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: known ? `${size}. ${known.source} Same pressure on both sides of the axle. The placard still wins if it disagrees.` : `${size}. No published row is stored for this size. Type the row from the tire maker’s chart. Same pressure on both sides. The placard still wins.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: "axle-end",
				children: "Heavier axle end (lb)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "axle-end",
				inputMode: "numeric",
				value: endLb,
				onChange: (e) => onEnd(pounds(e.target.value)),
				className: `${field} tabular-nums`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "One side of one axle. The trailer number on a scale ticket is both sides together, so it is not this box. Save on this phone keeps it."
			}),
			known ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableResult, {
				size,
				endLb,
				placard
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedResult, {
				endLb,
				typedLb,
				typedPsi,
				placard,
				onLb: setTypedLb,
				onPsi: setTypedPsi
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-ink",
						children: "Tow vehicle tires"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-2 block text-sm font-semibold text-ink",
						htmlFor: "truck-tire",
						children: "Size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "truck-tire",
						value: truckTyped ? "typed" : truckSize,
						onChange: (e) => {
							if (e.target.value === "typed") setTruckTyped(true);
							else {
								setTruckTyped(false);
								setTruckSize(e.target.value);
							}
						},
						className: field,
						children: [TIRE_TABLES.map((table) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: table.size,
							children: table.size
						}, table.size)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "typed",
							children: "Type a row"
						})]
					}),
					truckTyped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedResult, {
						endLb: truckEnd,
						typedLb: truckLb,
						typedPsi: truckPsi,
						placard: "",
						onLb: setTruckLb,
						onPsi: setTruckPsi,
						truck: true,
						onEnd: setTruckEnd
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block text-sm font-semibold text-ink",
							htmlFor: "truck-end",
							children: "Heavier axle end (lb)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "truck-end",
							inputMode: "numeric",
							value: truckEnd,
							onChange: (e) => setTruckEnd(pounds(e.target.value)),
							className: `${field} tabular-nums`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableResult, {
							size: truckSize,
							endLb: truckEnd,
							placard: ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "The placard on the truck still wins if it disagrees. This is not saved with the trailer."
						})
					] })
				]
			})
		]
	});
}
function TableResult({ size, endLb, placard }) {
	if (!endLb) return null;
	const found = coldForLoad(size, Number(endLb));
	if (found === "empty") return null;
	if (found === "over") {
		const table = tireTable(size);
		const last = table?.rows[table.rows.length - 1];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm font-semibold text-ink",
			children: [
				"That load is over the last published row",
				last ? `, ${last.lb.toLocaleString()} lb at ${last.psi} psi` : "",
				". This table does not go higher."
			]
		});
	}
	const placardPsi = placard ? Number(placard) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-sm text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"Minimum cold pressure for that load is ",
			found.psi,
			" psi. That row carries ",
			found.carries.toLocaleString(),
			" lb. Use ",
			found.psi,
			" psi on both sides."
		] }), placardPsi && placardPsi !== found.psi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 font-semibold",
			children: [
				"The placard says ",
				placardPsi,
				" psi. Use the placard."
			]
		}) : null]
	});
}
function TypedResult({ endLb, typedLb, typedPsi, placard, onLb, onPsi, truck, onEnd }) {
	const pounds = (value) => value.replace(/[^\d]/g, "").slice(0, 5);
	const psi = (value) => value.replace(/[^\d]/g, "").slice(0, 3);
	const placardPsi = placard ? Number(placard) : null;
	const typed = typedLb && typedPsi ? Number(typedPsi) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			truck ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: "truck-typed-end",
				children: "Heavier axle end (lb)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "truck-typed-end",
				inputMode: "numeric",
				value: endLb,
				onChange: (e) => onEnd?.(pounds(e.target.value)),
				className: `${field} tabular-nums`
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: truck ? "truck-row-lb" : "row-lb",
				children: "Pounds that row carries"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: truck ? "truck-row-lb" : "row-lb",
				inputMode: "numeric",
				value: typedLb,
				onChange: (e) => onLb(pounds(e.target.value)),
				className: `${field} tabular-nums`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: truck ? "truck-row-psi" : "row-psi",
				children: "Cold psi on that row"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: truck ? "truck-row-psi" : "row-psi",
				inputMode: "numeric",
				value: typedPsi,
				onChange: (e) => onPsi(psi(e.target.value)),
				className: `${field} tabular-nums`
			}),
			typed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink",
				children: [
					"You typed ",
					typed,
					" psi for a row that carries ",
					Number(typedLb).toLocaleString(),
					" lb. Use ",
					typed,
					" psi on both sides.",
					endLb && Number(endLb) > Number(typedLb) ? " The heavier end is over that row. Do not use it." : "",
					placardPsi && placardPsi !== typed ? ` The placard says ${placardPsi} psi. Use the placard.` : "",
					truck ? " The placard on the truck still wins if it disagrees." : ""
				]
			}) : null
		]
	});
}
function PhotoRow({ photo, label, busy, onPick, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold text-ink",
			children: label
		}),
		photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { photo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRemove,
				className: "min-h-11 text-sm font-semibold text-stop",
				children: "Remove"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-1 flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent",
			children: [busy ? "Saving…" : photo ? "Replace photo" : "Add a photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "sr-only",
				onChange: (e) => {
					onPick(e.target.files?.[0]);
					e.target.value = "";
				}
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Stays on this phone. It is not uploaded, and nothing is read off it."
		})
	] });
}
function CheckRow({ check, placard, onRemove }) {
	const low = new Set(lowWheels(placard, check));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: formatWhen(check.on)
			}),
			check.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: check.note }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1",
				children: WHEELS.filter((wheel) => check.psi[wheel.id]).map((wheel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					wheel.label,
					" ",
					check.psi[wheel.id],
					" psi",
					placard ? ` · placard ${placard}` : "",
					low.has(wheel.id) ? " · more than 20% under. That tire comes off for a cage inspection." : ""
				] }, wheel.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRemove,
				className: "mt-1 min-h-11 text-sm font-semibold text-stop",
				children: "Remove"
			})
		]
	});
}
//#endregion
export { TiresView };
