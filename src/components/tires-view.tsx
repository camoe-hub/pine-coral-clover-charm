import { useEffect, useState } from "react";
import { formatWhen, todayIso } from "@/lib/date";
import { deleteFile, getFile, prepareFile, putFile } from "@/lib/files";
import { fileStillUsed, useApp } from "@/lib/store";
import { modelById } from "@/data/models";
import { TIRE_TABLES, coldForLoad, tireTable } from "@/lib/tire-load";
import {
  WHEELS,
  emptyWheel,
  lowWheels,
  oldestTire,
  sideNeedsReplace,
  tireAges,
  treadNeedsReplace,
  withCheck,
  withoutCheck,
  type PressureCheck,
  type TirePhoto,
  type TirePhotos,
  type TireRecord,
  type WheelId,
  type WheelRecord,
} from "@/lib/tires";
import { Btn, Card, Kicker, PageTitle } from "@/components/ui";

const field = "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink";

function years(n: number) {
  const whole = Math.max(0, Math.floor(n));
  return whole === 1 ? "about 1 year" : `about ${whole} years`;
}

function mountYears(on: string) {
  if (!on) return null;
  const mounted = new Date(`${on}T12:00:00`);
  if (Number.isNaN(mounted.getTime())) return null;
  return (Date.now() - mounted.getTime()) / (365.25 * 86400000);
}

type Draft = {
  psi: string;
  endLb: string;
  dot: string;
  on: string;
  rotated: string;
  wheels: Record<WheelId, WheelRecord>;
};

function draftFrom(tires: TireRecord): Draft {
  const wheels = {} as Record<WheelId, WheelRecord>;
  for (const wheel of WHEELS) wheels[wheel.id] = { ...emptyWheel(), ...tires.wheels[wheel.id] };
  return { psi: tires.psi, endLb: tires.endLb, dot: tires.dot, on: tires.on, rotated: tires.rotated, wheels };
}

function wheelSummary(wheel: WheelRecord) {
  const bits: string[] = [];
  if (wheel.dot) bits.push(`DOT ${wheel.dot}`);
  if (wheel.on) bits.push(`mounted ${formatWhen(wheel.on)}`);
  if (wheel.tread === "ok" || wheel.tread === "replace") bits.push(`tread ${wheel.tread}`);
  else if (wheel.tread) bits.push(`${wheel.tread}/32`);
  if (wheel.side === "replace") bits.push("sidewall replace");
  else if (wheel.side === "ok") bits.push("sidewall ok");
  return bits.join(" · ") || "Not set";
}

function MarkButton({ pressed, label, onClick }: { pressed: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 rounded-full px-3 text-sm font-semibold ${pressed ? "bg-navy text-on-navy" : "border border-line bg-paper text-ink"}`}
    >
      {label}
    </button>
  );
}

function Thumb({ photo }: { photo: TirePhoto }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    let object = "";
    void getFile(photo.id).then((blob) => {
      if (!live || !blob) return;
      object = URL.createObjectURL(blob);
      setUrl(object);
    });
    return () => {
      live = false;
      if (object) URL.revokeObjectURL(object);
    };
  }, [photo.id]);
  return url ? (
    <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
  ) : (
    <span className="grid h-16 w-16 place-items-center rounded-lg bg-paper text-xs text-muted">Photo</span>
  );
}

const placedWheels = (["lf", "rf", "lr", "rr", "spare"] as const).map((id) => WHEELS.find((wheel) => wheel.id === id)!);

export function TiresView() {
  const saved = useApp((s) => s.tires);
  const modelId = useApp((s) => s.modelId);
  const model = modelById(modelId);
  const setTires = useApp((s) => s.setTires);
  const flash = useApp((s) => s.flash);
  const [draft, setDraft] = useState(() => draftFrom(saved));
  const [today, setToday] = useState("");
  const [checkOn, setCheckOn] = useState("");
  const [checkPsi, setCheckPsi] = useState<Partial<Record<WheelId, string>>>({});
  const [checkNote, setCheckNote] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setToday(todayIso());
  }, []);
  useEffect(() => {
    setDraft(draftFrom(useApp.getState().tires));
    setCheckOn(todayIso());
    setCheckPsi({});
    setCheckNote("");
  }, [modelId]);

  const oldest = oldestTire(saved);
  const ages = tireAges(saved);
  const old =
    (oldest != null && oldest.years >= 6) ||
    (ages.onYears != null && ages.onYears >= 6) ||
    WHEELS.some((wheel) => {
      const mounted = mountYears(saved.wheels[wheel.id]?.on ?? "");
      return mounted != null && mounted >= 6;
    });

  function patchWheel(id: WheelId, patch: Partial<WheelRecord>) {
    setDraft((current) => ({ ...current, wheels: { ...current.wheels, [id]: { ...current.wheels[id], ...patch } } }));
  }

  async function saveRecord() {
    const wheels: TireRecord["wheels"] = {};
    for (const wheel of WHEELS) wheels[wheel.id] = draft.wheels[wheel.id];
    const ok = await Promise.resolve(setTires({ psi: draft.psi, endLb: draft.endLb, dot: draft.dot, on: draft.on, rotated: draft.rotated, wheels }));
    if (ok) flash("Tire record saved");
  }

  async function choosePhoto(file: File | undefined, next: (photo: TirePhoto) => TirePhotos, previous: TirePhoto | null) {
    if (!file) return;
    setBusy(true);
    try {
      const prepared = await prepareFile(file);
      if (!prepared.mime.startsWith("image/")) {
        flash("Use a photo, not a PDF.");
        return;
      }
      const id = crypto.randomUUID();
      const photo = { id, name: prepared.name, mime: prepared.mime };
      await putFile(id, prepared.blob);
      const ok = await Promise.resolve(setTires({ photos: next(photo) }));
      if (!ok) {
        if (!fileStillUsed(id)) void deleteFile(id);
        return;
      }
      if (previous && previous.id !== id && !fileStillUsed(previous.id)) void deleteFile(previous.id);
    } catch (err) {
      const heic = err instanceof Error && err.message === "heic";
      flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(photos: TirePhotos, id: string) {
    const ok = await Promise.resolve(setTires({ photos }));
    if (ok && !fileStillUsed(id)) void deleteFile(id);
  }

  async function saveCheck() {
    const checks = withCheck(useApp.getState().tires, { on: checkOn, psi: checkPsi, note: checkNote });
    if (!checks) {
      flash("Use a real date, and a pressure or a note.");
      return;
    }
    const ok = await Promise.resolve(setTires({ checks }));
    if (!ok) return;
    setCheckPsi({});
    setCheckNote("");
    flash("Pressure check saved");
  }

  return (
    <div>
      <Kicker>Sidewall and placard</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Tires</PageTitle>
      <p className="mt-2 text-sm text-muted">
        Cold pressure is the number you run, from the placard for this load. Each tire gets its own DOT code, including the spare. The maximum on the spec card is not the pressure to use.
      </p>
      {oldest ? (
        <p className="mt-3 text-sm text-ink">
          {oldest.id === "set" ? "One DOT for the set" : `Oldest tire: ${oldest.label}`}, DOT {oldest.dot}, {years(oldest.years)}. The 5-year replace follows this tire.
        </p>
      ) : null}

      <Card className="mt-4 space-y-3 p-4">
        <label className="block text-sm font-semibold text-ink" htmlFor="tire-psi">
          Placard cold pressure (psi)
        </label>
        <input
          id="tire-psi"
          inputMode="numeric"
          value={draft.psi}
          onChange={(e) => setDraft({ ...draft, psi: e.target.value.replace(/[^\d]/g, "").slice(0, 3) })}
          placeholder="From the placard."
          className={`${field} tabular-nums`}
        />
        <p className="text-sm text-muted">This is the number you inflate to. A walk-around below compares a reading to it. It does not replace this number.</p>
        <PhotoRow
          photo={saved.photos.placard}
          label="Placard photo"
          busy={busy}
          onPick={(file) => {
            const live = useApp.getState().tires.photos;
            void choosePhoto(file, (photo) => ({ ...live, placard: photo }), live.placard);
          }}
          onRemove={() => {
            const live = useApp.getState().tires.photos;
            if (!live.placard) return;
            void removePhoto({ ...live, placard: null }, live.placard.id);
          }}
        />
      </Card>

      <LoadCard size={model.tire} placard={draft.psi} endLb={draft.endLb} onEnd={(endLb) => setDraft({ ...draft, endLb })} />

      <Card className="mt-4 space-y-3 p-4">
        <label className="block text-sm font-semibold text-ink" htmlFor="tire-rotated">
          Last rotation
        </label>
        <input
          id="tire-rotated"
          type="date"
          value={draft.rotated}
          max={today || undefined}
          onChange={(e) => setDraft({ ...draft, rotated: e.target.value })}
          className={field}
        />
        <p className="text-sm text-muted">Same side only. Front and rear trade places. Do not cross them left to right. The 10,000-mile or 6-month job uses this date.</p>
        {(saved.dot || saved.on) && (
          <div className="space-y-3 border-t border-line pt-3">
            <p className="text-sm text-ink">Older record, one code for the set. It is used until a wheel below has its own DOT.</p>
            <label className="block text-sm font-semibold text-ink" htmlFor="tire-dot">
              DOT date code
            </label>
            <input
              id="tire-dot"
              inputMode="numeric"
              value={draft.dot}
              onChange={(e) => setDraft({ ...draft, dot: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })}
              placeholder="2323"
              className={`${field} tabular-nums`}
            />
            <label className="block text-sm font-semibold text-ink" htmlFor="tire-on">
              Date they were mounted
            </label>
            <input id="tire-on" type="date" value={draft.on} max={today || undefined} onChange={(e) => setDraft({ ...draft, on: e.target.value })} className={field} />
          </div>
        )}
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <p className="col-span-2 text-sm text-muted">Leave a tire blank if this coach does not have it. The spare counts.</p>
        {placedWheels.map((wheel) => {
          const row = draft.wheels[wheel.id];
          const savedWheel = saved.wheels[wheel.id];
          const photo = saved.photos.side[wheel.id] ?? null;
          const replace = treadNeedsReplace(row.tread) || sideNeedsReplace(row.side);
          return (
            <details key={wheel.id} className={`rounded-card border border-rule bg-sheet ${wheel.id === "spare" ? "col-span-2" : ""}`}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold text-ink">{wheel.label}</span>
                <span className="text-right text-sm text-muted">{wheelSummary(savedWheel ?? emptyWheel())}</span>
              </summary>
              <div className="space-y-3 px-4 pb-4">
                <label className="block text-sm font-semibold text-ink" htmlFor={`dot-${wheel.id}`}>
                  DOT date code
                </label>
                <input
                  id={`dot-${wheel.id}`}
                  inputMode="numeric"
                  value={row.dot}
                  onChange={(e) => patchWheel(wheel.id, { dot: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })}
                  placeholder="2323"
                  className={`${field} tabular-nums`}
                />
                <p className="text-sm text-muted">Last four digits. 2323 means week 23 of 2023.</p>
                <label className="block text-sm font-semibold text-ink" htmlFor={`on-${wheel.id}`}>
                  Date mounted
                </label>
                <input
                  id={`on-${wheel.id}`}
                  type="date"
                  value={row.on}
                  max={today || undefined}
                  onChange={(e) => patchWheel(wheel.id, { on: e.target.value })}
                  className={field}
                />
                <p className="text-sm font-semibold text-ink">Tread</p>
                <div className="flex flex-wrap gap-2">
                  <MarkButton pressed={row.tread === "ok"} label="OK" onClick={() => patchWheel(wheel.id, { tread: row.tread === "ok" ? "" : "ok" })} />
                  <MarkButton
                    pressed={row.tread === "replace"}
                    label="Replace"
                    onClick={() => patchWheel(wheel.id, { tread: row.tread === "replace" ? "" : "replace" })}
                  />
                  <input
                    aria-label={`${wheel.label} tread in 32nds`}
                    inputMode="numeric"
                    value={/^\d+$/.test(row.tread) ? row.tread : ""}
                    onChange={(e) => patchWheel(wheel.id, { tread: e.target.value.replace(/[^\d]/g, "").slice(0, 2) })}
                    placeholder="32nds"
                    className="min-h-11 w-24 rounded-full border border-line bg-paper px-3 text-base tabular-nums text-ink"
                  />
                </div>
                <p className="text-sm text-muted">Replace at 2/32 in. A number is a reading, not a guess of how long the tire has left.</p>
                <p className="text-sm font-semibold text-ink">Sidewall</p>
                <div className="flex flex-wrap gap-2">
                  <MarkButton pressed={row.side === "ok"} label="OK" onClick={() => patchWheel(wheel.id, { side: row.side === "ok" ? "" : "ok" })} />
                  <MarkButton
                    pressed={row.side === "replace"}
                    label="Replace"
                    onClick={() => patchWheel(wheel.id, { side: row.side === "replace" ? "" : "replace" })}
                  />
                </div>
                {replace ? <p className="text-sm text-ink">{wheel.label} is at the replace line.</p> : null}
                <PhotoRow
                  photo={photo}
                  label="Sidewall date code"
                  busy={busy}
                  onPick={(file) => {
                    const live = useApp.getState().tires.photos;
                    void choosePhoto(
                      file,
                      (next) => ({ ...live, side: { ...live.side, [wheel.id]: next } }),
                      live.side[wheel.id] ?? null,
                    );
                  }}
                  onRemove={() => {
                    const live = useApp.getState().tires.photos;
                    const current = live.side[wheel.id];
                    if (!current) return;
                    const side = { ...live.side };
                    delete side[wheel.id];
                    void removePhoto({ ...live, side }, current.id);
                  }}
                />
              </div>
            </details>
          );
        })}
      </div>

      <Btn className="mt-4 w-full" onClick={() => void saveRecord()}>
        Save on this phone
      </Btn>

      <Card className="mt-4 space-y-3 p-4">
        <p className="text-sm font-semibold text-ink">Cold-pressure check</p>
        <p className="text-sm text-muted">One walk-around. Cold, after at least 3 hours. These readings sit next to the placard number. They do not change it.</p>
        <label className="block text-sm font-semibold text-ink" htmlFor="check-on">
          Date
        </label>
        <input id="check-on" type="date" value={checkOn} max={today || undefined} onChange={(e) => setCheckOn(e.target.value)} className={field} />
        {WHEELS.map((wheel) => (
          <label key={wheel.id} className="block text-sm font-semibold text-ink" htmlFor={`psi-${wheel.id}`}>
            {wheel.label}
            <input
              id={`psi-${wheel.id}`}
              inputMode="numeric"
              value={checkPsi[wheel.id] ?? ""}
              onChange={(e) => setCheckPsi({ ...checkPsi, [wheel.id]: e.target.value.replace(/[^\d]/g, "").slice(0, 3) })}
              placeholder={draft.psi || "psi"}
              className={`${field} mt-1 tabular-nums`}
            />
          </label>
        ))}
        <label className="block text-sm font-semibold text-ink" htmlFor="check-note">
          Note
        </label>
        <input
          id="check-note"
          value={checkNote}
          maxLength={80}
          onChange={(e) => setCheckNote(e.target.value)}
          placeholder="Optional"
          className={field}
        />
        <Btn className="w-full" onClick={() => void saveCheck()}>
          Save this check
        </Btn>
        {saved.checks.length > 0 && (
          <ul className="space-y-3 border-t border-line pt-3">
            {saved.checks.map((check) => (
              <CheckRow
                key={check.on}
                check={check}
                placard={saved.psi}
                onRemove={() => {
                  void Promise.resolve(setTires({ checks: withoutCheck(useApp.getState().tires, check.on) })).then((ok) => {
                    if (ok) flash("Check removed");
                  });
                }}
              />
            ))}
          </ul>
        )}
      </Card>

      {(oldest || ages.onYears != null || saved.psi) && (
        <Card className="mt-4 space-y-2 p-4 text-sm text-ink">
          {saved.psi ? <p>Saved placard pressure {saved.psi} psi.</p> : null}
          {oldest ? (
            <p>
              {oldest.id === "set" ? "DOT" : oldest.label} {oldest.dot} · {years(oldest.years)} from the date code.
            </p>
          ) : null}
          {ages.onYears != null && saved.on && !oldest ? (
            <p>
              Mounted {formatWhen(saved.on)} · {years(ages.onYears)}.
            </p>
          ) : null}
          {old ? (
            <p className="text-muted">Many tire makers replace a tire 6 years after the DOT date, even with tread left. Confirm with the tire maker, not this app.</p>
          ) : null}
        </Card>
      )}
    </div>
  );
}

function pressureSentence(rowPsi: number, placardPsi: number | null, carries: number | null): string {
  const load = carries != null ? ` That row carries ${carries.toLocaleString()} lb.` : "";
  if (placardPsi != null && placardPsi < rowPsi) {
    return `This row is ${rowPsi} psi.${load} The placard says ${placardPsi} psi, which is lower. Use ${placardPsi} psi. Do not use ${rowPsi}.`;
  }
  if (placardPsi != null && placardPsi > rowPsi) {
    return `Minimum cold pressure for that load is ${rowPsi} psi.${load} The placard says ${placardPsi} psi. Use the placard.`;
  }
  return `Minimum cold pressure for that load is ${rowPsi} psi.${load} Use ${rowPsi} psi on both sides.`;
}

function LoadCard({
  size,
  placard,
  endLb,
  onEnd,
}: {
  size: string;
  placard: string;
  endLb: string;
  onEnd: (value: string) => void;
}) {
  const known = tireTable(size);
  const [truckSize, setTruckSize] = useState("LT225/75R16");
  const [truckTyped, setTruckTyped] = useState(TIRE_TABLES.length === 0);
  const [truckEnd, setTruckEnd] = useState("");
  const [typedLb, setTypedLb] = useState("");
  const [typedPsi, setTypedPsi] = useState("");
  const [truckLb, setTruckLb] = useState("");
  const [truckPsi, setTruckPsi] = useState("");
  const pounds = (value: string) => value.replace(/[^\d]/g, "").slice(0, 5);

  return (
    <Card className="mt-4 space-y-3 p-4">
      <p className="text-sm font-semibold text-ink">Cold pressure for this load</p>
      <p className="text-sm text-muted">
        {known
          ? `${size}. ${known.source} Same pressure on both sides of the axle. The placard still wins if it disagrees.`
          : `${size}. This copy does not store a tire maker’s load rows. Type the row from the maker’s chart. Same pressure on both sides. The placard still wins.`}
      </p>
      <label className="block text-sm font-semibold text-ink" htmlFor="axle-end">
        Heavier axle end (lb)
      </label>
      <input
        id="axle-end"
        inputMode="numeric"
        value={endLb}
        onChange={(e) => onEnd(pounds(e.target.value))}
        className={`${field} tabular-nums`}
      />
      <p className="text-sm text-muted">One side of one axle. The trailer number on a scale ticket is both sides together, so it is not this box. Save on this phone keeps it.</p>
      {known ? <TableResult size={size} endLb={endLb} placard={placard} /> : <TypedResult endLb={endLb} typedLb={typedLb} typedPsi={typedPsi} placard={placard} onLb={setTypedLb} onPsi={setTypedPsi} />}

      <div className="border-t border-line pt-3">
        <p className="text-sm font-semibold text-ink">Tow vehicle tires</p>
        {TIRE_TABLES.length > 0 ? (
          <>
        <label className="mt-2 block text-sm font-semibold text-ink" htmlFor="truck-tire">
          Size
        </label>
        <select
          id="truck-tire"
          value={truckTyped ? "typed" : truckSize}
          onChange={(e) => {
            if (e.target.value === "typed") setTruckTyped(true);
            else {
              setTruckTyped(false);
              setTruckSize(e.target.value);
            }
          }}
          className={field}
        >
          {TIRE_TABLES.map((table) => (
            <option key={table.size} value={table.size}>{table.size}</option>
          ))}
          <option value="typed">Type a row</option>
        </select>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">Type the row from the tire maker’s chart. The placard on the truck still wins.</p>
        )}
        {TIRE_TABLES.length === 0 || truckTyped ? (
          <TypedResult endLb={truckEnd} typedLb={truckLb} typedPsi={truckPsi} placard="" onLb={setTruckLb} onPsi={setTruckPsi} truck onEnd={setTruckEnd} />
        ) : (
          <>
            <label className="mt-3 block text-sm font-semibold text-ink" htmlFor="truck-end">
              Heavier axle end (lb)
            </label>
            <input id="truck-end" inputMode="numeric" value={truckEnd} onChange={(e) => setTruckEnd(pounds(e.target.value))} className={`${field} tabular-nums`} />
            <TableResult size={truckSize} endLb={truckEnd} placard="" />
            <p className="text-sm text-muted">The placard on the truck still wins if it disagrees. This is not saved with the trailer.</p>
          </>
        )}
      </div>
    </Card>
  );
}

function TableResult({ size, endLb, placard }: { size: string; endLb: string; placard: string }) {
  if (!endLb) return null;
  const found = coldForLoad(size, Number(endLb));
  if (found === "empty") return null;
  if (found === "over") {
    const table = tireTable(size);
    const last = table?.rows[table.rows.length - 1];
    return <p className="text-sm font-semibold text-ink">That load is over the last published row{last ? `, ${last.lb.toLocaleString()} lb at ${last.psi} psi` : ""}. This table does not go higher.</p>;
  }
  const placardPsi = placard ? Number(placard) : null;
  return (
    <div className="text-sm text-ink">
      <p>{pressureSentence(found.psi, placardPsi, found.carries)}</p>
    </div>
  );
}

function TypedResult({
  endLb,
  typedLb,
  typedPsi,
  placard,
  onLb,
  onPsi,
  truck,
  onEnd,
}: {
  endLb: string;
  typedLb: string;
  typedPsi: string;
  placard: string;
  onLb: (value: string) => void;
  onPsi: (value: string) => void;
  truck?: boolean;
  onEnd?: (value: string) => void;
}) {
  const pounds = (value: string) => value.replace(/[^\d]/g, "").slice(0, 5);
  const psi = (value: string) => value.replace(/[^\d]/g, "").slice(0, 3);
  const placardPsi = placard ? Number(placard) : null;
  const typed = typedLb && typedPsi ? Number(typedPsi) : null;
  return (
    <div className="space-y-3">
      {truck ? (
        <>
          <label className="block text-sm font-semibold text-ink" htmlFor="truck-typed-end">Heavier axle end (lb)</label>
          <input id="truck-typed-end" inputMode="numeric" value={endLb} onChange={(e) => onEnd?.(pounds(e.target.value))} className={`${field} tabular-nums`} />
        </>
      ) : null}
      <label className="block text-sm font-semibold text-ink" htmlFor={truck ? "truck-row-lb" : "row-lb"}>Pounds that row carries</label>
      <input id={truck ? "truck-row-lb" : "row-lb"} inputMode="numeric" value={typedLb} onChange={(e) => onLb(pounds(e.target.value))} className={`${field} tabular-nums`} />
      <label className="block text-sm font-semibold text-ink" htmlFor={truck ? "truck-row-psi" : "row-psi"}>Cold psi on that row</label>
      <input id={truck ? "truck-row-psi" : "row-psi"} inputMode="numeric" value={typedPsi} onChange={(e) => onPsi(psi(e.target.value))} className={`${field} tabular-nums`} />
      {typed ? (
        <p className="text-sm text-ink">
          You typed {typed} psi for a row that carries {Number(typedLb).toLocaleString()} lb.
          {endLb && Number(endLb) > Number(typedLb)
            ? " The heavier end is over that row. Do not use it."
            : placardPsi != null && placardPsi < typed
              ? ` The placard says ${placardPsi} psi, which is lower. Use ${placardPsi} psi. Do not use ${typed}.`
              : ` Use ${typed} psi on both sides.`}
          {placardPsi != null && placardPsi > typed ? ` The placard says ${placardPsi} psi. Use the placard.` : ""}
          {truck ? " The placard on the truck still wins if it disagrees." : ""}
        </p>
      ) : null}
    </div>
  );
}

function PhotoRow({
  photo,
  label,
  busy,
  onPick,
  onRemove,
}: {
  photo: TirePhoto | null;
  label: string;
  busy: boolean;
  onPick: (file: File | undefined) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      {photo ? (
        <div className="mt-2 flex items-center gap-3">
          <Thumb photo={photo} />
          <button type="button" onClick={onRemove} className="min-h-11 text-sm font-semibold text-stop">
            Remove
          </button>
        </div>
      ) : null}
      <label className="mt-1 flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent">
        {busy ? "Saving…" : photo ? "Replace photo" : "Add a photo"}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            onPick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <p className="text-sm text-muted">Stays on this phone. It is not uploaded, and nothing is read off it.</p>
    </div>
  );
}

function CheckRow({ check, placard, onRemove }: { check: PressureCheck; placard: string; onRemove: () => void }) {
  const low = new Set(lowWheels(placard, check));
  return (
    <li className="text-sm text-ink">
      <p className="font-semibold">{formatWhen(check.on)}</p>
      {check.note ? <p>{check.note}</p> : null}
      <ul className="mt-1">
        {WHEELS.filter((wheel) => check.psi[wheel.id]).map((wheel) => (
          <li key={wheel.id}>
            {wheel.label} {check.psi[wheel.id]} psi
            {placard ? ` · placard ${placard}` : ""}
            {low.has(wheel.id) ? " · more than 20% under. That tire comes off for a cage inspection." : ""}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onRemove} className="mt-1 min-h-11 text-sm font-semibold text-stop">
        Remove
      </button>
    </li>
  );
}
