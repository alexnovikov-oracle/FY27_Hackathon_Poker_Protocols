import type { Reminder, ReminderStatus } from "../types/domain";

function toDateKey(value: string): string {
  return value.slice(0, 10);
}

export function getTodayReminders(
  reminders: Reminder[],
  patientId: string,
  today = new Date().toISOString().slice(0, 10),
): Reminder[] {
  return reminders
    .filter((reminder) => reminder.patientId === patientId && toDateKey(reminder.dueAt) === today)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function getMissedReminders(reminders: Reminder[], patientId: string): Reminder[] {
  return reminders.filter((reminder) => reminder.patientId === patientId && reminder.status === "missed");
}

export function updateReminderStatus(
  reminders: Reminder[],
  reminderId: string,
  status: ReminderStatus,
): Reminder[] {
  return reminders.map((reminder) =>
    reminder.id === reminderId
      ? {
          ...reminder,
          status,
          dueAt:
            status === "snoozed"
              ? new Date(new Date(reminder.dueAt).getTime() + 30 * 60 * 1000).toISOString()
              : reminder.dueAt,
        }
      : reminder,
  );
}

export function createReminder(
  draft: Pick<Reminder, "kind" | "title" | "dueAt" | "notes">,
  patientId: string,
): Reminder {
  return {
    ...draft,
    id: `rem-${Date.now()}`,
    patientId,
    status: "scheduled",
  };
}

export function calculateWeeklyAdherence(
  reminders: Reminder[],
  patientId: string,
  today = new Date().toISOString().slice(0, 10),
): {
  completed: number;
  due: number;
  missed: number;
  skipped: number;
  rate: number;
} {
  const end = new Date(`${today}T00:00:00`);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  const relevant = reminders.filter((reminder) => {
    const due = new Date(reminder.dueAt);
    return reminder.patientId === patientId && due >= start && due <= new Date(`${today}T23:59:59`);
  });
  const completed = relevant.filter((reminder) => reminder.status === "completed").length;
  const missed = relevant.filter((reminder) => reminder.status === "missed").length;
  const skipped = relevant.filter((reminder) => reminder.status === "skipped").length;
  const due = relevant.filter((reminder) => reminder.status !== "scheduled").length;
  return {
    completed,
    due,
    missed,
    skipped,
    rate: due === 0 ? 100 : Math.round((completed / due) * 100),
  };
}

export function calculateAdherenceStreak(
  reminders: Reminder[],
  patientId: string,
  today = new Date().toISOString().slice(0, 10),
): number {
  const completedDates = new Set(
    reminders
      .filter((reminder) => reminder.patientId === patientId && reminder.status === "completed")
      .map((reminder) => toDateKey(reminder.dueAt)),
  );
  let streak = 0;
  const cursor = new Date(`${today}T00:00:00`);
  while (completedDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
