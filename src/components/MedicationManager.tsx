import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, ClipboardCheck, Pill, Plus } from "lucide-react";
import type { ConflictScenario, Medication, MedicationInteractionAlert } from "../types/domain";
import { checkMedicationInteractions, createMedicationFromDraft } from "../services/medicationInteractionService";
import { Badge } from "./Badge";
import { EmptyState } from "./EmptyState";

interface MedicationManagerProps {
  patientId: string;
  medications: Medication[];
  alerts: MedicationInteractionAlert[];
  conflictScenarios: ConflictScenario[];
  reducedKidneyFunction: boolean;
  onMedicationsChange: (medications: Medication[]) => void;
}

function severityTone(severity: MedicationInteractionAlert["severity"]) {
  if (severity === "Critical") return "critical";
  if (severity === "High") return "high";
  if (severity === "Moderate") return "moderate";
  return "info";
}

export function MedicationManager({
  patientId,
  medications,
  alerts,
  conflictScenarios,
  reducedKidneyFunction,
  onMedicationsChange,
}: MedicationManagerProps) {
  const [draft, setDraft] = useState({
    name: "",
    dose: "",
    route: "oral",
    frequency: "",
    notes: "",
  });
  const [scenarioId, setScenarioId] = useState(conflictScenarios[0]?.id ?? "");

  const scenarioAlerts = useMemo(() => {
    const scenario = conflictScenarios.find((item) => item.id === scenarioId);
    if (!scenario) return [];
    const scenarioMeds = scenario.medicationNames.map((name, index) => ({
      id: `scenario-${index}`,
      patientId,
      name,
      genericName: name,
      dose: "demo",
      route: "oral",
      frequency: "demo scenario",
      prescribingClinician: "Demo scenario",
      startDate: "2026-06-11",
      notes: "Scenario-only interaction check.",
      active: true,
    }));
    return checkMedicationInteractions(scenarioMeds, {
      reducedKidneyFunction: scenario.medicationNames.some((name) =>
        name.toLowerCase().includes("reduced kidney"),
      ),
    });
  }, [conflictScenarios, patientId, scenarioId]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.frequency.trim()) return;
    onMedicationsChange([...medications, createMedicationFromDraft(draft, patientId)]);
    setDraft({ name: "", dose: "", route: "oral", frequency: "", notes: "" });
  }

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Medication manager</p>
          <h2>Visible prescription list with non-exhaustive safety checks.</h2>
          <p>
            Alerts explain why a combination matters, what to ask, and why users should not stop
            prescribed medicine without medical advice.
          </p>
        </div>
        <div className="status-tile">
          <Badge tone={alerts.some((alert) => alert.severity === "Critical") ? "red" : alerts.length ? "yellow" : "green"}>
            {alerts.length} active alerts
          </Badge>
          <p>Future production checks should validate against RxNorm, DrugBank, FDA labels, and pharmacist-reviewed rules.</p>
        </div>
      </section>

      <section className="med-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Prescriptions</p>
              <h3>{medications.length} active entries</h3>
            </div>
            {reducedKidneyFunction && <Badge tone="yellow">Reduced kidney function flag</Badge>}
          </div>
          <div className="medication-list">
            {medications.map((medication) => (
              <div className="medication-row" key={medication.id}>
                <div className="med-icon">
                  <Pill size={18} />
                </div>
                <div>
                  <strong>{medication.name}</strong>
                  <p>
                    {medication.dose} · {medication.route} · {medication.frequency}
                  </p>
                  <span>
                    {medication.prescribingClinician} · Start {medication.startDate}
                    {medication.endDate ? ` · End ${medication.endDate}` : ""}
                  </span>
                  <small>{medication.notes}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Add medication</p>
              <h3>Demo entry</h3>
            </div>
            <Plus size={18} />
          </div>
          <form className="form-grid" onSubmit={submit}>
            <label>
              Medication
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. Ibuprofen"
              />
            </label>
            <label>
              Dose
              <input
                value={draft.dose}
                onChange={(event) => setDraft((current) => ({ ...current, dose: event.target.value }))}
                placeholder="e.g. 200 mg"
              />
            </label>
            <label>
              Route
              <select
                value={draft.route}
                onChange={(event) => setDraft((current) => ({ ...current, route: event.target.value }))}
              >
                <option>oral</option>
                <option>inhaled</option>
                <option>topical</option>
                <option>injection</option>
              </select>
            </label>
            <label>
              Frequency
              <input
                value={draft.frequency}
                onChange={(event) => setDraft((current) => ({ ...current, frequency: event.target.value }))}
                placeholder="e.g. once daily"
              />
            </label>
            <label className="span-two">
              Notes
              <textarea
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Synthetic demo note"
              />
            </label>
            <button className="button button-primary span-two" type="submit">
              <Plus size={17} /> Add and re-check
            </button>
          </form>
        </article>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Conflict alerts</p>
            <h3>Plain-language safety review</h3>
          </div>
          <Badge tone="neutral">Non-exhaustive</Badge>
        </div>
        <div className="alert-grid">
          {alerts.map((alert) => (
            <article key={alert.id} className={`alert-card alert-${severityTone(alert.severity)}`}>
              <div className="alert-card-header">
                <AlertTriangle size={20} />
                <Badge tone={severityTone(alert.severity)}>{alert.severity}</Badge>
              </div>
              <h4>{alert.title}</h4>
              <p>{alert.explanation}</p>
              <strong>Why it matters</strong>
              <p>{alert.whyItMatters}</p>
              <strong>Ask a clinician or pharmacist</strong>
              <p>{alert.askClinician}</p>
              {alert.doNotStopWithoutAdvice && (
                <p className="do-not-stop">Do not stop medication without medical advice.</p>
              )}
              <small>{alert.sourceNote}</small>
            </article>
          ))}
          {!alerts.length && (
            <EmptyState
              title="No active demo alerts"
              detail="The current list did not match the local synthetic interaction rules."
            />
          )}
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Scenario library</p>
            <h3>10 deterministic demo checks</h3>
          </div>
          <ClipboardCheck size={19} />
        </div>
        <div className="scenario-layout">
          <label>
            Scenario
            <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>
              {conflictScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title}
                </option>
              ))}
            </select>
          </label>
          <div className="scenario-result">
            {scenarioAlerts.length ? (
              scenarioAlerts.map((alert) => (
                <div key={alert.id}>
                  <Badge tone={severityTone(alert.severity)}>{alert.severity}</Badge>
                  <strong>{alert.title}</strong>
                  <p>{alert.explanation}</p>
                </div>
              ))
            ) : (
              <p>No synthetic interaction alert expected for this scenario.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
