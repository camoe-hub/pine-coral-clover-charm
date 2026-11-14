import { useEffect, useState } from "react";
import { formatWhen } from "@/lib/date";
import { useApp } from "@/lib/store";
import { Btn, Kicker } from "@/components/ui";

export function NotesView() {
  const modelId = useApp((s) => s.modelId);
  const notes = useApp((s) => s.notes);
  const addNote = useApp((s) => s.addNote);
  const updateNote = useApp((s) => s.updateNote);
  const removeNote = useApp((s) => s.removeNote);
  const flash = useApp((s) => s.flash);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // A trailer switch must not keep the previous trailer's unsent text.
  useEffect(() => {
    setDraft("");
    setEditing(null);
    setEditText("");
  }, [modelId]);

  async function saveNew() {
    if (!draft.trim()) {
      flash("The note needs some text");
      return;
    }
    if (!(await Promise.resolve(addNote(draft)))) return;
    setDraft("");
    flash("Saved on this phone");
  }

  async function saveEdit(id: string) {
    if (!(await Promise.resolve(updateNote(id, editText)))) return;
    setEditing(null);
    setEditText("");
  }

  return (
    <div>
      <Kicker>This trailer</Kicker>
      <h1 className="mt-1 font-display text-3xl text-ink">Notes</h1>
      <p className="mt-2 text-sm text-muted">Reminders for this trailer. They are not service records, and they stay on this phone with the log.</p>
      <label className="mt-4 block" htmlFor="personal-note">
        <span className="sr-only">New note</span>
        <textarea
          id="personal-note"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Where the spare key is, a dealer promise, a noise to watch"
          className="min-h-28 w-full rounded-card border border-line bg-sheet px-4 py-3 text-base"
        />
      </label>
      <Btn className="mt-3 w-full" onClick={saveNew}>
        Save note
      </Btn>
      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Add a reminder, such as where the spare key is or a noise to watch.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-card border border-rule bg-sheet px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{formatWhen(note.iso)}</p>
              {editing === note.id ? (
                <form
                  className="mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEdit(note.id);
                  }}
                >
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    aria-label="Edit note"
                    className="min-h-28 w-full rounded-card border border-line bg-paper px-3 py-2 text-base"
                  />
                  <div className="mt-2 flex gap-2">
                    <Btn type="submit">Save</Btn>
                    <Btn
                      type="button"
                      variant="line"
                      onClick={() => {
                        setEditing(null);
                        setEditText("");
                      }}
                    >
                      Cancel
                    </Btn>
                  </div>
                </form>
              ) : (
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-ink">{note.text}</p>
              )}
              {editing !== note.id && (
                <div className="mt-2 flex gap-4">
                  <button
                    type="button"
                    className="min-h-11 text-sm font-semibold text-accent"
                    onClick={() => {
                      setEditing(note.id);
                      setEditText(note.text);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="min-h-11 text-sm font-semibold text-stop" onClick={() => removeNote(note.id)}>
                    Remove
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
