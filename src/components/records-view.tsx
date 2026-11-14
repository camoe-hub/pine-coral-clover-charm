import { useEffect, useState, type ReactNode } from "react";
import { Camera, ChevronRight, CircleDot, ClipboardList, Flame, Pencil, Scale, Shield } from "lucide-react";
import { Btn } from "@/components/ui";
import { formatWhen } from "@/lib/date";
import { supplyAges } from "@/lib/supplies";
import { oldestTire, tireAges } from "@/lib/tires";
import { useApp } from "@/lib/store";

export function RecordsView() {
  const push = useApp((s) => s.push);
  const log = useApp((s) => s.log);
  const notes = useApp((s) => s.notes);
  const lastBackup = useApp((s) => s.lastBackup);
  const shots = useApp((s) => s.shots);
  const fileCount = log.reduce((n, entry) => n + (entry.files?.length ?? 0), 0) + Object.values(shots).reduce((n, files) => n + files.length, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Everything here is saved on this phone and works with no signal.</p>
      <CoachRecordLinks />
      <RecordRow
        icon={<Shield className="size-5" />}
        title="Backup"
        detail={lastBackup ? `Last backup saved ${formatWhen(lastBackup)}` : "No backup saved yet. Export or restore a file."}
        onClick={() => push({ name: "backup" })}
      />
      <RecordRow
        icon={<ClipboardList className="size-5" />}
        title="Service history"
        detail={log.length ? `${log.length} saved` : "None yet. Record the first visit."}
        onClick={() => push({ name: "log" })}
      />
      <RecordRow
        icon={<Camera className="size-5" />}
        title="Photos and receipts"
        detail={fileCount ? `${fileCount} saved` : "None yet. Add the first one."}
        onClick={() => push({ name: "log" })}
      />
      <RecordRow
        icon={<Scale className="size-5" />}
        title="Weight tickets"
        detail="Scale numbers for this coach."
        onClick={() => push({ name: "weights" })}
      />
      <RecordRow
        icon={<Pencil className="size-5" />}
        title="Personal notes"
        detail={notes.length ? `${notes.length} saved` : "None yet. Add a reminder for this trailer."}
        onClick={() => push({ name: "notes" })}
      />
      <DealerCard />
    </div>
  );
}

function DealerCard() {
  const dealer = useApp((s) => s.dealer);
  const dealerAddress = useApp((s) => s.dealerAddress);
  const setDealer = useApp((s) => s.setDealer);
  const setDealerAddress = useApp((s) => s.setDealerAddress);
  const hydrated = useApp((s) => s.hydrated);
  const modelId = useApp((s) => s.modelId);
  const [text, setText] = useState(dealer);
  const [address, setAddress] = useState(dealerAddress);
  useEffect(() => {
    if (hydrated) {
      setText(dealer);
      setAddress(dealerAddress);
    }
  }, [hydrated, dealer, dealerAddress, modelId]);
  const map = [dealer, dealerAddress].map((part) => part.trim()).filter(Boolean).join(", ");
  return (
    <section className="rounded-[18px] border border-line bg-sheet p-4">
      <label className="text-sm font-semibold text-ink" htmlFor="dealer">
        My dealer / roadside
      </label>
      <input
        id="dealer"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Name and phone"
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4"
      />
      <label className="mt-3 block text-sm font-semibold text-ink" htmlFor="dealer-address">
        Address
      </label>
      <input
        id="dealer-address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Street, city, ZIP"
        autoComplete="street-address"
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4"
      />
      <Btn
        className="mt-3"
        onClick={() => {
          setDealer(text);
          setDealerAddress(address);
        }}
      >
        Save on this phone
      </Btn>
      {dealer ? <p className="mt-3 font-semibold text-ink">{dealer}</p> : null}
      {dealerAddress ? <p className="text-ink">{dealerAddress}</p> : null}
      {map ? (
        <a className="mt-1 inline-flex min-h-11 items-center font-semibold text-accent" href={`https://maps.apple.com/?q=${encodeURIComponent(map)}`} target="_blank" rel="noreferrer">
          Open in Maps
        </a>
      ) : null}
    </section>
  );
}

/** Tire record and propane cylinders/batteries. On Records, and under the schedule on Maintain. */
export function CoachRecordLinks() {
  const push = useApp((s) => s.push);
  const tires = useApp((s) => s.tires);
  const supplies = useApp((s) => s.supplies);
  const ages = tireAges(tires);
  const oldest = oldestTire(tires);
  const supply = supplyAges(supplies);
  const tireBits = [
    tires.psi ? `${tires.psi} psi cold` : "",
    oldest && oldest.id !== "set" ? `${oldest.label} oldest, about ${Math.floor(oldest.years)} years` : "",
    oldest && oldest.id === "set" ? `DOT about ${Math.floor(oldest.years)} years` : "",
    !oldest && ages.onYears != null ? `mounted about ${Math.floor(ages.onYears)} years` : "",
  ].filter(Boolean);
  const supplyBits = [
    supply.propaneYears != null && supply.propaneYears >= 0 ? `cylinder about ${Math.floor(supply.propaneYears)} years` : "",
    supply.batteryYears != null && supply.batteryYears >= 0 ? `batteries about ${Math.floor(supply.batteryYears)} years` : "",
  ].filter(Boolean);

  return (
    <>
      <RecordRow
        icon={<CircleDot className="size-5" />}
        title="Tire record"
        detail={tireBits.length ? tireBits.join(", ") : "DOT code, mount date, and cold pressure for each wheel."}
        onClick={() => push({ name: "tires" })}
      />
      <RecordRow
        icon={<Flame className="size-5" />}
        title="Propane cylinders/batteries"
        detail={supplyBits.length ? supplyBits.join(", ") : "Collar date on the cylinder, and when the batteries went in."}
        onClick={() => push({ name: "supplies" })}
      />
    </>
  );
}

function RecordRow({ icon, title, detail, onClick }: { icon: ReactNode; title: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{detail}</span>
      </span>
      <ChevronRight className="size-5 shrink-0 self-center text-muted" aria-hidden />
    </button>
  );
}
