import type { CarePlan } from "../types/domain";

export function calculateCarePlanProgress(plan: CarePlan): number {
  if (plan.tasks.length === 0) return 0;
  const weighted = plan.tasks.reduce((sum, task) => {
    if (task.status === "done") return sum + 1;
    if (task.status === "in-progress") return sum + 0.55;
    if (task.status === "blocked") return sum + 0.15;
    return sum;
  }, 0);
  return Math.round((weighted / plan.tasks.length) * 100);
}

export function getUpcomingCareTasks(plans: CarePlan[]): CarePlan["tasks"] {
  return plans
    .flatMap((plan) => plan.tasks)
    .filter((task) => task.status !== "done")
    .sort((a, b) => (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31"));
}

export function getQuestionQueue(plans: CarePlan[]): string[] {
  return Array.from(new Set(plans.flatMap((plan) => plan.questionsForNextVisit)));
}
