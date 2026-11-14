import { i as __toESM } from "../_runtime.mjs";
import { n as tasks, r as unsetScheduleCopy, t as cadenceLabel } from "./schedule-AmHNloLy.mjs";
import { b as procedureFits, l as coachYear, m as modelById, y as procedureBanner } from "./checklists-CYZuG9Db.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as pickNextTask, B as retorqueWatch, C as jobMark, D as oldestTire, E as nextDue, F as prepareFile, G as soonWhy, I as putFile, T as maintainBand, U as serviceWindow, Z as todayIso, b as formatWhen, g as dueWhy, h as dueOf, l as calendarDate, m as deleteFile, tt as useApp, x as getFile } from "./store-DUUzfVvp.mjs";
import { D as ClipboardList, j as Check, k as ChevronRight, y as ListChecks } from "../_libs/lucide-react.mjs";
import { a as Btn, c as Kicker, d as Pill, l as Notice, o as Card, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { s as useBackLayer } from "./routes-xIOD81ex.mjs";
import { t as procedureById } from "./procedures-C_lIH_E1.mjs";
import { n as textHasWords, r as wordsOf } from "./words-CD5GbNH1.mjs";
import { CoachRecordLinks } from "./records-view-CUPClNZf.mjs";
import { t as StepMark } from "./step-mark-BUUGaPLO.mjs";
import { t as ScopedCopy } from "./scoped-copy-Cx2pNeOk.mjs";
import { AlsoInBook } from "./figure-view-mnLYDqBf.mjs";
import { jumpsForProcedure } from "./graph-1nw5qE5R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/care-view-DPIUVDgW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
/** The next calendar date for each job that has one. Mile-only jobs and lug checks are left out. No repeats. */
function datedJobs(rows, done) {
	const jobs = [];
	for (const row of rows) {
		if (row.cadence.type === "trip") continue;
		if (row.cadence.type === "miles" && !row.cadence.alsoDays) continue;
		const date = calendarDate(row.cadence, done[row.id]);
		if (!date || date < "1970-01-01") continue;
		jobs.push({
			id: row.id,
			title: row.title,
			date,
			miles: row.cadence.type === "miles"
		});
	}
	jobs.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
	return jobs;
}
function icsText(value) {
	return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function nextDay(iso) {
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	date.setUTCDate(date.getUTCDate() + 1);
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const d = String(date.getUTCDate()).padStart(2, "0");
	return `${date.getUTCFullYear()}${m}${d}`;
}
function foldLine(line) {
	const width = (text) => new TextEncoder().encode(text).length;
	if (width(line) <= 75) return line;
	const chars = [...line];
	const parts = [];
	let index = 0;
	let first = true;
	while (index < chars.length) {
		let size = first ? 0 : 1;
		let next = index;
		while (next < chars.length && size + width(chars[next]) <= 75) {
			size += width(chars[next]);
			next += 1;
		}
		if (next === index) next = index + 1;
		const piece = chars.slice(index, next).join("");
		parts.push(first ? piece : ` ${piece}`);
		first = false;
		index = next;
	}
	return parts.join("\r\n");
}
/** One all-day event per date. The file is rebuilt from the current marks, so it has no repeating rule. */
function icsFor(jobs, stamp) {
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//RivetCare//EN",
		"CALSCALE:GREGORIAN"
	];
	for (const job of jobs) {
		const day = job.date.replace(/-/g, "");
		const description = `RivetCare. This date does not repeat. Mark the job done, then save a new file. Delete older RivetCare events on the phone.${job.miles ? " The mile interval is not on this calendar." : ""}`;
		lines.push("BEGIN:VEVENT", `UID:rivetcare-${job.id}-${day}@rivetcare`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDay(job.date)}`, `SUMMARY:${icsText(job.title)}`, `DESCRIPTION:${icsText(description)}`, "END:VEVENT");
	}
	lines.push("END:VCALENDAR");
	return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
function digitsOf(value) {
	return value.replace(/[^\d]/g, "").slice(0, 7);
}
function useKeyboardInset() {
	const [inset, setInset] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const vv = window.visualViewport;
		if (!vv) return;
		const update = () => {
			const covered = window.innerHeight - vv.height - vv.offsetTop;
			setInset(covered > 80 ? covered : 0);
		};
		update();
		vv.addEventListener("resize", update);
		vv.addEventListener("scroll", update);
		return () => {
			vv.removeEventListener("resize", update);
			vv.removeEventListener("scroll", update);
		};
	}, []);
	return inset;
}
function MilesCard({ onNavy = false, quiet = false, bare = false }) {
	const odo = useApp((s) => s.odometer);
	const setOdo = useApp((s) => s.setOdo);
	const addTripMiles = useApp((s) => s.addTripMiles);
	const flash = useApp((s) => s.flash);
	const [mode, setMode] = (0, import_react.useState)(null);
	const [digits, setDigits] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const inset = useKeyboardInset();
	useBackLayer(mode !== null, () => setMode(null));
	const tripId = (0, import_react.useId)();
	const noteId = (0, import_react.useId)();
	const totalId = (0, import_react.useId)();
	function open(next) {
		setMode((current) => current === next ? null : next);
		setDigits(next === "total" && odo > 0 ? String(odo) : "");
		setNote("");
	}
	function addTrip(e) {
		e.preventDefault();
		const n = Number(digits);
		if (!digits || !Number.isFinite(n) || n <= 0) {
			flash("Enter the miles for this trip");
			return;
		}
		addTripMiles(n, note);
		if (n <= 5e3) {
			setMode(null);
			setDigits("");
			setNote("");
		}
	}
	function saveTotal(e) {
		e.preventDefault();
		if (!digits) {
			flash("Enter the lifetime miles");
			return;
		}
		if (!setOdo(Number(digits))) return;
		flash("Reading saved");
		setMode(null);
		setDigits("");
	}
	const label = onNavy ? "text-on-navy/80" : "text-muted";
	const figure = onNavy ? "text-on-navy" : "text-ink";
	const fillBtn = onNavy ? "bg-sheet text-accent" : "";
	const body = quiet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => open("total"),
					className: "min-h-11 min-w-0 flex-1 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `block text-[13px] font-semibold uppercase tracking-wider ${label}`,
						children: "Trailer miles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `block text-lg font-semibold tabular-nums leading-tight ${figure}`,
						children: odo > 0 ? `${odo.toLocaleString()} mi` : "Add miles"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `min-h-11 shrink-0 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`,
					"aria-expanded": mode === "trip",
					onClick: () => open("trip"),
					children: "Add trip miles"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center px-3 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`,
					"aria-label": "Set trailer miles",
					"aria-expanded": mode === "total",
					onClick: () => open("total"),
					children: "Set miles"
				})
			]
		}),
		mode === "trip" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-2 space-y-2",
			onSubmit: addTrip,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: `block text-xs font-semibold uppercase tracking-wider ${label}`,
					htmlFor: tripId,
					children: "Miles this trip"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: tripId,
					inputMode: "numeric",
					autoFocus: true,
					value: digits,
					onChange: (e) => setDigits(digitsOf(e.target.value)),
					placeholder: "180",
					className: "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink tabular-nums"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: `block text-xs font-semibold uppercase tracking-wider ${label}`,
					htmlFor: noteId,
					children: "Note, optional"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: noteId,
					value: note,
					maxLength: 80,
					onChange: (e) => setNote(e.target.value),
					placeholder: "Denver to Moab",
					className: "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
				}),
				odo <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-sm ${label}`,
					children: "This starts the total. Use Set miles if the trailer already has miles."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					type: "submit",
					className: `w-full ${fillBtn}`,
					children: "Add to the total"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(null),
					className: `min-h-12 w-full text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`,
					children: "Back"
				})
			]
		}),
		mode === "total" && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-end justify-center bg-inverse/40",
			role: "presentation",
			onClick: () => setMode(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "w-full max-w-lg rounded-t-3xl bg-sheet px-4 pt-4",
				style: {
					marginBottom: inset,
					paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))"
				},
				onSubmit: saveTotal,
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Trailer miles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-sm font-semibold text-ink",
						htmlFor: totalId,
						children: "Lifetime miles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: totalId,
						inputMode: "numeric",
						autoFocus: true,
						value: digits,
						onChange: (e) => setDigits(digitsOf(e.target.value)),
						placeholder: odo > 0 ? String(odo) : "12400",
						className: "mt-2 min-h-12 w-full rounded-full border border-line bg-paper px-4 text-base text-ink tabular-nums"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Replaces the total. It does not add a trip."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						type: "submit",
						className: "mt-3 w-full",
						children: "Save the reading"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setMode(null),
						className: "mt-1 min-h-12 w-full text-sm font-semibold text-accent",
						children: "Back"
					})
				]
			})
		}), document.body)
	] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		onNavy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-wider text-on-navy/70",
			children: "Trailer miles"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Trailer miles" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => open("total"),
			className: `mt-1 block text-left font-sans text-4xl font-semibold tabular-nums ${figure}`,
			children: odo > 0 ? odo.toLocaleString() : "Add miles"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `min-h-11 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`,
				"aria-expanded": mode === "trip",
				onClick: () => open("trip"),
				children: "Add a trip"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `min-h-11 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`,
				"aria-expanded": mode === "total",
				onClick: () => open("total"),
				children: "Set total"
			})]
		})
	] });
	if (onNavy || bare) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: body });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: quiet ? "px-4 py-3" : "p-4",
		children: body
	});
}
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function monthCells(year, month) {
	const start = new Date(year, month, 1).getDay();
	const count = new Date(year, month + 1, 0).getDate();
	const cells = [];
	for (let i = 0; i < start; i += 1) cells.push(null);
	for (let day = 1; day <= count; day += 1) cells.push(day);
	return cells;
}
function DayPicker({ iso, onPick }) {
	const today = todayIso();
	const [cursor, setCursor] = (0, import_react.useState)((iso || today).slice(0, 7));
	const [year, month] = cursor.split("-").map(Number);
	const cells = monthCells(year, month - 1);
	function shift(by) {
		const next = new Date(year, month - 1 + by, 1);
		const stamp = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
		if (stamp > today.slice(0, 7)) return;
		if (next.getFullYear() < (/* @__PURE__ */ new Date()).getFullYear() - 40) return;
		setCursor(stamp);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 rounded-[18px] border border-line bg-paper p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => shift(-1),
						className: "min-h-11 min-w-11 text-sm font-semibold text-ink",
						"aria-label": "Previous month",
						children: "Prev"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-ink",
						children: [
							MONTHS[month - 1],
							" ",
							year
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => shift(1),
						className: "min-h-11 min-w-11 text-sm font-semibold text-ink",
						"aria-label": "Next month",
						children: "Next"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted",
				children: [
					"S",
					"M",
					"T",
					"W",
					"T",
					"F",
					"S"
				].map((day, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day }, `${day}${index}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-7 gap-1",
				children: cells.map((day, index) => {
					if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, `e${index}`);
					const stamp = `${cursor}-${String(day).padStart(2, "0")}`;
					const ahead = stamp > today;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: ahead,
						onClick: () => onPick(stamp),
						className: `min-h-11 rounded-full text-sm font-semibold ${stamp === iso ? "bg-navy text-on-navy" : ahead ? "text-muted" : "text-ink"}`,
						children: day
					}, stamp);
				})
			})
		]
	});
}
/** One date for every maintenance job that does not have one yet. */
function StartAllDates({ onSeparate, title, detail }) {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(null);
	const ids = tasks.filter((task) => {
		if (task.fit === "classic" && !model.alde && model.family !== "Other") return false;
		if (task.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
		if (task.procedureId && !procedureFits(task.procedureId, model, year)) return false;
		return dueOf(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "unset";
	}).map((task) => task.id);
	const count = ids.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-expanded": open,
				onClick: () => {
					setPending(null);
					setOpen((value) => !value);
				},
				className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
				children: "Set one date for all"
			}), onSeparate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onSeparate,
				className: "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink",
				children: "Set them separately"
			}) : null]
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
			iso: pending ?? void 0,
			onPick: (stamp) => setPending(stamp)
		}) : null,
		open && pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-semibold text-ink",
				children: [
					"Start ",
					count,
					" ",
					count === 1 ? "job" : "jobs",
					" on ",
					formatWhen(pending),
					"?"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						useApp.getState().setStartDates(ids, pending);
						setPending(null);
						setOpen(false);
					},
					className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					children: "Start"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPending(null),
					className: "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink",
					children: "Not now"
				})]
			})]
		}) : null,
		title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-4 font-display text-[1.35rem] leading-tight text-ink",
			children: title
		}) : null,
		detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-ink",
			children: detail
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: count === 0 ? "Every dated job already has a start date." : count === 1 ? "1 job has no start date." : `${count} jobs have no start date.`
				}),
				" ",
				count === 0 ? "A new date does not replace one. Mile-only checks stay on the odometer." : "One date starts all of them. Each of those jobs gets a line in the service log. A job that already has a date stays as it is. Mile-only checks stay on the odometer."
			]
		})
	] });
}
var ORDER = [
	1,
	2,
	3,
	4,
	5,
	6
];
function LugWidget() {
	const [stage, setStage] = (0, import_react.useState)(0);
	const [done, setDone] = (0, import_react.useState)([]);
	const stages = [
		"20–25 ft-lb",
		"50–60 ft-lb",
		modelById(useApp((s) => s.modelId)).family === "Other" ? "Manual spec" : "110 aluminum / 100 spare"
	];
	const next = ORDER.find((n) => !done.includes(n));
	function tap(n) {
		if (n !== next) return;
		const now = [...done, n];
		if (now.length === 6) {
			if (stage < 2) {
				setStage(stage + 1);
				setDone([]);
			} else setDone(now);
		} else setDone(now);
	}
	const finished = stage === 2 && done.length === 6;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Star pattern" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-xl text-ink",
				children: finished ? "Final torque set" : `Stage ${stage + 1} · ${stages[stage]}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Tap the highlighted nut. Opposite nuts, then the next stage. Never an impact wrench for the last pass."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lug-ring mt-4",
				"aria-hidden": false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hub" }), ORDER.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `lug lug-${n} ${done.includes(n) ? "on" : ""} ${n === next && !finished ? "next" : ""}`,
					onClick: () => tap(n),
					"aria-label": `Lug ${n}`,
					children: n
				}, n))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "flex-1",
					onClick: () => {
						setStage(0);
						setDone([]);
					},
					children: "Reset"
				})
			})
		]
	});
}
var PRESETS = {
	normal: {
		label: "Normal",
		valves: [
			"open",
			"open",
			"open",
			"closed"
		],
		note: "Everyday use. Heat and hot water flow through the Alde."
	},
	bypass: {
		label: "Bypass",
		valves: [
			"closed",
			"closed",
			"closed",
			"open"
		],
		note: "Before air or antifreeze. The Alde is isolated."
	},
	drain: {
		label: "Drain",
		valves: [
			"open",
			"open",
			"open",
			"open"
		],
		note: "All valves open to empty the lines."
	},
	blow: {
		label: "Blow out",
		valves: [
			"closed",
			"closed",
			"ask",
			"ask"
		],
		note: "The manual says close 1 and 2. Confirm 3 and 4 on the tag in your coach before you add air."
	}
};
function ValveWidget() {
	const [key, setKey] = (0, import_react.useState)("normal");
	const preset = PRESETS[key];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Classic manifold" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "2027 Classic 28RB, 30RB, and 33FB. Match the numbers on your valve tag."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: Object.keys(PRESETS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setKey(k),
					className: `min-h-11 rounded-full text-sm font-semibold ${key === k ? "bg-navy text-on-navy" : "border border-line bg-paper text-ink"}`,
					children: PRESETS[k].label
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid grid-cols-4 gap-2",
				children: preset.valves.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-paper px-1 py-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg text-ink",
						children: i + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-semibold ${v === "open" ? "text-ok" : v === "closed" ? "text-blue" : "text-caution"}`,
						children: v === "ask" ? "See tag" : v === "open" ? "Open" : "Closed"
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink",
				children: preset.note
			})
		]
	});
}
function DotWidget() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "DOT date code" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "The last four digits are the build week and year. Replace the tire at 5 years, even with tread left."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl bg-inverse px-4 py-5 text-on-navy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl tracking-wide",
					children: "DOT ··· ···· ··· 26 23"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-on-navy/80",
					children: "Example 2623 = week 26 of 2023. That tire is due in 2028."
				})]
			})
		]
	});
}
function fitsTask(fit, model) {
	if (fit === "classic" && !model.alde && model.family !== "Other") return false;
	if (fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
	return true;
}
function CareView() {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	const logFull = useApp((s) => s.log.length) >= 200;
	const push = useApp((s) => s.push);
	const wheelOff = useApp((s) => s.wheelOff);
	const lugAck = useApp((s) => s.lugAck);
	const [band, setBand] = (0, import_react.useState)("dash");
	const [q, setQ] = (0, import_react.useState)("");
	const watch = (0, import_react.useMemo)(() => {
		const mine = tasks.filter((t) => {
			if (!fitsTask(t.fit, model)) return false;
			if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
			return true;
		});
		return {
			overdue: mine.filter((t) => dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "due").length,
			soon: mine.filter((t) => {
				const where = maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
				return where === "days" || where === "miles";
			}).length,
			trip: mine.filter((t) => dueOf(t.cadence, done[t.id], odo) === "trip").length,
			unset: mine.filter((t) => dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "unset").length
		};
	}, [
		model,
		year,
		done,
		odo,
		tires
	]);
	const mine = tasks.filter((t) => fitsTask(t.fit, model) && (!t.procedureId || procedureFits(t.procedureId, model, year)));
	const lug = retorqueWatch(wheelOff, odo, Boolean(done.retorque), lugAck);
	const retorqueOn = lug.upcoming.length > 0 || lug.missed.length > 0;
	const rows = (0, import_react.useMemo)(() => {
		const words = wordsOf(q);
		return tasks.filter((t) => {
			if (!fitsTask(t.fit, model)) return false;
			if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
			const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
			if (band === "due" && state !== "due" && maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) !== "days" && maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) !== "miles" && !(t.id === "retorque" && retorqueOn)) return false;
			if (band === "unset" && state !== "unset") return false;
			if (band === "trip" && (state !== "trip" || t.id === "retorque" && retorqueOn)) return false;
			if (!words.length) return true;
			const proc = t.procedureId ? procedureById(t.procedureId)?.title ?? "" : "";
			return textHasWords(`${t.title} ${t.system} ${t.detail} ${cadenceLabel(t.cadence)} ${proc}`, words);
		});
	}, [
		model,
		year,
		done,
		odo,
		tires,
		band,
		q,
		retorqueOn
	]);
	const picked = pickNextTask(mine.map((t) => ({
		id: t.id,
		cadence: t.cadence,
		mark: jobMark(t.id, done[t.id], tires, odo)
	})), odo);
	const hero = (picked && picked.why !== "next" ? mine.find((t) => t.id === picked.id) ?? null : null) ?? (retorqueOn ? mine.find((t) => t.id === "retorque") ?? null : null);
	const trips = mine.filter((t) => t.cadence.type === "trip" && t.id !== hero?.id);
	const groups = {
		overdue: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "overdue" && t.id !== hero?.id),
		days: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "days" && t.id !== hero?.id),
		miles: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "miles" && t.id !== hero?.id),
		recent: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "recent"),
		none: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "none"),
		later: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "later")
	};
	const showList = band !== "dash" || q.trim().length > 0;
	const dueCount = watch.overdue + watch.soon + (retorqueOn ? 1 : 0);
	const tripCount = Math.max(0, watch.trip - (retorqueOn ? 1 : 0));
	const unestablished = !picked && !retorqueOn && watch.unset > 0;
	const unsetCopy = unestablished ? unsetScheduleCopy(watch.unset) : null;
	async function addDates() {
		const jobs = datedJobs(mine.map((task) => ({
			id: task.id,
			title: task.title,
			cadence: task.cadence
		})), Object.fromEntries(mine.map((task) => [task.id, jobMark(task.id, done[task.id], tires, odo)])));
		if (!jobs.length) {
			useApp.getState().flash("No dated jobs yet. Mile checks are not on the calendar.");
			return;
		}
		const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
		const file = new File([icsFor(jobs, stamp)], "rivetcare-dates.ics", { type: "text/calendar" });
		const can = navigator.canShare?.({ files: [file] }) ?? false;
		if (navigator.share && can) try {
			await navigator.share({
				files: [file],
				title: "rivetcare-dates.ics"
			});
			return;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
		}
		const url = URL.createObjectURL(file);
		const a = document.createElement("a");
		a.href = url;
		a.download = "rivetcare-dates.ics";
		a.rel = "noopener";
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		logFull ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold text-ink",
			children: "The service log is full at 200. Marking a job done removes the oldest entry and its photos. Undo puts that entry back."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MilesCard, {
			bare: true,
			quiet: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4",
			role: "group",
			"aria-label": "Which jobs",
			children: [
				["due", dueCount === 1 ? "Due 1 task" : `Due ${dueCount} tasks`],
				["trip", tripCount === 1 ? "Every trip 1 task" : `Every trip ${tripCount} tasks`],
				["unset", `Needs a date ${watch.unset}`]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": band === id,
				onClick: () => setBand(band === id ? "dash" : id),
				className: `inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 text-sm font-semibold ${band === id ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "sr-only",
			htmlFor: "care-search",
			children: "Search maintenance"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "care-search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Tires, bearings, winterize…",
			inputMode: "search",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: false,
			className: "mt-3 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void addDates(),
			className: "mt-3 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink",
			children: "Add dates to Calendar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "One date each, from the last time you marked the job. Nothing repeats. Mile checks and lug re-torque are left out. Delete older RivetCare events on the phone before you add this file."
		}),
		band === "due" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Due is overdue, plus the last 30 days or the last 500 miles of a longer interval. A monthly job stays off that list until it is due. This is not a new factory interval."
		}) : null,
		retorqueOn && hero?.id !== "retorque" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-3 text-sm font-semibold ${lug.upcoming.length ? "text-caution" : "text-signal"}`,
			children: lug.upcoming.length ? `Lug re-torque, ${lug.upcoming[0].left.toLocaleString()} mi left` : "Lug re-torque is past the 50 mile check"
		}) : null,
		showList ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareShortcuts, {}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: q.trim() ? "Nothing matches that search." : "Nothing in this filter."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, { task: t }) }, t.id))
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
					children: "Due now or soon"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
						task: hero,
						hero: true
					})
				})]
			}) : unsetCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartAllDates, {
					title: unsetCopy.title,
					detail: unsetCopy.body,
					onSeparate: () => setBand("unset")
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: ["Nothing is due.", watch.unset > 0 ? watch.unset === 1 ? " 1 item still needs a starting date, so it is not on this list." : ` ${watch.unset} items still need a starting date, so they are not on this list.` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareShortcuts, {}),
			trips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
					children: "Every trip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: trips.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripRow, { task: t }) }, t.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashList, {
				title: "Overdue",
				tasks: groups.overdue,
				empty: "Nothing is overdue.",
				hideEmpty: unestablished || hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "overdue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashList, {
				title: "Due within 30 days",
				tasks: groups.days,
				empty: "Nothing is due in the next 30 days.",
				compact: true,
				hideEmpty: unestablished || hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "days"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashList, {
				title: "Due within 500 miles",
				tasks: groups.miles,
				empty: "Nothing is due in the next 500 miles.",
				compact: true,
				hideEmpty: unestablished || hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "miles"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashList, {
				title: "Recently completed",
				tasks: groups.recent,
				empty: "Nothing was marked in the last 90 days.",
				compact: true,
				hideEmpty: unestablished
			}),
			!unestablished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashList, {
				title: "No maintenance history",
				tasks: groups.none,
				empty: "Every dated job has a start.",
				compact: true
			}) : null,
			groups.later.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-4 rounded-[18px] border border-line bg-sheet px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "min-h-11 cursor-pointer list-none font-semibold text-ink [&::-webkit-details-marker]:hidden",
					children: groups.later.length === 1 ? "1 later job" : `${groups.later.length} later jobs`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: groups.later.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, { task: t }) }, t.id))
				})]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 space-y-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachRecordLinks, {})
		}),
		watch.unset > 0 && !unestablished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 rounded-[18px] border border-line bg-sheet px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartAllDates, { onSeparate: () => setBand("unset") })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "min-h-14 w-full text-base",
				onClick: () => push({ name: "log" }),
				children: "A job that isn’t on this list"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
			className: "mt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
				className: "min-h-11 cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden",
				children: "How intervals work"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pb-2 text-sm text-muted",
				children: "Whichever comes first, miles or time. Factory intervals are the warranty minimum. A tighter dealer interval is a suggestion, not a new requirement. The odometer, the check marks, and the service log are stored only on this phone."
			})]
		})
	] });
}
function DoneDate({ taskId, iso, miles }) {
	const setDoneDate = useApp((s) => s.setDoneDate);
	const [open, setOpen] = (0, import_react.useState)(false);
	const label = iso ? `Last done ${formatWhen(iso)}` : "Set a start date for this job";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			className: "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-left text-base text-ink",
			children: [label, miles ? ` · ${miles.toLocaleString()} mi` : ""]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
			iso,
			onPick: (stamp) => {
				setDoneDate(taskId, stamp);
				setOpen(false);
			}
		}) : null]
	});
}
function TaskCard({ task, hero = false, nested = false }) {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const done = useApp((s) => s.done);
	const odo = useApp((s) => s.odometer);
	const markDone = useApp((s) => s.markDone);
	const clearDone = useApp((s) => s.clearDone);
	const push = useApp((s) => s.push);
	const wheelOff = useApp((s) => s.wheelOff);
	const lugAck = useApp((s) => s.lugAck);
	const startWheelOff = useApp((s) => s.startWheelOff);
	const tires = useApp((s) => s.tires);
	const stored = done[task.id];
	const mark = jobMark(task.id, stored, tires, odo);
	const oldest = task.id === "tires-replace" ? oldestTire(tires) : null;
	const state = dueOf(task.cadence, mark, odo);
	const soon = soonWhy(task.cadence, mark, odo);
	const lug = task.id === "retorque" ? retorqueWatch(wheelOff, odo, Boolean(mark), lugAck) : null;
	const stages = lug?.upcoming ?? [];
	const missed = lug?.missed ?? [];
	const either = task.cadence.type === "miles" && task.cadence.alsoDays;
	const traveled = lug?.start != null ? Math.max(0, odo - lug.start) : 0;
	const retorqueOpen = stages.length > 0 || missed.length > 0;
	const needsMark = state === "due" || state === "trip" || Boolean(lug?.current) || missed.length > 0;
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [nested ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: task.title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `text-ink ${hero ? "font-display text-[1.35rem] leading-tight" : "font-semibold"}`,
				children: task.title
			}), lug?.current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0 rounded-full bg-signal-soft px-2 py-1 text-sm font-semibold text-signal",
				children: [lug.current, " mi check"]
			}) : missed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 rounded-full bg-signal-soft px-2 py-1 text-sm font-semibold text-signal",
				children: "Past 50 mi"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: state === "due" ? "due" : soon ? "blue" : state === "ok" ? "sage" : state === "trip" ? "navy" : "line",
				children: state === "due" ? "Due" : soon ? "Soon" : state === "ok" ? "OK" : state === "trip" ? "Trip" : task.cadence.type === "miles" ? "No start" : "No date"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				task.system,
				" · ",
				cadenceLabel(task.cadence),
				either ? ", whichever comes first" : "",
				task.fit === "classic" ? " · Classic" : task.fit === "gt" ? " · Globetrotter" : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: task.detail
		}),
		task.id === "retorque" && retorqueOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [
				5,
				10,
				25,
				50
			].map((miles) => {
				const passed = lug?.current != null ? miles < lug.current : traveled >= miles;
				const current = lug?.current === miles;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `rounded-full px-3 py-1 text-sm font-semibold ${passed ? "bg-sage-soft text-ok" : current ? "bg-navy text-on-navy" : "border border-line text-muted"}`,
					children: [miles, " mi"]
				}, miles);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneDate, {
			taskId: task.id,
			iso: stored?.iso,
			miles: stored?.miles
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceFacts, { task }),
		task.id === "rotate" && tires.rotated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-ink",
			children: [
				"Last rotation ",
				formatWhen(tires.rotated),
				". Same side, front and rear."
			]
		}) : null,
		oldest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-ink",
			children: [
				oldest.id === "set" ? "One DOT for the set" : `Oldest tire: ${oldest.label}`,
				", DOT ",
				oldest.dot,
				", about ",
				Math.floor(oldest.years),
				" years. The 5-year replace follows this tire. Marking the job done does not move that date."
			]
		}) : null,
		soon && task.id !== "tires-replace" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm tabular-nums text-muted",
			children: soon
		}),
		(state === "due" || state === "unset" && task.cadence.type === "miles") && task.id !== "tires-replace" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm tabular-nums text-muted",
			children: dueWhy(task.cadence, mark, odo)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [
				needsMark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "px-3",
					onClick: () => markDone(task.id, task.title),
					children: task.id === "retorque" && lug?.current ? `Mark the ${lug.current} mi check done` : "Mark done today"
				}) : null,
				stored ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "px-3",
					onClick: () => clearDone(task.id),
					children: "Clear this mark"
				}) : null,
				task.procedureId && procedureFits(task.procedureId, model, year) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "px-3",
					onClick: () => push({
						name: "procedure",
						id: task.procedureId
					}),
					children: "How to"
				}),
				task.id === "retorque" && odo > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "px-3",
					onClick: startWheelOff,
					children: wheelOff !== null ? `Start again at ${odo.toLocaleString()} mi` : `Wheel came off at ${odo.toLocaleString()} mi`
				})
			]
		}),
		needsMark && task.cadence.type === "miles" && odo <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Set trailer miles before you mark this done. A zero-mile mark makes the next interval wrong."
		}),
		task.id === "retorque" && odo <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Set the odometer, then start the 5, 10, 25, and 50 mile countdown."
		}),
		task.id === "retorque" && lug?.start != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-ink",
			children: [
				"Counting from ",
				lug.start.toLocaleString(),
				" mi.",
				" ",
				stages.length ? stages.map((s) => `${s.miles} mi, ${s.left.toLocaleString()} left`).join(" · ") : "The 5, 10, 25, and 50 mile checks are past this reading.",
				missed.length && stages.length ? ` Earlier checks are past.` : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPhotos, {
			shotKey: `care:${task.id}`,
			label: "this job",
			folded: true,
			summary: "Receipt or photo"
		})
	] });
	if (nested) return body;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-4",
		children: body
	});
}
function ServiceFacts({ task }) {
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	const setDoneNote = useApp((s) => s.setDoneNote);
	const stored = done[task.id];
	const followed = jobMark(task.id, stored, tires, odo);
	const facts = serviceWindow(task.cadence, followed, odo);
	const recorded = task.id === "tires-replace" ? serviceWindow(task.cadence, stored, odo) : facts;
	const either = task.cadence.type === "miles" && Boolean(task.cadence.alsoDays);
	const [note, setNote] = (0, import_react.useState)(stored?.note ?? "");
	(0, import_react.useEffect)(() => {
		setNote(stored?.note ?? "");
	}, [stored?.note, task.id]);
	const rows = [
		recorded.lastDate || recorded.lastMiles ? ["Last completed", [recorded.lastDate, recorded.lastMiles].filter(Boolean).join(" · ")] : null,
		facts.nextDate ? ["Next due", facts.nextDate] : null,
		facts.nextMiles ? ["Next mileage", facts.nextMiles] : null
	].filter((row) => row !== null);
	if (!rows.length && !stored) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3 py-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-sm text-ink",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "text-right text-sm font-semibold tabular-nums text-ink",
					children: value
				})]
			}, label)) }),
			either && facts.nextDate && facts.nextMiles ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Whichever comes first. The interval is the one already on this job."
			}) : null,
			stored ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 block text-sm font-semibold text-ink",
				htmlFor: `done-note-${task.id}`,
				children: ["Completion note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `done-note-${task.id}`,
					value: note,
					maxLength: 200,
					onChange: (e) => setNote(e.target.value),
					onBlur: () => void setDoneNote(task.id, note),
					placeholder: "What was done, or the shop",
					className: "mt-1 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base font-normal text-ink"
				})]
			}) : null
		]
	});
}
function DashList({ title, tasks: list, empty, compact = false, hideEmpty = false }) {
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	if (!list.length && hideEmpty) return null;
	if (!list.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: empty
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: list.map((task) => compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "rounded-[18px] border border-line bg-sheet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-3 [&::-webkit-details-marker]:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 font-semibold text-ink",
						children: task.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashWhen, {
						cadence: task.cadence,
						mark: jobMark(task.id, done[task.id], tires, odo),
						odo
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
						task,
						nested: true
					})
				})]
			}) }, task.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, { task }) }, task.id))
		})]
	});
}
function DashWhen({ cadence, mark, odo }) {
	const facts = serviceWindow(cadence, mark, odo);
	const text = !mark && cadence.type === "miles" ? "No start" : facts.nextDate && facts.nextMiles ? `${facts.nextDate} · ${facts.nextMiles}` : facts.nextDate || facts.nextMiles || "No date";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "shrink-0 text-right text-sm tabular-nums text-muted",
		children: text
	});
}
var RECORD_GROUPS = [
	{
		title: "Bearing service",
		ids: ["rotate", "brakes-year"]
	},
	{
		title: "Brake inspection",
		ids: ["brakes-year", "breakaway"]
	},
	{
		title: "Sealant inspections",
		ids: ["sealant", "belly"]
	},
	{
		title: "Battery work",
		ids: ["house-year"]
	},
	{
		title: "Tire work",
		ids: [
			"rotate",
			"tires-replace",
			"tires-cold",
			"retorque"
		]
	},
	{
		title: "Appliance servicing",
		ids: [
			"anode",
			"descale-year",
			"furnace-season",
			"ac-filter",
			"glycol-level",
			"air-cushion",
			"glycol-swap",
			"lp-year"
		]
	},
	{
		title: "Warranty repairs",
		ids: [],
		warranty: true
	}
];
function CareShortcuts() {
	const push = useApp((s) => s.push);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => push({ name: "procedures" }),
			className: "flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-ink",
						children: "Procedures"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm text-muted",
						children: "Winterize, bearings, brakes, sealant"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-5 shrink-0 text-muted",
					"aria-hidden": true
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnershipRecord, {})]
	});
}
function OwnershipRecord() {
	const log = useApp((s) => s.log);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded-[18px] border border-line bg-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold text-ink",
					children: "Ownership record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm text-muted",
					children: "What was written down for a buyer"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Marks and log lines already on this phone. A buyer can read what was recorded. It is not a factory history, and an empty group means nothing was written down."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-4",
				children: RECORD_GROUPS.map((group) => {
					const rows = log.filter((entry) => {
						if (group.warranty) return /warranty/i.test(`${entry.job ?? ""} ${entry.note}`);
						return entry.taskId ? group.ids.includes(entry.taskId) : false;
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-ink",
						children: group.title
					}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "None recorded."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1",
						children: rows.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 text-sm text-ink",
								children: entry.job || entry.note
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-right text-sm tabular-nums text-muted",
								children: [formatWhen(entry.iso), entry.miles > 0 ? ` · ${entry.miles.toLocaleString()} mi` : ""]
							})]
						}, `${group.title}-${entry.id}`))
					})] }, group.title);
				})
			})]
		})]
	});
}
function TripRow({ task }) {
	const markedToday = useApp((s) => s.done)[task.id]?.iso === todayIso();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "rounded-[18px] border border-line bg-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 [&::-webkit-details-marker]:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid size-6 shrink-0 place-items-center rounded-full border ${markedToday ? "border-sage bg-sage text-on-navy" : "border-line text-transparent"}`,
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 font-semibold text-ink",
				children: task.title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-1 pb-3 pt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
				task,
				nested: true
			})
		})]
	});
}
function ProcedureView({ id }) {
	const p = procedureById(id);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (id !== "winterize") return;
		const trail = useApp.getState().winterPlace?.trail ?? [];
		useApp.getState().setWinterPlace({
			page: "procedure",
			trail
		});
	}, [id]);
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "That procedure is not in this edition."
	});
	const banner = procedureBanner(id, model, year);
	const linked = tasks.filter((t) => t.procedureId === id && fitsTask(t.fit, model) && procedureFits(id, model, year));
	const words = wordsOf(q);
	const steps = p.steps.map((step, index) => ({
		step,
		index
	})).filter(({ step }) => !words.length || textHasWords(`${step.title} ${step.body}`, words));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: p.system }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
					className: "mt-1 font-display text-3xl text-ink",
					children: p.title
				}),
				p.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-ink",
					children: ["Source: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
						text: p.source,
						year
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Factory specification and owner notes are marked in the steps. The model-year manual governs."
				}),
				p.revised ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Last checked ",
						p.revised,
						". Not a factory revision date."
					]
				}) : null
			] }),
			banner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-4 text-sm text-ink",
				children: banner
			}),
			linked.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 text-sm text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Miles and time"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-3",
					children: linked.map((t) => {
						const mark = jobMark(t.id, done[t.id], tires, odo);
						const next = nextDue(t.cadence, mark, odo);
						const either = t.cadence.type === "miles" && t.cadence.alsoDays;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [cadenceLabel(t.cadence), either ? ", whichever comes first" : ""]
							}),
							mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "tabular-nums text-muted",
								children: [
									"Last ",
									formatWhen(mark.iso),
									mark.miles ? ` · ${mark.miles.toLocaleString()} mi` : ""
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "Not marked yet."
							}),
							next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "tabular-nums",
								children: next
							}) : null
						] }, t.id);
					})
				})]
			}),
			p.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "caution",
				title: "Caution",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
					text: p.caution,
					year
				})
			}),
			p.tools && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-ink",
					children: "Tools. "
				}), p.tools]
			}),
			p.widget === "lugs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LugWidget, {}),
			p.widget === "valves" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValveWidget, {}),
			p.widget === "dot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DotWidget, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "min-h-11 text-sm font-semibold text-accent",
				onClick: () => {
					const text = `Possible error in “${p.title}.” ${p.revised ? `Last checked ${p.revised}. ` : ""}Write what disagrees with the manual or the plate. This note stays on the phone.`;
					Promise.resolve(useApp.getState().addNote(text)).then((ok) => {
						useApp.getState().flash(ok === false ? "Could not save that note." : "Saved in notes. Nothing is sent.");
					});
				},
				children: "Report an error in this procedure"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: "step-search",
				children: "Search these steps"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "step-search",
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "A step, a tool, or a part",
				inputMode: "search",
				autoCapitalize: "off",
				autoCorrect: "off",
				spellCheck: false,
				className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
			})] }),
			steps.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No step matches that."
			}),
			steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3",
				children: steps.map(({ step, index }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-card border border-line bg-sheet p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted",
							children: ["Step ", index + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold text-ink",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
								text: step.body,
								year
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepMark, { text: `${step.title} ${step.body}` })
					]
				}, step.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPhotos, {
				shotKey: `procedure:${id}`,
				label: "this procedure"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlsoInBook, { items: jumpsForProcedure(id) })
		]
	});
}
function ShotThumb({ file, onRemove }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		let object = "";
		getFile(file.id).then((blob) => {
			if (!blob || !live) return;
			object = URL.createObjectURL(blob);
			setUrl(object);
		});
		return () => {
			live = false;
			if (object) URL.revokeObjectURL(object);
		};
	}, [file.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "relative shrink-0",
		children: [url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: "",
			className: "h-16 w-16 rounded-lg object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-16 w-16 place-items-center rounded-lg bg-paper text-xs text-muted",
			children: "Photo"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onRemove,
			className: "mt-1 block min-h-11 text-sm font-semibold text-stop",
			children: "Remove"
		})]
	});
}
var noShots = [];
function SectionPhotos({ shotKey, label, folded = false, summary = "Photos" }) {
	const shots = useApp((s) => s.shots[shotKey] ?? noShots);
	const addShot = useApp((s) => s.addShot);
	const removeShot = useApp((s) => s.removeShot);
	const flash = useApp((s) => s.flash);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(list) {
		const file = list?.[0];
		if (!file) return;
		setBusy(true);
		try {
			const prepared = await prepareFile(file);
			if (!prepared.mime.startsWith("image/")) {
				flash("This section takes a photo, not a PDF.");
				return;
			}
			const id = crypto.randomUUID();
			await putFile(id, prepared.blob);
			if (!await Promise.resolve(addShot(shotKey, {
				id,
				name: prepared.name,
				mime: prepared.mime
			}))) deleteFile(id);
		} catch (err) {
			const heic = err instanceof Error && err.message === "heic";
			flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
		} finally {
			setBusy(false);
		}
	}
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm font-semibold text-ink",
			children: ["Photos for ", label]
		}),
		shots.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 flex gap-2 overflow-x-auto",
			children: shots.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShotThumb, {
				file,
				onRemove: () => removeShot(shotKey, file.id)
			}, file.id))
		}),
		shots.length < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-1 flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent",
			children: [busy ? "Saving…" : "Add a photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "sr-only",
				onChange: (e) => {
					onFile(e.target.files);
					e.target.value = "";
				}
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "The photo stays on this phone with this section. It is not uploaded, and nothing is read off it. A backup file includes it."
		})
	] });
	if (!folded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3",
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "mt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "min-h-11 cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden",
			children: [summary, shots.length ? `, ${shots.length}` : ""]
		}), body]
	});
}
//#endregion
export { CareView, ProcedureView };
