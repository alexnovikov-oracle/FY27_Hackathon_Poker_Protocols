import { CalendarCheck, CheckCircle2, ClipboardList, Link2, ListChecks } from "lucide-react";
import type { Appointment, CarePlan, MedicalDocument, Medication } from "../types/domain";
import {
  calculateCarePlanProgress,
  getQuestionQueue,
  getUpcomingCareTasks,
} from "../services/treatmentPlanService";
import { Badge } from "./Badge";

interface TreatmentPlanDashboardProps {
  carePlans: CarePlan[];
  appointments: Appointment[];
  documents: MedicalDocument[];
  medications: Medication[];
}

function statusTone(status: CarePlan["status"]) {
  if (status === "needs-review") return "yellow";
  if (status === "monitoring") return "neutral";
  return "green";
}

export function TreatmentPlanDashboard({
  carePlans,
  appointments,
  documents,
  medications,
}: TreatmentPlanDashboardProps) {
  const tasks = getUpcomingCareTasks(carePlans);
  const questions = getQuestionQueue(carePlans);
  const upcomingAppointments = [...appointments]
    .filter((appointment) => appointment.status !== "completed")
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .slice(0, 4);

  function linkedLabel(linkedId?: string): string {
    if (!linkedId) return "Not linked";
    return (
      documents.find((document) => document.id === linkedId)?.title ??
      medications.find((medication) => medication.id === linkedId)?.name ??
      appointments.find((appointment) => appointment.id === linkedId)?.title ??
      "Linked item"
    );
  }

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Treatment plan</p>
          <h2>Conditions, tasks, goals, follow-ups, and visit questions in one place.</h2>
          <p>
            Tasks can link to documents, medications, appointments, or diagnosis summaries so a
            caregiver can move from medical text to action.
          </p>
        </div>
        <div className="status-tile">
          <Badge tone={tasks.some((task) => task.status === "blocked") ? "yellow" : "green"}>
            {tasks.length} open tasks
          </Badge>
          <p>{questions.length} prepared questions for the next visit.</p>
        </div>
      </section>

      <section className="plan-grid">
        {carePlans.map((plan) => {
          const progress = calculateCarePlanProgress(plan);
          return (
            <article className="panel plan-card" key={plan.id}>
              <div className="panel-header">
                <div>
                  <p className="eyebrow">{plan.owner}</p>
                  <h3>{plan.conditionName}</h3>
                </div>
                <Badge tone={statusTone(plan.status)}>{plan.status}</Badge>
              </div>
              <div className="progress-track" aria-label={`${progress}% complete`}>
                <span style={{ width: `${progress}%` }}></span>
              </div>
              <p className="muted">{progress}% care-plan progress</p>
              <div className="goal-list">
                {plan.goals.map((goal) => (
                  <span key={goal}>
                    <CheckCircle2 size={15} /> {goal}
                  </span>
                ))}
              </div>
              <div className="task-stack">
                {plan.tasks.map((task) => (
                  <div key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.cadence}{task.dueDate ? ` · Due ${task.dueDate}` : ""}</p>
                      <small>
                        <Link2 size={13} /> {linkedLabel(task.linkedId)}
                      </small>
                    </div>
                    <Badge tone={task.status === "blocked" ? "red" : task.status === "done" ? "green" : "yellow"}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Daily checklist</p>
              <h3>Open actions</h3>
            </div>
            <ListChecks size={19} />
          </div>
          <div className="stack-list">
            {tasks.slice(0, 6).map((task) => (
              <div className="list-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.cadence}{task.dueDate ? ` · ${task.dueDate}` : ""}</p>
                </div>
                <Badge tone={task.status === "blocked" ? "red" : "yellow"}>{task.status}</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Timeline</p>
              <h3>Upcoming appointments</h3>
            </div>
            <CalendarCheck size={19} />
          </div>
          <div className="stack-list">
            {upcomingAppointments.map((appointment) => (
              <div className="timeline-row" key={appointment.id}>
                <time>
                  {new Date(appointment.dateTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <div>
                  <strong>{appointment.title}</strong>
                  <p>{appointment.specialty} · {appointment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Weekly report</p>
            <h3>Progress notes</h3>
          </div>
          <ClipboardList size={19} />
        </div>
        <div className="note-grid">
          {carePlans.flatMap((plan) =>
            plan.progressNotes.map((note) => (
              <p key={`${plan.id}-${note}`}>
                <strong>{plan.conditionName}:</strong> {note}
              </p>
            )),
          )}
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Questions for next visit</p>
            <h3>Prepared queue</h3>
          </div>
          <Badge tone="neutral">{questions.length} questions</Badge>
        </div>
        <div className="question-grid">
          {questions.map((question) => (
            <p key={question}>{question}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
