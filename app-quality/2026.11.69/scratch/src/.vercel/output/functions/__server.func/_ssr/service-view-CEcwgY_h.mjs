import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as useApp } from "./store-C3gr-Jyz.mjs";
import { f as Btn, m as Kicker } from "./routes-BL7pyKhp.mjs";
import { RANGES, nearestShops, shopsAt, typeLabel } from "./service-DKXVEeby.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/service-view-CEcwgY_h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "rivetcare-service";
var KINDS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "mobile",
		label: "Mobile"
	},
	{
		id: "shop",
		label: "Shops"
	}
];
function load() {
	if (typeof window === "undefined") return {
		zip: "",
		range: 100,
		kind: "all"
	};
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			zip: "",
			range: 100,
			kind: "all"
		};
		const saved = JSON.parse(raw);
		const range = RANGES.some((r) => r.id === saved.range) ? saved.range : 100;
		const kind = KINDS.some((k) => k.id === saved.kind) ? saved.kind : "all";
		return {
			zip: (saved.zip ?? "").replace(/\D/g, "").slice(0, 5),
			range,
			kind
		};
	} catch {
		return {
			zip: "",
			range: 100,
			kind: "all"
		};
	}
}
function ServiceView() {
	const initial = load();
	const [zip, setZip] = (0, import_react.useState)(initial.zip);
	const [range, setRange] = (0, import_react.useState)(initial.range);
	const [kind, setKind] = (0, import_react.useState)(initial.kind);
	const [hits, setHits] = (0, import_react.useState)(null);
	const [zipKnown, setZipKnown] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [here, setHere] = (0, import_react.useState)(null);
	const [locError, setLocError] = (0, import_react.useState)("");
	const [listError, setListError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		localStorage.setItem(KEY, JSON.stringify({
			zip,
			range,
			kind
		}));
	}, [
		zip,
		range,
		kind
	]);
	(0, import_react.useEffect)(() => {
		if (here) {
			let cancel = false;
			setBusy(true);
			setListError("");
			shopsAt(here.lat, here.lng, range, kind).then((found) => {
				if (cancel) return;
				setHits(found);
				setZipKnown(true);
				setBusy(false);
			}).catch(() => {
				if (cancel) return;
				setBusy(false);
				setHits(null);
				setListError("The ZIP list is not on this phone yet. Search once while you have a signal.");
			});
			return () => {
				cancel = true;
			};
		}
		if (zip.length !== 5) {
			setHits(null);
			setZipKnown(true);
			return;
		}
		let cancel = false;
		setBusy(true);
		setListError("");
		nearestShops(zip, range, kind).then((result) => {
			if (cancel) return;
			setHits(result.hits);
			setZipKnown(result.zipKnown);
			setBusy(false);
		}).catch(() => {
			if (cancel) return;
			setBusy(false);
			setHits(null);
			setListError("The ZIP list is not on this phone yet. Search once while you have a signal.");
		});
		return () => {
			cancel = true;
		};
	}, [
		zip,
		range,
		kind,
		here
	]);
	function useHere() {
		if (!navigator.geolocation) {
			setLocError("This phone cannot share a location. Enter a ZIP.");
			return;
		}
		setLocError("");
		setBusy(true);
		navigator.geolocation.getCurrentPosition((pos) => {
			setZip("");
			setHere({
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			});
		}, () => {
			setBusy(false);
			setLocError("Location was blocked. Enter a ZIP instead.");
		}, {
			enableHighAccuracy: false,
			timeout: 12e3,
			maximumAge: 3e5
		});
	}
	const rangeLabel = RANGES.find((r) => r.id === range)?.label ?? "100 miles";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Service and repair" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl text-ink",
					children: "Find a shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-base text-ink",
					children: "Dealers and independent shops near a ZIP."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedDealer, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				onClick: useHere,
				children: here ? "Using your location" : "Use my location"
			}),
			locError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-stop",
				role: "alert",
				children: locError
			}),
			listError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-stop",
				role: "alert",
				children: listError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted",
					htmlFor: "service-zip",
					children: "ZIP code"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "service-zip",
					inputMode: "numeric",
					autoComplete: "postal-code",
					maxLength: 5,
					value: zip,
					onChange: (e) => {
						setHere(null);
						setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
					},
					className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted",
					htmlFor: "service-range",
					children: "Distance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "service-range",
					value: String(range),
					onChange: (e) => {
						const next = e.target.value === "all" ? "all" : Number(e.target.value);
						setRange(next);
					},
					className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink",
					children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: String(r.id),
						children: r.label
					}, String(r.id)))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chip-row -mx-4 flex gap-2 overflow-x-auto px-4",
				role: "group",
				"aria-label": "Kind of service",
				children: KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": kind === item.id,
					onClick: () => setKind(item.id),
					className: `min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${kind === item.id ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
					children: item.label
				}, item.id))
			}),
			!busy && zip.length > 0 && zip.length < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: "Enter all 5 digits."
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: "Looking up that ZIP."
			}),
			!busy && zip.length === 0 && !here && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: "Enter a ZIP, or use your location. Nothing is listed until then."
			}),
			!busy && zip.length === 5 && !zipKnown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-stop",
				role: "alert",
				children: "That ZIP is not in the list."
			}),
			!busy && zipKnown && hits && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink",
				role: "status",
				children: [
					kind === "mobile" ? "No mobile tech" : kind === "shop" ? "No shop" : "Nothing",
					" within ",
					rangeLabel.toLowerCase(),
					". Try a wider range",
					kind !== "all" ? ", or choose All" : "",
					"."
				]
			}),
			hits && hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				role: "status",
				children: [
					hits.length,
					" ",
					kind === "mobile" ? hits.length === 1 ? "mobile tech" : "mobile techs" : hits.length === 1 ? "shop" : "shops",
					range === "all" ? " nationwide" : ` within ${rangeLabel.toLowerCase()}`,
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopCard, { hit }, `${hit.shop.name}-${hit.shop.postal}`))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: "Straight-line miles, not drive time. Verify before you go. Last checked 27 Oct 2026. A listing is not a visit. Dealers come from the Airstream locator. Independent shops and mobile techs are not factory dealers, and a listing is not a factory specification."
			})
		]
	});
}
function dealerMap(name, address) {
	const query = [name, address].map((part) => part.trim()).filter(Boolean).join(", ");
	return query ? `https://maps.apple.com/?q=${encodeURIComponent(query)}` : "";
}
function SavedDealer() {
	const dealer = useApp((s) => s.dealer);
	const address = useApp((s) => s.dealerAddress);
	const href = dealerMap(dealer, address);
	if (!href) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-3 text-sm text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: dealer.trim() || "Saved dealer"
			}),
			address.trim() ? ` · ${address.trim()}` : "",
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "font-semibold text-accent",
				href,
				target: "_blank",
				rel: "noreferrer",
				children: "Map"
			})
		]
	});
}
function mapHref(shop) {
	const query = [
		shop.name,
		shop.street,
		shop.city,
		shop.state,
		shop.postal
	].filter(Boolean).join(" ");
	return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}
function ShopCard({ hit }) {
	const { shop, miles } = hit;
	const phoneHref = shop.phone ? `tel:${shop.phone.replace(/[^\d+]/g, "")}` : "";
	const place = [shop.city, shop.state].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-card border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted",
				children: [
					typeLabel(shop.type),
					shop.certified ? " · Five Rivet" : "",
					miles != null ? ` · ${Math.round(miles)} mi` : " · no map point, call to confirm",
					shop.approx && miles != null ? " · placed at the ZIP center, not the street" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl text-ink",
				children: shop.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					shop.street ? `${shop.street}, ` : "",
					place,
					shop.postal ? ` ${shop.postal}` : ""
				]
			}),
			shop.area && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink",
				children: ["Serves ", shop.area]
			}),
			shop.hours ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink",
				children: shop.hours
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Hours unknown"
			}),
			!shop.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "No phone on file. Use the website."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-1",
				children: [
					phoneHref && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "min-h-11 text-sm font-semibold text-accent",
						href: phoneHref,
						children: shop.phone
					}),
					shop.web.startsWith("http") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "min-h-11 text-sm font-semibold text-accent",
						href: shop.web,
						target: "_blank",
						rel: "noreferrer",
						children: "Website"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "min-h-11 text-sm font-semibold text-accent",
						href: mapHref(shop),
						target: "_blank",
						rel: "noreferrer",
						children: "Directions"
					})
				]
			})
		]
	});
}
//#endregion
export { ServiceView };
