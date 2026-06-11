import { useEffect, useState } from "react";
import { Cloud, Database, KeyRound, LockKeyhole, ServerCog, ShieldCheck, UserCheck } from "lucide-react";
import {
  fetchOciGenAiAdapterStatus,
  getOciGenAiAdapterStatus,
} from "../services/ociGenAiService";
import { Badge } from "./Badge";

const controls = [
  "Synthetic demo data only",
  "No real PHI in repository",
  "No telemetry",
  "No external API calls unless explicitly configured",
  "User consent required before integrations",
  "Production would require HIPAA-grade controls",
  "Future audit logging, encryption, RBAC, and consent management",
];

export function PrivacySecurity() {
  const [adapter, setAdapter] = useState(getOciGenAiAdapterStatus());

  useEffect(() => {
    void fetchOciGenAiAdapterStatus().then((status) => {
      if (status) setAdapter(status);
    });
  }, []);

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Safety and privacy</p>
          <h2>Privacy-first local demo with conservative medical boundaries.</h2>
          <p>
            MedDcode supports education, organization, and care-team conversations. It does not
            diagnose, prescribe, or replace licensed clinicians.
          </p>
        </div>
        <div className="status-tile">
          <Badge tone={adapter.keyLoaded || adapter.mode === "configured" ? "green" : "neutral"}>{adapter.label}</Badge>
          <p>{adapter.details}</p>
        </div>
      </section>

      <section className="control-grid">
        {controls.map((control) => (
          <article className="panel control-card" key={control}>
            <ShieldCheck size={20} />
            <p>{control}</p>
          </article>
        ))}
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Technical architecture</p>
            <h3>OCI-ready modular MVP</h3>
          </div>
          <ServerCog size={19} />
        </div>
        <div className="architecture-map">
          <div>
            <UserCheck size={22} />
            <strong>React TypeScript UI</strong>
            <p>Patient dashboard, document center, meds, reminders, treatment, fitness, investor pages.</p>
          </div>
          <div>
            <Database size={22} />
            <strong>Local seed data</strong>
            <p>Synthetic documents, medications, appointments, care plans, and wearable samples.</p>
          </div>
          <div>
            <KeyRound size={22} />
            <strong>Deterministic services</strong>
            <p>Parser, translator, interaction engine, reminder logic, fitness insights, readiness report.</p>
          </div>
          <div>
            <Cloud size={22} />
            <strong>Future OCI backend</strong>
            <p>API Gateway, Functions/OKE, Autonomous Database wallet, OCI GenAI, Vault, Logging, WAF.</p>
          </div>
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Medical safety language</p>
            <h3>Boundaries shown throughout the app</h3>
          </div>
          <LockKeyhole size={19} />
        </div>
        <div className="safety-box large">
          <p>Medical interpretations are educational/plain-language support only.</p>
          <p>Medication conflict alerts are non-exhaustive and should be confirmed with a doctor or pharmacist.</p>
          <p>Emergency symptoms trigger urgent-care language and should not be handled by the app.</p>
          <p>Production deployment must complete legal, clinical, security, privacy, and compliance review.</p>
        </div>
      </section>
    </div>
  );
}
