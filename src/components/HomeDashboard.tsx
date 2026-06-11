import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  Pill,
} from "lucide-react";
import type {
  Appointment,
  CarePlan,
  FitnessInsight,
  MedicalDocument,
  MedicationInteractionAlert,
  PatientProfile,
  ReadinessScore,
  Reminder,
} from "../types/domain";
import { Badge } from "./Badge";
import { MetricCard } from "./MetricCard";
import { calculateCarePlanProgress, getQuestionQueue } from "../services/treatmentPlanService";

interface HomeDashboardProps {
  patient: PatientProfile;
  documents: MedicalDocument[];
  alerts: MedicationInteractionAlert[];
  remindersToday: Reminder[];
  appointments: Appointment[];
  carePlans: CarePlan[];
  fitnessInsights: FitnessInsight[];
  readinessScore: ReadinessScore;
  onNavigate: (view: "documents" | "medications" | "reminders" | "treatment" | "fitness") => void;
}

function nextAppointment(appointments: Appointment[]): Appointment | undefined {
  return [...appointments]
    .filter((appointment) => appointment.status !== "completed")
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))[0];
}

export function HomeDashboard({
  patient,
  documents,
  alerts,
  remindersToday,
  appointments,
  carePlans,
  fitnessInsights,
  readinessScore,
  onNavigate,
}: HomeDashboardProps) {
  const appointment = nextAppointment(appointments);
  const avgProgress =
    carePlans.length === 0
      ? 0
      : Math.round(carePlans.reduce((sum, plan) => sum + calculateCarePlanProgress(plan), 0) / carePlans.length);
  const questions = getQuestionQueue(carePlans).slice(0, 4);
  const criticalAlerts = alerts.filter((alert) => alert.severity === "Critical" || alert.severity === "High");
  const docAlerts = documents.filter((document) => /follow|repeat|review|urgent|abnormal/i.test(document.text));

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Good morning</p>
          <h2>{patient.summary}</h2>
          <p>
            MedDcode turns scattered care details into an organized, non-clinical readiness view.
            Confirm decisions with licensed clinicians.
          </p>
        </div>
        <div className="score-card">
          <span>Weekly readiness</span>
          <strong>{readinessScore.score}</strong>
          <p>{readinessScore.label}</p>
          <small>{readinessScore.caveat}</small>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          label="Medication alerts"
          value={alerts.length}
          detail={`${criticalAlerts.length} high-priority checks`}
          tone={criticalAlerts.length ? "danger" : "success"}
          icon={<AlertTriangle />}
        />
        <MetricCard
          label="Today's reminders"
          value={remindersToday.length}
          detail={`${remindersToday.filter((item) => item.status === "completed").length} completed`}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <MetricCard
          label="Care plan progress"
          value={`${avgProgress}%`}
          detail={`${carePlans.length} active plans`}
          icon={<ClipboardList />}
        />
        <MetricCard
          label="Document alerts"
          value={docAlerts.length}
          detail={`${documents.length} documents decoded`}
          icon={<FileWarning />}
          tone={docAlerts.length ? "warn" : "success"}
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Medication safety</p>
              <h3>Active checks</h3>
            </div>
            <button className="icon-text-button" type="button" onClick={() => onNavigate("medications")}>
              <Pill size={16} /> Open
            </button>
          </div>
          <div className="stack-list">
            {alerts.slice(0, 3).map((alert) => (
              <div className="list-row" key={alert.id}>
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.explanation}</p>
                </div>
                <Badge tone={alert.severity.toLowerCase() as "critical" | "high" | "moderate" | "info"}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
            {!alerts.length && <p className="muted">No demo interaction alerts for the active list.</p>}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Today</p>
              <h3>Medications and tasks</h3>
            </div>
            <button className="icon-text-button" type="button" onClick={() => onNavigate("reminders")}>
              <CalendarDays size={16} /> Open
            </button>
          </div>
          <div className="stack-list">
            {remindersToday.slice(0, 5).map((reminder) => (
              <div className="timeline-row" key={reminder.id}>
                <time>{new Date(reminder.dueAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                <div>
                  <strong>{reminder.title}</strong>
                  <p>{reminder.kind} · {reminder.status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Upcoming</p>
              <h3>Appointments</h3>
            </div>
            <Badge tone={appointment?.status === "needs-confirmation" ? "yellow" : "green"}>
              {appointment?.status ?? "none"}
            </Badge>
          </div>
          {appointment ? (
            <div className="appointment-focus">
              <strong>{appointment.title}</strong>
              <p>{appointment.clinician}</p>
              <span>
                {new Date(appointment.dateTime).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ) : (
            <p className="muted">No upcoming appointments in demo data.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Wearable context</p>
              <h3>Daily report</h3>
            </div>
            <button className="icon-text-button" type="button" onClick={() => onNavigate("fitness")}>
              <Activity size={16} /> Open
            </button>
          </div>
          <div className="insight-list">
            {fitnessInsights.slice(0, 3).map((insight) => (
              <div key={insight.metric}>
                <strong>{insight.metric}</strong>
                <span>{insight.value}</span>
                <p>{insight.trend}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Ask your doctor queue</p>
            <h3>Questions prepared from care plans</h3>
          </div>
          <button className="icon-text-button" type="button" onClick={() => onNavigate("treatment")}>
            <ClipboardList size={16} /> Open
          </button>
        </div>
        <div className="question-grid">
          {questions.map((question) => (
            <p key={question}>{question}</p>
          ))}
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Readiness drivers</p>
            <h3>Transparent non-clinical score inputs</h3>
          </div>
          <Badge tone="neutral">Not a health score</Badge>
        </div>
        <div className="driver-row">
          {readinessScore.drivers.map((driver) => (
            <span key={driver}>{driver}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
