import { useEffect, useState } from "react";
import { nearestShops, shopsAt, RANGES, typeLabel, type RangeMiles, type ShopHit, type ShopKind } from "@/lib/service";
import { useApp } from "@/lib/store";
import { Btn, Chip, Kicker, PageTitle } from "@/components/ui";

const KEY = "rivetcare-service";

const KINDS: { id: ShopKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mobile", label: "Mobile" },
  { id: "shop", label: "Shops" },
];

function load(): { zip: string; range: RangeMiles; kind: ShopKind } {
  if (typeof window === "undefined") return { zip: "", range: 100, kind: "all" };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { zip: "", range: 100, kind: "all" };
    const saved = JSON.parse(raw) as { zip?: string; range?: RangeMiles; kind?: ShopKind };
    const range = RANGES.some((r) => r.id === saved.range) ? saved.range! : 100;
    const kind = KINDS.some((k) => k.id === saved.kind) ? saved.kind! : "all";
    return { zip: (saved.zip ?? "").replace(/\D/g, "").slice(0, 5), range, kind };
  } catch {
    return { zip: "", range: 100, kind: "all" };
  }
}

export function ServiceView() {
  const initial = load();
  const [zip, setZip] = useState(initial.zip);
  const [range, setRange] = useState<RangeMiles>(initial.range);
  const [kind, setKind] = useState<ShopKind>(initial.kind);
  const [hits, setHits] = useState<ShopHit[] | null>(null);
  const [zipKnown, setZipKnown] = useState(true);
  const [busy, setBusy] = useState(false);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState("");
  const [listError, setListError] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ zip, range, kind }));
  }, [zip, range, kind]);

  useEffect(() => {
    if (here) {
      let cancel = false;
      setBusy(true);
      setListError("");
      void shopsAt(here.lat, here.lng, range, kind)
        .then((found) => {
          if (cancel) return;
          setHits(found);
          setZipKnown(true);
          setBusy(false);
        })
        .catch(() => {
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
    nearestShops(zip, range, kind)
      .then((result) => {
        if (cancel) return;
        setHits(result.hits);
        setZipKnown(result.zipKnown);
        setBusy(false);
      })
      .catch(() => {
        if (cancel) return;
        setBusy(false);
        setHits(null);
        setListError("The ZIP list is not on this phone yet. Search once while you have a signal.");
      });
    return () => {
      cancel = true;
    };
  }, [zip, range, kind, here]);

  function useHere() {
    if (!navigator.geolocation) {
      setLocError("This phone cannot share a location. Enter a ZIP.");
      return;
    }
    setLocError("");
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setZip("");
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setBusy(false);
        setLocError("Location was blocked. Enter a ZIP instead.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }

  const rangeLabel = RANGES.find((r) => r.id === range)?.label ?? "100 miles";

  return (
    <div className="space-y-5">
      <div>
        <Kicker>Service and repair</Kicker>
        <PageTitle className="mt-1 text-3xl text-ink">Find a shop</PageTitle>
        <p className="mt-2 text-base text-ink">Dealers and independent shops near a ZIP.</p>
        <SavedDealer />
      </div>

      <Btn variant="line" onClick={useHere}>
        {here ? "Using your location" : "Use my location"}
      </Btn>
      {locError && (
        <p className="text-sm font-semibold text-stop" role="alert">
          {locError}
        </p>
      )}
      {listError && (
        <p className="text-sm font-semibold text-stop" role="alert">
          {listError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="service-zip">
            ZIP code
          </label>
          <input
            id="service-zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={zip}
            onChange={(e) => {
              setHere(null);
              setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
            }}
            className="mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor="service-range">
            Distance
          </label>
          <select
            id="service-range"
            value={String(range)}
            onChange={(e) => {
              const next = e.target.value === "all" ? "all" : (Number(e.target.value) as RangeMiles);
              setRange(next);
            }}
            className="mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
          >
            {RANGES.map((r) => (
              <option key={String(r.id)} value={String(r.id)}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chip-row -mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Kind of service">
        {KINDS.map((item) => (
          <Chip key={item.id} on={kind === item.id} onClick={() => setKind(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>

      {!busy && zip.length > 0 && zip.length < 5 && <p className="text-base text-ink">Enter all 5 digits.</p>}
      {busy && <p className="text-base text-ink">Looking up that ZIP.</p>}
      {!busy && zip.length === 0 && !here && <p className="text-base text-ink">Enter a ZIP, or use your location. Nothing is listed until then.</p>}
      {!busy && zip.length === 5 && !zipKnown && (
        <p className="text-sm font-semibold text-stop" role="alert">
          That ZIP is not in the list.
        </p>
      )}
      {!busy && zipKnown && hits && hits.length === 0 && (
        <p className="text-sm text-ink" role="status">
          {kind === "mobile" ? "No mobile tech" : kind === "shop" ? "No shop" : "Nothing"} within {rangeLabel.toLowerCase()}. Try a wider range{kind !== "all" ? ", or choose All" : ""}.
        </p>
      )}

      {hits && hits.length > 0 && (
        <>
          <p className="text-sm text-muted" role="status">
            {hits.length} {kind === "mobile" ? (hits.length === 1 ? "mobile tech" : "mobile techs") : hits.length === 1 ? "shop" : "shops"}
            {range === "all" ? " nationwide" : ` within ${rangeLabel.toLowerCase()}`}.
          </p>
          <ul className="space-y-3">
            {hits.map((hit) => (
              <ShopCard key={`${hit.shop.name}-${hit.shop.postal}`} hit={hit} />
            ))}
          </ul>
        </>
      )}
      <p className="text-base text-ink">
        Straight-line miles, not drive time. Verify before you go. Last checked 27 Oct 2026. A listing is not a visit. Dealers come from the Airstream locator. Independent shops and mobile techs are not factory dealers, and a listing is not a factory specification.
      </p>
    </div>
  );
}

function hourLines(hours: string) {
  const rows = hours
    .split(";")
    .map((part) => part.trim())
    .map((part) => {
      const match = /^([^:]+):\s*(.+)$/.exec(part);
      if (!match) return null;
      const span = match[2].trim().replace(/(\d)(AM|PM)/gi, "$1 $2").replace("-", "–");
      return { day: match[1].trim(), span };
    })
    .filter((row): row is { day: string; span: string } => row !== null);
  if (rows.length < 2) return [hours];
  const groups: { days: string[]; span: string }[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.span === row.span) last.days.push(row.day);
    else groups.push({ days: [row.day], span: row.span });
  }
  return groups.map((group) => `${group.days.length === 1 ? group.days[0] : `${group.days[0]}–${group.days[group.days.length - 1]}`} ${group.span}`);
}

function ShopHours({ hours }: { hours: string }) {
  const lines = hourLines(hours);
  return (
    <ul className="mt-2 space-y-0.5 text-sm text-ink">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}
function dealerMap(name: string, address: string) {
  const query = [name, address].map((part) => part.trim()).filter(Boolean).join(", ");
  return query ? `https://maps.apple.com/?q=${encodeURIComponent(query)}` : "";
}

function SavedDealer() {
  const dealer = useApp((s) => s.dealer);
  const address = useApp((s) => s.dealerAddress);
  const href = dealerMap(dealer, address);
  if (!href) return null;
  return (
    <p className="mt-3 text-sm text-ink">
      <span className="font-semibold">{dealer.trim() || "Saved dealer"}</span>
      {address.trim() ? ` · ${address.trim()}` : ""}
      {" · "}
      <a className="font-semibold text-accent" href={href} target="_blank" rel="noreferrer">
        Map
      </a>
    </p>
  );
}

function mapHref(shop: ShopHit["shop"]) {
  const query = [shop.name, shop.street, shop.city, shop.state, shop.postal].filter(Boolean).join(" ");
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}

function ShopCard({ hit }: { hit: ShopHit }) {
  const { shop, miles } = hit;
  const phoneHref = shop.phone ? `tel:${shop.phone.replace(/[^\d+]/g, "")}` : "";
  const place = [shop.city, shop.state].filter(Boolean).join(", ");
  return (
    <li className="rounded-card border border-line bg-sheet p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {typeLabel(shop.type)}
        {shop.certified ? " · Five Rivet" : ""}
        {miles != null ? ` · ${Math.round(miles)} mi` : " · no map point, call to confirm"}
        {shop.approx && miles != null ? " · placed at the ZIP center, not the street" : ""}
      </p>
      <h2 className="mt-1 text-2xl text-ink">{shop.name}</h2>
      <p className="mt-1 text-sm text-muted">
        {shop.street ? `${shop.street}, ` : ""}
        {place}
        {shop.postal ? ` ${shop.postal}` : ""}
      </p>
      {shop.area && <p className="mt-1 text-sm text-ink">Serves {shop.area}</p>}
      {shop.hours ? <ShopHours hours={shop.hours} /> : <p className="mt-2 text-sm text-ink">Hours are not listed. Call before you go.</p>}
      {!shop.phone && <p className="mt-2 text-sm text-muted">No phone on file. Use the website.</p>}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {phoneHref && (
          <a className="min-h-11 text-sm font-semibold text-accent" href={phoneHref}>
            {shop.phone}
          </a>
        )}
        {shop.web.startsWith("http") && (
          <a className="min-h-11 text-sm font-semibold text-accent" href={shop.web} target="_blank" rel="noreferrer">
            Website
          </a>
        )}
        <a className="min-h-11 text-sm font-semibold text-accent" href={mapHref(shop)} target="_blank" rel="noreferrer">
          Directions
        </a>
      </div>
    </li>
  );
}
