import { useEffect, useState } from "react";
import { formatWhen } from "@/lib/date";
import { useApp } from "@/lib/store";
import { supplyAges } from "@/lib/supplies";
import { Btn, Card, Kicker, PageTitle } from "@/components/ui";

function years(n: number) {
  const whole = Math.max(0, Math.floor(n));
  return whole === 1 ? "about 1 year" : `about ${whole} years`;
}

export function SuppliesView() {
  const saved = useApp((s) => s.supplies);
  const modelId = useApp((s) => s.modelId);
  const part = useApp((s) => {
    const open = s.trail[s.cursor]?.screen;
    return open?.name === "supplies" ? open.part : undefined;
  });
  const setSupplies = useApp((s) => s.setSupplies);
  const flash = useApp((s) => s.flash);
  const [propane, setPropane] = useState(saved.propane);
  const [battery, setBattery] = useState(saved.battery);
  useEffect(() => {
    setPropane(saved.propane);
    setBattery(saved.battery);
  }, [modelId, saved.propane, saved.battery]);
  useEffect(() => {
    if (!part) return;
    const field = document.getElementById(part === "battery" ? "battery-date" : "propane-date");
    field?.scrollIntoView({ block: "center" });
    if (field instanceof HTMLInputElement) field.focus({ preventScroll: true });
  }, [part]);
  const ages = supplyAges({ propane, battery });

  return (
    <div>
      <Kicker>Collar stamp and battery label</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Cylinders and batteries</PageTitle>
      <p className="mt-2 text-sm text-muted">
        The collar date is on the cylinder, not the tank cover. If the stamp is a month and year, use the first of that month. Battery age is the day these batteries went in.
      </p>
      <Card className="mt-4 space-y-3 p-4">
        <label className="block text-sm font-semibold text-ink" htmlFor="propane-date">
          Propane cylinder date
        </label>
        <input
          id="propane-date"
          type="date"
          value={propane}
          onChange={(e) => setPropane(e.target.value)}
          className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
        />
        <label className="block text-sm font-semibold text-ink" htmlFor="battery-date">
          Battery install date
        </label>
        <input
          id="battery-date"
          type="date"
          value={battery}
          onChange={(e) => setBattery(e.target.value)}
          className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
        />
        <Btn
          className="w-full"
          onClick={() => {
            setSupplies({ propane, battery });
            flash("Saved on this phone");
          }}
        >
          Save on this phone
        </Btn>
      </Card>
      {(ages.propaneYears != null || ages.batteryYears != null) && (
        <Card className="mt-4 space-y-2 p-4 text-sm text-ink">
          {ages.propaneYears != null && propane ? (
            <p>
              {ages.propaneYears < 0
                ? "That cylinder date is ahead of today."
                : `Cylinder date ${formatWhen(propane)} · ${years(ages.propaneYears)}.`}
              {ages.propaneYears >= 12
                ? " DOT cylinders are often requalified 12 years after the collar date. Confirm the stamp and the shop. This app does not recertify a cylinder."
                : ""}
            </p>
          ) : null}
          {ages.batteryYears != null && battery ? (
            <p>
              {ages.batteryYears < 0
                ? "That battery date is ahead of today."
                : `Batteries installed ${formatWhen(battery)} · ${years(ages.batteryYears)}.`}
              {ages.batteryYears >= 5
                ? " Flooded batteries often fade around 5 years. Lithium lasts longer. The label and the manual govern, not this app."
                : ""}
            </p>
          ) : null}
        </Card>
      )}
    </div>
  );
}
