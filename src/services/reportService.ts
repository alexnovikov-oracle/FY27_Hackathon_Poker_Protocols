import type { Appointment, CarePlan, FitnessInsight, MedicationInteractionAlert, ReadinessScore, Reminder } from "../types/domain";
import { calculateCarePlanProgress } from "./treatmentPlanService";

export function computeReadinessScore(input: {
  reminders: Reminder[];
  alerts: MedicationInteractionAlert[];
  appointments: Appointment[];
  carePlans: CarePlan[];
  fitnessInsights: FitnessInsight[];
}): ReadinessScore {
  const completed = input.reminders.filter((reminder) => reminder.status === "completed").length;
  const due = input.reminders.filter((reminder) => reminder.status !== "scheduled").length || 1;
  const adherencePoints = Math.round((completed / due) * 30);
  const taskProgress =
    input.carePlans.length === 0
      ? 0
      : Math.round(
          input.carePlans.reduce((sum, plan) => sum + calculateCarePlanProgress(plan), 0) /
            input.carePlans.length /
            100 *
            25,
        );
  const appointmentPoints = input.appointments.some((appointment) => appointment.status === "needs-confirmation") ? 10 : 15;
  const fitnessPoints = input.fitnessInsights.some((insight) => insight.status === "yellow") ? 12 : 15;
  const alertPenalty = input.alerts.reduce((penalty, alert) => {
    if (alert.severity === "Critical") return penalty + 18;
    if (alert.severity === "High") return penalty + 12;
    if (alert.severity === "Moderate") return penalty + 6;
    return penalty + 2;
  }, 0);
  const score = Math.max(1, Math.min(100, adherencePoints + taskProgress + appointmentPoints + fitnessPoints + 15 - alertPenalty));

  return {
    score,
    label: score >= 80 ? "Ready for next care step" : score >= 60 ? "Needs a few follow-ups" : "Review before next visit",
    drivers: [
      `${completed} completed reminders counted this week`,
      `${input.alerts.length} unresolved medication safety checks`,
      `${input.appointments.filter((appointment) => appointment.status === "needs-confirmation").length} appointments need confirmation`,
      `${input.fitnessInsights.filter((insight) => insight.status === "yellow").length} wearable trends worth asking about`,
    ],
    caveat:
      "This is a non-clinical readiness score for demo workflow organization. It is not a health score or diagnosis.",
  };
}
