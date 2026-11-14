/** Shared by the in-app screens and the public /privacy and /support pages. */
export function LegalNotice() {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-2xl text-ink">Who publishes this</h2>
      <p className="text-base text-ink">
        Operator: Charles Moe. Copyright © 2026 Charles Moe. This notice is dated 5 November 2026.
      </p>
      <p className="text-base text-ink">
        Contact: no email or phone. The handle is @RivetCareApp. A wrong step stays as a note on this phone. Nothing is sent.
      </p>
    </section>
  );
}

export function PrivacySections() {
  return (
    <>
      <p className="text-base text-ink">No account. No subscription. No data sold. The records stay on this phone until you save a backup, delete them, or the browser clears this site.</p>
      <LegalNotice />
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Where it is stored</h2>
        <p className="text-base text-ink">The trailer, the log, the checklists, the notes, and the scale numbers are in this browser’s storage for this site. Photos and receipts are in a file store on the same phone. A Home Screen icon on iPhone does not share that storage with Safari.</p>
        <p className="text-base text-ink">Safari can clear records kept only in the browser after about 7 days without a visit, unless the app is on the Home Screen. The app asks the browser to keep the storage. The browser does not have to agree.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">What leaves the phone</h2>
        <p className="text-base text-ink">Nothing is uploaded for an account. A backup, a CSV, a calendar file, or a weight report leaves only when you tap save or share. Print uses the sheet you send to the printer. The VIN year is calculated on the phone.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">What this copy stores for itself</h2>
        <p className="text-base text-ink">The saved app can keep its own screens and fonts, so those open with no signal. That copy does not include the service log, the notes, or the photos. A version check reads a version file. It does not send the log.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Phone reminders</h2>
        <p className="text-base text-ink">Reminders are optional. The switch on the home screen turns the notice on or off. The due list is not sent to a server. The phone’s settings can block it as well. iPhone delivers a notice from the Home Screen icon, not from a browser tab.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Analytics and cookies</h2>
        <p className="text-base text-ink">None. There is no analytics account and no tracking of which pages you open. There is no advertising cookie. The browser’s own storage holds the records and the theme.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Network</h2>
        <p className="text-base text-ink">Online, the phone loads this app from its own address. It does not send the log, the VIN, or the photos with that load. This copy does not add a script from another site. Shop search can ask this phone for a location. That location sorts the list and is not saved. A factory manual or parts book opens on Airstream’s site. A recall check opens NHTSA. A map, if you tap one, opens the map app. Those sites do not receive the service log. The shop list is stored in the app after you save it. Fonts are files shipped with the app.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Factory manuals</h2>
        <p className="text-base text-ink">This app does not store factory manuals. A manual or a parts book opens on Airstream’s site, in the browser, and only when you tap that link. The pages are not saved on this phone.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Backups</h2>
        <p className="text-base text-ink">A backup is a JSON file. New files include a checksum so a damaged or cut-off file is refused. It does not show that nobody edited the file. Restore shows what is inside and does not write over this phone until you confirm. The previous log stays on this phone until you keep that restore. An older file has no checksum.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">How long it is kept</h2>
        <p className="text-base text-ink">Until you delete the records in the app, or the browser clears this site. A backup you already saved in Files is not deleted by that. The records you enter remain yours.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Children</h2>
        <p className="text-base text-ink">This app is not made for children and it has no account to sign up for.</p>
      </section>
      <p className="text-base text-ink">RivetCare is an independent owner aid. It is not affiliated with Airstream, Inc., and it is not a substitute for the model-year manual. This notice describes what this copy does. It is not a warranty.</p>
    </>
  );
}

export function SupportSections() {
  return (
    <>
      <p className="text-base text-ink">RivetCare is an independent checklist for the owner of an Airstream trailer. It is not affiliated with Airstream, Inc., and it has no account and no call center.</p>
      <LegalNotice />
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Use the app</h2>
        <p className="text-base text-ink">Fix walks a symptom, a flowchart, or a fault code. Maintain shows the jobs that are due for the trailer you picked. Records holds the service log, the scale tickets, and the backup. Offline, Privacy, and Support are in the Library.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">The manual still governs</h2>
        <p className="text-base text-ink">Gas, brakes, shore power, and the water heater can hurt you. If a step in the app disagrees with the model-year manual, or with the plate on the appliance, follow the manual and the plate. Stop and use a qualified technician when the app says to stop.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Phone reminders</h2>
        <p className="text-base text-ink">On the home screen, the Phone reminders switch. iPhone asks only after the app is opened from its Home Screen icon. The notice stays on the phone. The same switch, or Settings for this app, turns it off.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Your records</h2>
        <p className="text-base text-ink">Save a backup from Records before you clear the phone or add a Home Screen icon. An iPhone icon does not share storage with Safari. Privacy explains what stays on the phone and how to delete it.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">This release</h2>
        <p className="text-base text-ink">Personal use of the app, and of a backup you save from it, is allowed. Records you enter remain yours. The copyright notice does not cover factory manuals, trademarks, part numbers, or other third-party materials. Those remain under their own terms. The steps can be wrong. They are not the owner’s manual.</p>
      </section>
      <p className="text-base text-ink">There is no support desk to write to. A dealer or a qualified technician does the work the app tells you not to guess at.</p>
    </>
  );
}
