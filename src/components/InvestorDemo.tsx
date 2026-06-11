import { BarChart3, Building2, Layers3, Rocket, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "./Badge";

const sections = [
  {
    title: "Problem",
    text: "Patients and caregivers leave visits with labs, prescriptions, notes, imaging, reminders, and wearable data scattered across systems.",
  },
  {
    title: "Solution",
    text: "MedDcode organizes those inputs into educational explanations, safety checks, care tasks, and questions for the next clinician conversation.",
  },
  {
    title: "Market opportunity",
    text: "The workflow sits across chronic care, medication safety, senior care, family caregiving, and payer/provider care management.",
  },
  {
    title: "Product wedge",
    text: "Start with understandable documents and medication conflict awareness, then retain users through daily reminders and care-plan tracking.",
  },
  {
    title: "Why now",
    text: "Generative AI, wearable adoption, patient portals, and value-based care create demand for safer patient-facing explanation layers.",
  },
  {
    title: "Moat",
    text: "Longitudinal care context, safety-reviewed prompt patterns, adherence workflows, and future FHIR/RxNorm integrations create compounding value.",
  },
  {
    title: "Business model",
    text: "B2C freemium, caregiver family plans, provider/payer care-management SaaS, employer wellness add-ons, and API licensing.",
  },
  {
    title: "Roadmap",
    text: "Secure OCI backend, OCI GenAI orchestration, FHIR ingestion, pharmacist-reviewed interaction engine, consent management, and clinical validation.",
  },
  {
    title: "Risks and mitigations",
    text: "Avoid diagnosis and prescribing claims, keep user consent explicit, validate safety logic clinically, and build HIPAA-grade controls before production.",
  },
];

export function InvestorDemo() {
  return (
    <div className="view-stack">
      <section className="hero-panel investor-hero">
        <div>
          <p className="eyebrow">Investor demo</p>
          <h2>A patient-facing care comprehension platform with a medication safety wedge.</h2>
          <p>
            The MVP shows a credible path from patient pain to enterprise-scale care management,
            with conservative clinical language and a modular technical surface.
          </p>
        </div>
        <div className="investor-score">
          <Sparkles size={24} />
          <strong>VC-ready narrative</strong>
          <p>Problem severity, differentiated workflow, platform modules, and compliance awareness.</p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card metric-success">
          <div className="metric-icon"><TrendingUp /></div>
          <div>
            <p className="eyebrow">Synthetic users</p>
            <strong>3</strong>
            <span>patient/caregiver profiles</span>
          </div>
        </article>
        <article className="metric-card metric-calm">
          <div className="metric-icon"><Layers3 /></div>
          <div>
            <p className="eyebrow">Documents</p>
            <strong>23</strong>
            <span>labs, notes, diagnoses, RX, MRI</span>
          </div>
        </article>
        <article className="metric-card metric-warn">
          <div className="metric-icon"><ShieldAlert /></div>
          <div>
            <p className="eyebrow">Safety scenarios</p>
            <strong>10</strong>
            <span>interaction checks incl. no-conflict cases</span>
          </div>
        </article>
        <article className="metric-card metric-calm">
          <div className="metric-icon"><BarChart3 /></div>
          <div>
            <p className="eyebrow">Wearable samples</p>
            <strong>90</strong>
            <span>30 days across 3 profiles</span>
          </div>
        </article>
      </section>

      <section className="investor-grid">
        {sections.map((section) => (
          <article className="panel investor-card" key={section.title}>
            <Badge tone="neutral">{section.title}</Badge>
            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Enterprise channels</p>
            <h3>Where this can expand</h3>
          </div>
          <Building2 size={19} />
        </div>
        <div className="channel-grid">
          <span>Providers</span>
          <span>Payers</span>
          <span>Employers</span>
          <span>Care management</span>
          <span>Senior care</span>
          <span>API licensing</span>
        </div>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Next proof points</p>
            <h3>What the next version should validate</h3>
          </div>
          <Rocket size={19} />
        </div>
        <div className="roadmap-steps">
          <div>
            <strong>1</strong>
            <p>Secure backend on OCI with audit logging, RBAC, encryption, and consent ledger.</p>
          </div>
          <div>
            <strong>2</strong>
            <p>Clinician-reviewed prompts and deterministic guardrails around OCI GenAI summaries.</p>
          </div>
          <div>
            <strong>3</strong>
            <p>FHIR, RxNorm, DrugBank, FDA label, and wearable connector integrations.</p>
          </div>
          <div>
            <strong>4</strong>
            <p>Clinical usability study measuring comprehension, adherence, and escalation behavior.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
