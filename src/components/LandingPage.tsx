import {
  Activity,
  ArrowRight,
  BellRing,
  FileText,
  HeartPulse,
  LockKeyhole,
  Pill,
  ShieldCheck,
} from "lucide-react";
import type { PatientProfile } from "../types/domain";
import { Badge } from "./Badge";

interface LandingPageProps {
  onLaunch: () => void;
  patients: PatientProfile[];
}

export function LandingPage({ onLaunch, patients }: LandingPageProps) {
  return (
    <div className="landing">
      <nav className="landing-nav" aria-label="Landing navigation">
        <div className="brand-inline">
          <span className="brand-mark">
            <HeartPulse size={22} />
          </span>
          <span>
            <strong>MedDcode</strong>
            <small>Decode your care. Stay on track.</small>
          </span>
        </div>
        <button className="button button-primary" type="button" onClick={onLaunch}>
          Launch Demo
          <ArrowRight size={18} />
        </button>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <Badge tone="neutral">Investor demo MVP</Badge>
          <h1>MedDcode</h1>
          <p className="hero-tagline">Decode your care. Stay on track.</p>
          <p className="hero-text">
            A privacy-first patient companion that turns synthetic medical documents,
            medication lists, reminders, treatment plans, and wearable trends into clear daily
            next steps.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onLaunch}>
              Launch Demo
              <ArrowRight size={18} />
            </button>
            <span className="microcopy">Local demo mode. Synthetic data only.</span>
          </div>
          <div className="trust-strip">
            <span>
              <ShieldCheck size={16} /> No diagnosis
            </span>
            <span>
              <LockKeyhole size={16} /> No telemetry
            </span>
            <span>
              <Pill size={16} /> Non-exhaustive safety checks
            </span>
          </div>
        </div>

        <div className="product-preview" aria-label="MedDcode product preview">
          <div className="preview-header">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-grid">
            <article>
              <FileText size={20} />
              <strong>Lab panel decoded</strong>
              <p>A1C and eGFR flagged for clinician review.</p>
              <div className="mini-bars">
                <span style={{ width: "78%" }}></span>
                <span style={{ width: "55%" }}></span>
                <span style={{ width: "42%" }}></span>
              </div>
            </article>
            <article>
              <Pill size={20} />
              <strong>Medication alert</strong>
              <p>Warfarin + ibuprofen: confirm safer pain options.</p>
              <Badge tone="critical">Critical</Badge>
            </article>
            <article>
              <BellRing size={20} />
              <strong>Today's plan</strong>
              <p>5 reminders, 1 refill review, 2 questions queued.</p>
            </article>
            <article>
              <Activity size={20} />
              <strong>Wearable context</strong>
              <p>Steps 22% below 7-day average.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-band">
        <div>
          <p className="eyebrow">Why MedDcode</p>
          <h2>Care instructions are fragmented. Patients need a safer daily command center.</h2>
        </div>
        <div className="value-grid">
          <article>
            <strong>Patient and caregiver workflow</strong>
            <p>
              Three demo profiles show medication routines, appointment prep, child/parent care,
              and follow-up tracking without real PHI.
            </p>
          </article>
          <article>
            <strong>Medication safety wedge</strong>
            <p>
              Local rules catch visible interaction scenarios while clearly recommending
              pharmacist or clinician confirmation.
            </p>
          </article>
          <article>
            <strong>OCI-ready architecture</strong>
            <p>
              Deterministic demo services are structured for a future secure OCI backend and OCI
              GenAI explanation layer.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-band compact">
        <div>
          <p className="eyebrow">Demo profiles</p>
          <h2>Built for patients, caregivers, and clinician-adjacent reviewers.</h2>
        </div>
        <div className="profile-row">
          {patients.map((patient) => (
            <article key={patient.id} className="profile-card">
              <strong>{patient.displayName}</strong>
              <p>{patient.role}</p>
              <Badge tone={patient.riskLevel === "high" ? "red" : patient.riskLevel === "medium" ? "yellow" : "green"}>
                {patient.riskLevel} demo risk
              </Badge>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
