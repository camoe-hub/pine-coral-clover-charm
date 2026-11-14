import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as useApp, y as formatWhen } from "./store-C3gr-Jyz.mjs";
import { f as Btn, m as Kicker } from "./routes-BL7pyKhp.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/notes-view-6lY_SS3M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotesView() {
	const modelId = useApp((s) => s.modelId);
	const notes = useApp((s) => s.notes);
	const addNote = useApp((s) => s.addNote);
	const updateNote = useApp((s) => s.updateNote);
	const removeNote = useApp((s) => s.removeNote);
	const flash = useApp((s) => s.flash);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editText, setEditText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setDraft("");
		setEditing(null);
		setEditText("");
	}, [modelId]);
	async function saveNew() {
		if (!draft.trim()) {
			flash("The note needs some text");
			return;
		}
		if (!await Promise.resolve(addNote(draft))) return;
		setDraft("");
		flash("Saved on this phone");
	}
	async function saveEdit(id) {
		if (!await Promise.resolve(updateNote(id, editText))) return;
		setEditing(null);
		setEditText("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "This trailer" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Notes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Reminders for this trailer. They are not service records, and they stay on this phone with the log."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 block",
			htmlFor: "personal-note",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "New note"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: "personal-note",
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				maxLength: 2e3,
				rows: 4,
				placeholder: "Where the spare key is, a dealer promise, a noise to watch",
				className: "min-h-28 w-full rounded-card border border-line bg-sheet px-4 py-3 text-base"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "mt-3 w-full",
			onClick: saveNew,
			children: "Save note"
		}),
		notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Add a reminder, such as where the spare key is or a noise to watch."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3",
			children: notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-rule bg-sheet px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted",
						children: formatWhen(note.iso)
					}),
					editing === note.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-2",
						onSubmit: (e) => {
							e.preventDefault();
							saveEdit(note.id);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: editText,
							onChange: (e) => setEditText(e.target.value),
							maxLength: 2e3,
							rows: 4,
							"aria-label": "Edit note",
							className: "min-h-28 w-full rounded-card border border-line bg-paper px-3 py-2 text-base"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								type: "submit",
								children: "Save"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								type: "button",
								variant: "line",
								onClick: () => {
									setEditing(null);
									setEditText("");
								},
								children: "Cancel"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 whitespace-pre-wrap break-words text-sm text-ink",
						children: note.text
					}),
					editing !== note.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 text-sm font-semibold text-accent",
							onClick: () => {
								setEditing(note.id);
								setEditText(note.text);
							},
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 text-sm font-semibold text-stop",
							onClick: () => removeNote(note.id),
							children: "Remove"
						})]
					})
				]
			}, note.id))
		})
	] });
}
//#endregion
export { NotesView };
