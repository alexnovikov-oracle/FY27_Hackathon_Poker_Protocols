import { describe, expect, it } from "vitest";
import type { Reminder } from "../types/domain";
import {
  calculateAdherenceStreak,
  calculateWeeklyAdherence,
  getTodayReminders,
  updateReminderStatus,
} from "../services/reminderService";

const reminders: Reminder[] = [
  {
    id: "one",
    patientId: "patient-test",
    kind: "medication",
    title: "Morning med",
    dueAt: "2026-06-11T08:00:00",
    status: "scheduled",
  },
  {
    id: "two",
    patientId: "patient-test",
    kind: "medication",
    title: "Yesterday med",
    dueAt: "2026-06-10T08:00:00",
    status: "completed",
  },
  {
    id: "three",
    patientId: "patient-test",
    kind: "treatment",
    title: "Two days ago",
    dueAt: "2026-06-09T08:00:00",
    status: "completed",
  },
  {
    id: "four",
    patientId: "patient-test",
    kind: "refill",
    title: "Missed refill",
    dueAt: "2026-06-08T08:00:00",
    status: "missed",
  },
];

describe("reminderService", () => {
  it("returns reminders due today sorted by time", () => {
    const today = getTodayReminders(reminders, "patient-test", "2026-06-11");

    expect(today).toHaveLength(1);
    expect(today[0].id).toBe("one");
  });

  it("updates status without mutating the original reminder array", () => {
    const updated = updateReminderStatus(reminders, "one", "completed");

    expect(updated.find((reminder) => reminder.id === "one")?.status).toBe("completed");
    expect(reminders.find((reminder) => reminder.id === "one")?.status).toBe("scheduled");
  });

  it("calculates weekly adherence from completed due reminders", () => {
    const weekly = calculateWeeklyAdherence(reminders, "patient-test", "2026-06-11");

    expect(weekly.completed).toBe(2);
    expect(weekly.missed).toBe(1);
    expect(weekly.rate).toBe(67);
  });

  it("calculates consecutive completed-day streak", () => {
    const streak = calculateAdherenceStreak(
      [
        ...reminders,
        {
          ...reminders[0],
          id: "today-complete",
          dueAt: "2026-06-11T07:00:00",
          status: "completed",
        },
      ],
      "patient-test",
      "2026-06-11",
    );

    expect(streak).toBe(3);
  });
});
