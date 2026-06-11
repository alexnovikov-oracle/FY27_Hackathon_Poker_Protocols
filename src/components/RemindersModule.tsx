import { FormEvent, useMemo, useState } from "react";
import { BellRing, Check, Clock3, Plus, SkipForward, TimerReset } from "lucide-react";
import type { Reminder, ReminderKind, ReminderStatus } from "../types/domain";
import {
  calculateAdherenceStreak,
  calculateWeeklyAdherence,
  createReminder,
  getMissedReminders,
  getTodayReminders,
  updateReminderStatus,
} from "../services/reminderService";
import { DEMO_TODAY } from "../data/sampleData";
import { Badge } from "./Badge";

interface RemindersModuleProps {
  patientId: string;
  reminders: Reminder[];
  onRemindersChange: (reminders: Reminder[]) => void;
}

const kindOptions: ReminderKind[] = ["medication", "appointment", "treatment", "refill"];

function statusTone(status: ReminderStatus) {
  if (status === "completed") return "green";
  if (status === "missed" || status === "skipped") return "red";
  if (status === "snoozed") return "yellow";
  return "neutral";
}

export function RemindersModule({ patientId, reminders, onRemindersChange }: RemindersModuleProps) {
  const [draft, setDraft] = useState({
    kind: "medication" as ReminderKind,
    title: "",
    dueAt: `${DEMO_TODAY}T09:00`,
    notes: "",
  });
  const today = useMemo(() => getTodayReminders(reminders, patientId, DEMO_TODAY), [reminders, patientId]);
  const missed = useMemo(() => getMissedReminders(reminders, patientId), [reminders, patientId]);
  const weekly = useMemo(() => calculateWeeklyAdherence(reminders, patientId, DEMO_TODAY), [reminders, patientId]);
  const streak = useMemo(() => calculateAdherenceStreak(reminders, patientId, DEMO_TODAY), [reminders, patientId]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onRemindersChange([...reminders, createReminder(draft, patientId)]);
    setDraft({ kind: "medication", title: "", dueAt: `${DEMO_TODAY}T09:00`, notes: "" });
  }

  function setStatus(reminderId: string, status: ReminderStatus) {
    onRemindersChange(updateReminderStatus(reminders, reminderId, status));
  }

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Reminders</p>
          <h2>Medication, appointment, treatment task, and refill reminders.</h2>
          <p>
            The MVP uses in-app reminders and calendar-style views. External calendars and browser
            notifications are optional future integrations.
          </p>
        </div>
        <div className="reminder-stats">
          <div>
            <strong>{weekly.rate}%</strong>
            <span>weekly adherence</span>
          </div>
          <div>
            <strong>{streak}</strong>
            <span>day streak</span>
          </div>
          <div>
            <strong>{missed.length}</strong>
            <span>missed</span>
          </div>
        </div>
      </section>

      <section className="reminder-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Today</p>
              <h3>{today.length} reminders</h3>
            </div>
            <BellRing size={19} />
          </div>
          <div className="reminder-list">
            {today.map((reminder) => (
              <div className="reminder-row" key={reminder.id}>
                <time>{new Date(reminder.dueAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                <div>
                  <strong>{reminder.title}</strong>
                  <p>{reminder.kind}{reminder.notes ? ` · ${reminder.notes}` : ""}</p>
                  <Badge tone={statusTone(reminder.status)}>{reminder.status}</Badge>
                </div>
                <div className="row-actions">
                  <button title="Mark complete" type="button" onClick={() => setStatus(reminder.id, "completed")}>
                    <Check size={16} />
                  </button>
                  <button title="Snooze 30 minutes" type="button" onClick={() => setStatus(reminder.id, "snoozed")}>
                    <TimerReset size={16} />
                  </button>
                  <button title="Skip" type="button" onClick={() => setStatus(reminder.id, "skipped")}>
                    <SkipForward size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Create</p>
              <h3>New reminder</h3>
            </div>
            <Plus size={18} />
          </div>
          <form className="form-grid" onSubmit={submit}>
            <label>
              Type
              <select
                value={draft.kind}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, kind: event.target.value as ReminderKind }))
                }
              >
                {kindOptions.map((kind) => (
                  <option key={kind}>{kind}</option>
                ))}
              </select>
            </label>
            <label>
              Due
              <input
                type="datetime-local"
                value={draft.dueAt}
                onChange={(event) => setDraft((current) => ({ ...current, dueAt: event.target.value }))}
              />
            </label>
            <label className="span-two">
              Title
              <input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="e.g. Bring MRI report to appointment"
              />
            </label>
            <label className="span-two">
              Notes
              <textarea
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Optional synthetic note"
              />
            </label>
            <button className="button button-primary span-two" type="submit">
              <Plus size={17} /> Create reminder
            </button>
          </form>
        </article>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Weekly adherence</p>
            <h3>Summary</h3>
          </div>
          <Clock3 size={19} />
        </div>
        <div className="week-summary">
          <div>
            <strong>{weekly.completed}</strong>
            <span>completed</span>
          </div>
          <div>
            <strong>{weekly.missed}</strong>
            <span>missed</span>
          </div>
          <div>
            <strong>{weekly.skipped}</strong>
            <span>skipped</span>
          </div>
          <div>
            <strong>{weekly.due}</strong>
            <span>due actions counted</span>
          </div>
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Missed reminders</p>
            <h3>Follow-up queue</h3>
          </div>
          <Badge tone={missed.length ? "yellow" : "green"}>{missed.length} missed</Badge>
        </div>
        <div className="stack-list">
          {missed.map((reminder) => (
            <div className="list-row" key={reminder.id}>
              <div>
                <strong>{reminder.title}</strong>
                <p>{new Date(reminder.dueAt).toLocaleString()} · {reminder.kind}</p>
              </div>
              <button className="icon-text-button" type="button" onClick={() => setStatus(reminder.id, "completed")}>
                <Check size={16} /> Resolve
              </button>
            </div>
          ))}
          {!missed.length && <p className="muted">No missed reminders in the current demo profile.</p>}
        </div>
      </section>
    </div>
  );
}
